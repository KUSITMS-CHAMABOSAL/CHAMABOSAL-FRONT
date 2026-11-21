/** API 서버 주소예요. `.env`의 `VITE_API_BASE_URL`(예: https://api.chamabosal.com) */
export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? "";

/**
 * 개발 서버에서 실서버 테스트 토큰(POST /api/auth/test-token)을 받을 때 써요. `.env`의 `VITE_TEST_TOKEN_KEY`, `VITE_TEST_USER`
 * 운영 빌드에서는 항상 비어 있어 번들에 들어가지 않아요.
 */
export const TEST_TOKEN_KEY: string | undefined = import.meta.env.DEV
  ? import.meta.env.VITE_TEST_TOKEN_KEY
  : undefined;
export const TEST_USER: string = import.meta.env.DEV ? (import.meta.env.VITE_TEST_USER ?? "") : "";
