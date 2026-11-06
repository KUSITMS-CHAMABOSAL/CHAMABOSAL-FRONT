import { resolve } from 'node:path'

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import boundaries from 'eslint-plugin-boundaries'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

/*
 * FSD 레이어 규칙 (.claude/rules/architecture.md)
 *
 * 레이어: app > pages > widgets > features > entities > shared
 * - 상위 레이어만 하위 레이어를 import할 수 있습니다.
 * - 같은 레이어의 다른 슬라이스는 import할 수 없습니다. (shared는 세그먼트끼리 허용)
 * - 슬라이스 밖에서는 배럴(index.ts)로만 import합니다.
 * - 앱인토스 SDK는 shared/lib/appsInToss 에서만 import합니다.
 *
 * eslint-plugin-boundaries가 실제 파일 경로를 해석해서 검사하므로,
 * 상대경로·절대경로·동적 import()를 모두 같은 기준으로 잡습니다.
 */

const SLICE_LAYERS = ['pages', 'widgets', 'features', 'entities', 'shared']

/** 같은 슬라이스인지 판별. features·widgets는 role까지 같아야 같은 슬라이스입니다. */
const sameSlice = (type) => ({
  element: {
    type,
    captured: ['features', 'widgets'].includes(type)
      ? { role: '{{from.element.captured.role}}', slice: '{{from.element.captured.slice}}' }
      : { slice: '{{from.element.captured.slice}}' },
  },
})

/** 하위 레이어 슬라이스의 배럴(index.ts)만 허용 */
const barrelOf = (types) => ({ element: { types, fileInternalPath: 'index.ts' } })

const boundariesConfig = {
  files: ['src/**/*.{ts,tsx}'],
  plugins: { boundaries },
  settings: {
    'boundaries/root-path': resolve(import.meta.dirname),
    'import/resolver': { typescript: { project: './tsconfig.app.json' } },
    'boundaries/elements': [
      { type: 'app', pattern: 'src/app' },
      { type: 'pages', pattern: 'src/pages/*', capture: ['slice'] },
      { type: 'widgets', pattern: 'src/widgets/*/*', capture: ['role', 'slice'] },
      { type: 'features', pattern: 'src/features/*/*', capture: ['role', 'slice'] },
      { type: 'entities', pattern: 'src/entities/*', capture: ['slice'] },
      { type: 'shared', pattern: 'src/shared/*', capture: ['slice'] },
    ],
  },
  rules: {
    'boundaries/dependencies': [
      'error',
      {
        default: 'disallow',
        message:
          'FSD 레이어 규칙 위반: {{from.element.type}} → {{to.element.type}}. 상위 레이어만 하위 레이어를 import할 수 있고, 같은 레이어의 다른 슬라이스는 import할 수 없으며, 슬라이스 밖에서는 배럴(index.ts)로만 import합니다. (.claude/rules/architecture.md)',
        policies: [
          // 같은 슬라이스 내부는 자유롭게
          ...SLICE_LAYERS.map((type) => ({ from: { element: { type } }, allow: { to: sameSlice(type) } })),
          { from: { element: { type: 'app' } }, allow: { to: { element: { type: 'app' } } } },
          // shared는 세그먼트끼리 자유롭게, 모든 레이어가 shared를 쓸 수 있음
          { from: { element: { types: ['app', ...SLICE_LAYERS] } }, allow: { to: { element: { type: 'shared' } } } },
          // 하위 레이어 슬라이스는 배럴로만
          { from: { element: { type: 'app' } }, allow: { to: barrelOf(['pages', 'widgets', 'features', 'entities']) } },
          { from: { element: { type: 'pages' } }, allow: { to: barrelOf(['widgets', 'features', 'entities']) } },
          { from: { element: { type: 'widgets' } }, allow: { to: barrelOf(['features', 'entities']) } },
          { from: { element: { type: 'features' } }, allow: { to: barrelOf(['entities']) } },
          // 외부 패키지는 허용 (앱인토스 SDK 제한은 아래 no-restricted-imports에서)
          { allow: { to: { module: { origin: 'external' } } } },
        ],
      },
    ],
    // src 안의 파일이 어느 레이어에도 속하지 않으면 에러
    'boundaries/no-unknown-files': 'error',
  },
}

const SDK_RESTRICTION = [
  'error',
  {
    paths: [
      {
        name: '@apps-in-toss/web-framework',
        message: '앱인토스 SDK는 shared/lib/appsInToss 래퍼를 거쳐서 사용하세요. (@/shared/lib/appsInToss)',
      },
    ],
  },
]

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
  boundariesConfig,
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/shared/lib/appsInToss/**'],
    rules: { 'no-restricted-imports': SDK_RESTRICTION },
  },
  // Prettier와 겹치는 ESLint 스타일 규칙을 끕니다. 다른 설정을 덮어써야 하므로 반드시 맨 마지막에 둡니다.
  eslintConfigPrettier,
])
