import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { FlatCompat } from '@eslint/eslintrc'

const __dirname = dirname(fileURLToPath(import.meta.url))
const compat = new FlatCompat({ baseDirectory: __dirname })

const eslintConfig = [
  {
    ignores: [
      '.next/**', 'out/**', 'public/**', 'node_modules/**', 'next-env.d.ts',
      'app/v2/**', 'app/carousel/**', 'components/v2/**',
      'tools/**', 'scripts/**', '.planning/**', '.claude/**',
    ],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
]

export default eslintConfig
