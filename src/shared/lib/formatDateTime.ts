// 서버 시각은 시간대 없는 KST 문자열("2026-11-05T19:24:00")이에요.
// ponytail: 기기 시간대를 KST로 보고 읽어요. 해외 기기를 지원하면 +09:00을 붙여 읽어요.

/** "2026-11-05T19:24:00" → "오후 7:24" */
export const formatTime = (dateTime: string) =>
  new Date(dateTime).toLocaleTimeString("ko-KR", { hour: "numeric", minute: "2-digit" });

/** 마감 시각까지 남은 분이에요. 1분 미만이 남아도 1로 올리고, 지났으면 0이에요. */
export const minutesUntil = (dateTime: string, now = Date.now()) =>
  Math.max(0, Math.ceil((new Date(dateTime).getTime() - now) / 60_000));

/** 마감 시각까지 남은 초예요. 1초 미만이 남아도 1로 올려서, 마감 시각이 지나야 0이 돼요. */
export const secondsUntil = (dateTime: string, now = Date.now()) =>
  Math.max(0, Math.ceil((new Date(dateTime).getTime() - now) / 1000));

/** 남은 초를 "02:17:50"처럼 시·분·초로 보여줘요. */
export const formatClock = (seconds: number) => {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${pad(Math.floor(seconds / 3600))}:${pad(Math.floor(seconds / 60) % 60)}:${pad(seconds % 60)}`;
};
