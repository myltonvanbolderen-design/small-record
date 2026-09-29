'use client'

import { useActionState, useEffect, useState } from 'react'
import { editorAction, logoutAction, type EditorState } from '@/app/admin/actions'
import type { LinkItem } from '@/lib/links-schema'
import type { FieldError } from '@/lib/links-validate'

function frAgo(iso: string): string {
  if (!iso) return ''
  const date = new Date(iso)
  if (date.getTime() === 0) return 'jamais publié'
  const diffMs = Date.now() - date.getTime()
  const minutes = Math.floor(diffMs / 60000)
  if (minutes < 1) return 'à l’instant'
  if (minutes < 60) return `il y a ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `il y a ${hours} h`
  const days = Math.floor(hours / 24)
  return `il y a ${days} j`
}

function errorFor(errors: FieldError[], id: string, field: FieldError['field']): string | undefined {
  return errors.find((e) => e.id === id && e.field === field)?.message
}

const inputClass =
  'min-h-11 w-full border border-blanc/20 bg-transparent px-3 font-body text-sm text-blanc outline-none focus-visible:border-terracotta'
const labelClass = 'block font-condensed text-[0.6rem] uppercase tracking-[0.25em] text-blanc/70'
const buttonClass =
  'min-h-11 min-w-11 border border-blanc/30 px-3 font-condensed text-xs uppercase tracking-[0.15em] text-blanc transition-colors hover:border-terracotta disabled:opacity-40'

export function LinksEditor({
  items,
  draftUpdatedAt,
  publishedAt,
}: {
  items: LinkItem[]
  draftUpdatedAt: string
  publishedAt: string
}) {
  const initialState: EditorState = {
    items,
    errors: [],
    message: null,
    tone: null,
    notes: [],
    confirm: null,
    draftUpdatedAt,
    publishedAt,
  }
  const [state, formAction, isPending] = useActionState(editorAction, initialState)
  const [draftAgo, setDraftAgo] = useState('')
  const [publishedAgo, setPublishedAgo] = useState('')

  useEffect(() => {
    setDraftAgo(frAgo(state.draftUpdatedAt))
    setPublishedAgo(frAgo(state.publishedAt))
  }, [state.draftUpdatedAt, state.publishedAt])

  const formErrors = state.errors.filter((e) => e.field === 'form')

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <div className="flex items-center justify-between">
        <p className="font-condensed text-xs uppercase tracking-[0.2em] text-blanc/70">
          Éditeur /links
        </p>
        <form action={logoutAction}>
          <button type="submit" className="font-condensed text-[0.65rem] uppercase tracking-[0.15em] text-blanc/55 underline">
            Se déconnecter
          </button>
        </form>
      </div>

      <p className="mt-2 font-body text-[0.7rem] text-blanc/55">
        Brouillon modifié {draftAgo || '…'} · En ligne depuis {publishedAgo || '…'}
      </p>

      {state.message ? (
        <p
          role="alert"
          className={`mt-3 font-body text-sm ${
            state.tone === 'error' ? 'text-terracotta-light' : 'text-blanc'
          }`}
        >
          {state.message}
        </p>
      ) : null}

      {formErrors.length > 0 ? (
        <div role="alert" className="mt-3 border border-terracotta-light px-3 py-2">
          <ul className="list-disc pl-4 font-body text-sm text-terracotta-light">
            {formErrors.map((e, i) => (
              <li key={i}>{e.message}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {state.notes.length > 0
        ? state.notes.map((note, i) => (
            <p key={i} className="mt-2 font-body text-[0.7rem] text-blanc/55">
              {note}
            </p>
          ))
        : null}

      <form action={formAction} className="mt-4">
        <input type="hidden" name="ids" value={state.items.map((i) => i.id).join(',')} />

        <div className="flex flex-col gap-4">
          {state.items.map((item, index) => {
            const labelError = errorFor(state.errors, item.id, 'label')
            const sublabelError = errorFor(state.errors, item.id, 'sublabel')
            const hrefError = errorFor(state.errors, item.id, 'href')
            const isDeleteConfirm = state.confirm?.kind === 'delete' && state.confirm.id === item.id

            return (
              <fieldset key={item.id} className="border border-blanc/15 p-3">
                <legend className="sr-only">Lien {index + 1}</legend>

                <label htmlFor={`label__${item.id}`} className={labelClass}>
                  Label
                </label>
                <input
                  id={`label__${item.id}`}
                  name={`label__${item.id}`}
                  defaultValue={item.label}
                  aria-invalid={labelError ? 'true' : undefined}
                  aria-describedby={labelError ? `label__${item.id}-error` : undefined}
                  className={`mt-1 ${inputClass}`}
                  disabled={isPending}
                />
                {labelError ? (
                  <p id={`label__${item.id}-error`} role="alert" className="mt-1 font-body text-xs text-terracotta-light">
                    {labelError}
                  </p>
                ) : null}

                <label htmlFor={`sublabel__${item.id}`} className={`${labelClass} mt-3`}>
                  Sous-titre
                </label>
                <input
                  id={`sublabel__${item.id}`}
                  name={`sublabel__${item.id}`}
                  defaultValue={item.sublabel ?? ''}
                  aria-invalid={sublabelError ? 'true' : undefined}
                  aria-describedby={sublabelError ? `sublabel__${item.id}-error` : undefined}
                  className={`mt-1 ${inputClass}`}
                  disabled={isPending}
                />
                {sublabelError ? (
                  <p id={`sublabel__${item.id}-error`} role="alert" className="mt-1 font-body text-xs text-terracotta-light">
                    {sublabelError}
                  </p>
                ) : null}

                <label htmlFor={`href__${item.id}`} className={`${labelClass} mt-3`}>
                  URL
                </label>
                <input
                  id={`href__${item.id}`}
                  name={`href__${item.id}`}
                  defaultValue={item.href}
                  aria-invalid={hrefError ? 'true' : undefined}
                  aria-describedby={hrefError ? `href__${item.id}-error` : undefined}
                  className={`mt-1 ${inputClass}`}
                  disabled={isPending}
                />
                {hrefError ? (
                  <p id={`href__${item.id}-error`} role="alert" className="mt-1 font-body text-xs text-terracotta-light">
                    {hrefError}
                  </p>
                ) : null}

                <div className="mt-3 flex items-center gap-2">
                  <input
                    id={`active__${item.id}`}
                    name={`active__${item.id}`}
                    type="checkbox"
                    defaultChecked={item.active}
                    className="h-5 w-5"
                    disabled={isPending}
                  />
                  <label htmlFor={`active__${item.id}`} className="font-body text-sm text-blanc/80">
                    Visible
                  </label>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="submit"
                    name="intent"
                    value={`up:${item.id}`}
                    aria-label={`Monter ${item.label || 'ce lien'}`}
                    disabled={isPending || index === 0}
                    className={buttonClass}
                  >
                    ▲
                  </button>
                  <button
                    type="submit"
                    name="intent"
                    value={`down:${item.id}`}
                    aria-label={`Descendre ${item.label || 'ce lien'}`}
                    disabled={isPending || index === state.items.length - 1}
                    className={buttonClass}
                  >
                    ▼
                  </button>
                  <button
                    type="submit"
                    name="intent"
                    value={`delete:${item.id}`}
                    aria-label={`Supprimer ${item.label || 'ce lien'}`}
                    disabled={isPending}
                    className={buttonClass}
                  >
                    Supprimer
                  </button>
                </div>

                {isDeleteConfirm ? (
                  <div role="alert" className="mt-3 border border-terracotta-light p-2">
                    <p className="font-body text-sm text-blanc">
                      Supprimer « {item.label || item.id} » ?
                    </p>
                    <div className="mt-2 flex gap-2">
                      <button
                        type="submit"
                        name="intent"
                        value={`confirm-delete:${item.id}`}
                        disabled={isPending}
                        className={buttonClass}
                      >
                        Confirmer
                      </button>
                      <button
                        type="submit"
                        name="intent"
                        value="cancel"
                        disabled={isPending}
                        className={buttonClass}
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : null}
              </fieldset>
            )
          })}
        </div>

        {state.confirm?.kind === 'publish' ? (
          <div role="alert" className="mt-4 border border-terracotta-light p-3">
            <p className="font-body text-sm text-blanc">Publier le brouillon en ligne ?</p>
            <div className="mt-2 flex gap-2">
              <button
                type="submit"
                name="intent"
                value="confirm-publish"
                disabled={isPending}
                className={buttonClass}
              >
                Confirmer
              </button>
              <button
                type="submit"
                name="intent"
                value="cancel"
                disabled={isPending}
                className={buttonClass}
              >
                Annuler
              </button>
            </div>
          </div>
        ) : null}

        <div className="mt-6 flex flex-col gap-2 border-t border-blanc/15 pt-4">
          <button
            type="submit"
            name="intent"
            value="save"
            disabled={isPending}
            className={`${buttonClass} w-full`}
          >
            {isPending ? 'Enregistrer…' : 'Enregistrer'}
          </button>
          <button
            type="submit"
            name="intent"
            value="publish"
            disabled={isPending}
            className={`${buttonClass} w-full`}
          >
            {isPending ? 'Publier…' : 'Publier'}
          </button>
          <button
            type="submit"
            name="intent"
            value="add"
            disabled={isPending}
            className={`${buttonClass} w-full`}
          >
            {isPending ? 'Ajouter…' : 'Ajouter un lien'}
          </button>
          <a
            href="/links/"
            target="_blank"
            rel="noopener noreferrer"
            className={`${buttonClass} block w-full text-center`}
          >
            Prévisualiser
          </a>
          <p className="font-body text-[0.65rem] text-blanc/55">
            montre la version en ligne, pas le brouillon
          </p>
        </div>
      </form>
    </div>
  )
}
