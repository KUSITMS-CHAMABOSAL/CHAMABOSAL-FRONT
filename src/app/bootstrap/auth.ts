import { issueTestToken, login } from "@/entities/session";
import { TEST_TOKEN_KEY, TEST_USER } from "@/shared/config";
import { getAnonymousKeyAuthCode } from "@/shared/lib/appsInToss";

/** 액세스 토큰을 새로 받아요. 개발 서버에 테스트 키가 있으면 테스트 토큰, 아니면 앱인토스 익명 키 인증 코드를 써요. */
export const fetchAccessToken = async () => {
  if (TEST_TOKEN_KEY) return (await issueTestToken(TEST_USER, TEST_TOKEN_KEY)).accessToken;
  return (await login(await getAnonymousKeyAuthCode())).accessToken;
};
