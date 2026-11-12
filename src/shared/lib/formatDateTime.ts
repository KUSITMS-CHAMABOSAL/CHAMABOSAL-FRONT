// 서버 시각은 시간대 없는 KST 문자열("2026-11-05T19:24:00")이에요.
// ponytail: 기기 시간대를 KST로 보고 읽어요. 해외 기기를 지원하면 +09:00을 붙여 읽어요.

/** "2026-11-05T19:24:00" → "오후 7:24" */
export const formatTime = (dateTime: string) =>
  new Date(dateTime).toLocaleTimeString("ko-KR", { hour: "numeric", minute: "2-digit" });

/** 마감 시각까지 남은 분이에요. 1분 미만이 남아도 1로 올리고, 지났으면 0이에요. */
export const minutesUntil = (dateTime: string, now = Date.now()) =>
  Math.max(0, Math.ceil((new Date(dateTime).getTime() - now) / 60_000));
