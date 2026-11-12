/** 서버 실패 응답이에요. 화면은 `code`(예: ROOM_005)로 분기해요. */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly field?: string;

  constructor(status: number, code: string, message: string, field?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.field = field;
  }
}

export const isApiError = (error: unknown, ...codes: string[]): error is ApiError =>
  error instanceof ApiError && (codes.length === 0 || codes.includes(error.code));
