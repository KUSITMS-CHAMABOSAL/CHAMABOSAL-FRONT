import { API_BASE_URL } from "@/shared/config";

import { ApiError } from "./apiError";
import { mockFetch } from "./mock";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/** 서버 공통 응답이에요. 성공이면 `data`, 실패면 `code`(예: ROOM_005)와 `message`가 와요. */
interface ApiEnvelope<T> {
  success: boolean;
  code: string;
  message: string;
  field?: string;
  data?: T;
}

interface RequestOptions {
  /** false면 토큰 없이 보내요. 로그인 API처럼 토큰을 받기 전에 부르는 요청에 써요. */
  auth?: boolean;
  headers?: Record<string, string>;
}

// 토큰은 메모리에만 둬요. 앱을 다시 열면 새로 로그인해요.
let tokenProvider: (() => Promise<string>) | null = null;
let tokenPromise: Promise<string> | null = null;

/** `app`이 로그인 방법을 등록해요. 토큰이 없거나 만료(401)되면 이걸로 다시 받아요. */
export const setTokenProvider = (provider: () => Promise<string>) => {
  tokenProvider = provider;
  tokenPromise = null;
};

// 동시에 여러 요청이 와도 로그인은 한 번만 해요. 실패하면 다음 요청에서 다시 시도해요.
const getToken = (provider: () => Promise<string>) =>
  (tokenPromise ??= provider().catch((error: unknown) => {
    tokenPromise = null;
    throw error;
  }));

/** API를 호출하고 `data`를 돌려줘요. 실패 응답은 `ApiError`로 던져요. */
export const request = async <T = void>(
  method: Method,
  path: string,
  body?: unknown,
  { auth = true, headers }: RequestOptions = {},
) => {
  // ponytail: 로그인(/api/auth/*)만 실서버에 붙어 있어요. 나머지 API를 붙일 때 이 분기를 지워요.
  if (!path.startsWith("/api/auth/")) return parse<T>(await mockFetch(method, path, body));

  const provider = auth ? tokenProvider : null;
  const send = (token: string | null) =>
    fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });

  if (!provider) return parse<T>(await send(null));

  const used = getToken(provider);
  const response = await send(await used);
  if (response.status !== 401) return parse<T>(response);

  // 토큰이 만료됐어요. 다른 요청이 이미 새로 받았으면 그걸 쓰고, 아니면 다시 로그인해 한 번만 재시도해요.
  if (tokenPromise === used) tokenPromise = null;
  return parse<T>(await send(await getToken(provider)));
};

const parse = async <T>(response: Response) => {
  const envelope = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;
  if (!response.ok || !envelope?.success)
    throw new ApiError(
      response.status,
      envelope?.code ?? "COMMON_999",
      envelope?.message ?? "",
      envelope?.field,
    );
  return envelope.data as T;
};
