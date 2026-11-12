import { request } from "@/shared/api";

import type { LoginResponse, TestTokenResponse } from "../model/types";

/** 앱인토스 인증 코드로 로그인해요. 처음 온 사용자는 서버가 새로 만들어요. */
export const login = (authorizationCode: string) =>
  request<LoginResponse>("POST", "/api/auth/login", { authorizationCode }, { auth: false });

/** 개발 환경 전용 테스트 토큰이에요. `key`는 서버 비밀값이에요. */
export const issueTestToken = (testUser: string, key: string) =>
  request<TestTokenResponse>(
    "POST",
    "/api/auth/test-token",
    { testUser },
    { auth: false, headers: { "X-Test-Token-Key": key } },
  );
