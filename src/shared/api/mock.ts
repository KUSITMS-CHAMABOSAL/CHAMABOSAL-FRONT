/** 목 핸들러예요. 메서드와 경로를 받아 서버와 같은 모양의 응답(상태 코드, 본문)을 돌려줘요. */
export type MockHandler = (
  method: string,
  path: string,
  body: unknown,
) => { status: number; body: unknown } | Promise<{ status: number; body: unknown }>;

let handler: MockHandler | null = null;

/** 개발 서버에서 `app`이 목 핸들러를 등록해요. shared는 목 데이터를 모르게 해서 레이어를 지켜요. */
export const setMockHandler = (next: MockHandler) => {
  handler = next;
};

const MOCK_DELAY_MS = 300;

export const mockFetch = async (method: string, path: string, body: unknown) => {
  if (!handler) throw new Error("목 핸들러가 등록되지 않았어요.");
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY_MS));
  const result = await handler(method, path, body);
  return new Response(JSON.stringify(result.body), {
    status: result.status,
    headers: { "Content-Type": "application/json" },
  });
};
