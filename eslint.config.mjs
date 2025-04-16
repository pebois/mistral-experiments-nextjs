import { FlatCompat } from '@eslint/eslintrc'
import pluginJs from '@eslint/js'
import { dirname } from 'path'
import tseslint from 'typescript-eslint'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...compat.config({
    extends: ['next'],
    rules: {
      // ----
      'indent': [
        'error',
        2
      ],
      'linebreak-style': [
        'error',
        'unix'
      ],
      'quotes': [
        'error',
        'single'
      ],
      'semi': [
        'error',
        'never'
      ],
      // ----
      'jsx-quotes': [
        'error',
        'prefer-double'
      ],
      'react/jsx-closing-bracket-location': [
        1,
        {
          'selfClosing': 'after-props',
          'nonEmpty': 'after-props'
        }
      ],
      'react/jsx-first-prop-new-line': [
        'error',
        'multiline'
      ],
      'react/jsx-max-props-per-line': [
        'error',
        {
          'maximum': 1,
          'when': 'always'
        }
      ],
      'react/jsx-props-no-multi-spaces': [
        'error',
      ],
      'react/jsx-sort-props': [
        'error',
        {
          'callbacksLast': true,
          'shorthandFirst': true,
          'ignoreCase': true,
          'noSortAlphabetically': false,
          'reservedFirst': true
        }
      ],
      'react/react-in-jsx-scope': 'off',
      // ----
      'no-constant-condition': 'off',
      // Handled by typescript compiler
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-namespace': 'off',
    },
  })
]

export default eslintConfig
