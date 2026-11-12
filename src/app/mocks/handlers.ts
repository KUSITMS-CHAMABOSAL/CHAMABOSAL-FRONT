import type { MockHandler } from "@/shared/api";

import { SCENARIOS } from "./scenarios";

const ok = (data?: unknown, status = 200) => ({
  status,
  body: { success: true, code: String(status), message: "요청이 성공했습니다.", data },
});
const fail = (status: number, code: string, message: string) => ({
  status,
  body: { success: false, code, message },
});

const name = new URLSearchParams(window.location.search).get("demo") ?? "default";
// 새로고침 전까지 리액션·삭제를 기억하도록 시나리오를 한 번만 만들어요.
const state = (SCENARIOS[name] ?? SCENARIOS.default)();

const findCertification = (certificationId: number) => {
  for (const today of Object.values(state.rooms))
    for (const member of today.members)
      if (member.certification?.certificationId === certificationId) return { today, member };
  return null;
};

const pad = (value: number) => String(value).padStart(2, "0");
const now = new Date();
const thisMonth = `${now.getFullYear()}-${pad(now.getMonth() + 1)}`;

/** 인증 캘린더 목 데이터예요. 달마다 같은 규칙으로 참은 날·못 참은 날을 섞고, 이번 달은 오늘까지만 채워요. */
const calendarOf = (month: string) => {
  if (month > thisMonth) return [];
  const [year, monthNumber] = month.split("-").map(Number);
  const lastDay = month === thisMonth ? now.getDate() : new Date(year, monthNumber, 0).getDate();
  return Array.from({ length: lastDay }, (_, index) => index + 1).flatMap(day => {
    if (day % 5 === 2) return [{ date: `${month}-${pad(day)}`, result: "FAILED" }];
    if (day % 3 !== 0) return [{ date: `${month}-${pad(day)}`, result: "ENDURED" }];
    return [];
  });
};

/** API 초안의 경로와 응답 모양을 흉내 내요. 없는 경로는 404예요. */
export const mockHandler: MockHandler = (method, path, body) => {
  const route = `${method} ${path}`;
  let match: RegExpMatchArray | null;

  if (route === "GET /api/users/me") return ok(state.me);

  if ((match = route.match(/^GET \/api\/rooms\/(\d+)\/today$/))) {
    const today = state.rooms[Number(match[1])];
    if (today) return ok(today);
    // 서버처럼 사라진 방은 내 방 목록에서도 빠져요.
    state.me.rooms = state.me.rooms.filter(room => room.roomId !== Number(match![1]));
    return fail(404, "ROOM_005", "없거나 삭제된 방입니다.");
  }

  if ((match = route.match(/^POST \/api\/rooms\/(\d+)\/pokes$/))) return ok(undefined, 201);

  if ((match = route.match(/^(PUT|DELETE) \/api\/certifications\/(\d+)\/reactions\/me$/))) {
    const found = findCertification(Number(match[2]));
    if (!found?.member.certification) return fail(404, "CERT_002", "없는 인증입니다.");
    found.member.certification.myReaction =
      match[1] === "PUT" ? (body as { type: "RICE" | "MOKTAK" }).type : null;
    return ok();
  }

  if ((match = route.match(/^DELETE \/api\/certifications\/(\d+)$/))) {
    const found = findCertification(Number(match[1]));
    if (!found) return ok({ riceRecalled: 0, potRecalled: 0 });
    found.member.certification = null;
    found.today.pot.amount = Math.max(0, found.today.pot.amount - 10);
    return ok({ riceRecalled: 10, potRecalled: 10 });
  }

  if (
    (match = route.match(
      /^GET \/api\/rooms\/(\d+)\/members\/me\/calendar(?:\?month=(\d{4}-\d{2}))?$/,
    ))
  ) {
    if (!state.rooms[Number(match[1])]) return fail(404, "ROOM_005", "없거나 삭제된 방입니다.");
    const month = match[2] ?? thisMonth;
    return ok({ month, calendar: calendarOf(month) });
  }

  return fail(404, "COMMON_404", `목에 없는 API예요: ${route}`);
};
