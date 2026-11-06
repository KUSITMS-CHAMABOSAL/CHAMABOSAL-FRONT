# 테스트 도구 도입

사용자 확인 후 진행합니다. Vitest 5, jsdom 31, React 18, Vite 8 조합에서 테스트, `tsc -b`, FSD 린트, `pnpm build`가 모두 통과하고 번들에 테스트 코드가 들어가지 않는 것을 확인했습니다.

1. `pnpm add -D vitest jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom`
2. `package.json`의 `scripts`에 `"test": "vitest run"`을 추가합니다.
3. 아래 파일을 복사합니다. `.template` 확장자는 지웁니다.

| 템플릿                             | 복사할 위치                               |
| ---------------------------------- | ----------------------------------------- |
| `vitest.config.ts.template`        | `vitest.config.ts`                        |
| `setup.ts.template`                | `src/shared/test/setup.ts`                |
| `renderWithProviders.tsx.template` | `src/shared/test/renderWithProviders.tsx` |
| `tdsStubs.tsx.template`            | `src/shared/test/tdsStubs.tsx`            |

- `vite.config.ts`와 설정을 분리합니다. 앱인토스 devtools 플러그인이 테스트에 필요 없기 때문입니다.
- 공용 도구를 `src/shared/test`에 두어야 FSD 린트의 `boundaries/no-unknown-files`를 통과합니다.
- 첫 테스트가 순수 함수뿐이어도 위 구성을 한 번에 모두 도입합니다. 이후 컴포넌트 테스트에서 다시 도입하지 않기 위해서입니다.
- 도입 후 `record-decision` 스킬로 결정을 남깁니다.
