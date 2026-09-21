import { Fragment } from 'react'

interface EventFact {
  label: string
  lines: string[]
}

export function EventFacts({ facts }: { facts: EventFact[] }) {
  return (
    <div className="grid grid-cols-2 gap-6 border-t border-blanc/10 pt-6">
      {facts.map((fact) => (
        <div key={fact.label}>
          <span className="font-condensed text-[0.55rem] uppercase tracking-[0.4em] text-blanc/55">
            {fact.label}
          </span>
          <p className="mt-2 font-body text-[0.95rem] leading-[1.6] text-blanc/55">
            {fact.lines.map((line, i) => (
              <Fragment key={i}>
                {i > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </p>
        </div>
      ))}
    </div>
  )
}
