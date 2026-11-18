import { Clipboard, SetClipboardTextPermissionError } from "@apps-in-toss/web-framework";

/** 텍스트를 클립보드에 복사해요. `apps-in-toss.config.ts`에 `clipboard: write` 권한이 있어야 해요. */
export const copyToClipboard = (text: string) => Clipboard.setText(text);

/**
 * 사용자가 클립보드 쓰기 권한을 거부했어요. 판단 기준은 `Clipboard.setText` 문서 예제와 같아요.
 * devtools 목은 거부하면 `code: "NOT_ALLOWED"`를 던져서 브라우저에서는 일반 실패로 보여요.
 */
export const isClipboardPermissionError = (error: unknown) =>
  error instanceof SetClipboardTextPermissionError ||
  (typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "PERMISSION_DENIED");
