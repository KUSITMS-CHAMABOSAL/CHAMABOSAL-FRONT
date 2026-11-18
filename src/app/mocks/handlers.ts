import type { MockHandler } from "@/shared/api";

import type { BosalColor } from "@/entities/bosal";
import { MAX_JOINED_ROOMS, type RoomGoal, type TodayResponse } from "@/entities/room";

import { FULL_ROOM_ID, inviteRoom, member, SCENARIOS, today } from "./scenarios";

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

const todayDate = `${thisMonth}-${pad(now.getDate())}`;

/**
 * 인증 캘린더 목 데이터예요. 달마다 같은 규칙으로 참은 날·못 참은 날을 섞고, 이번 달은 오늘까지만 채워요.
 * 오늘 칸은 그 방 오늘 탭의 내 인증을 따라서, 인증을 지우면 캘린더에서도 빠져요.
 */
const calendarOf = (roomId: number, month: string) => {
  if (month > thisMonth) return [];
  const [year, monthNumber] = month.split("-").map(Number);
  const lastDay = month === thisMonth ? now.getDate() : new Date(year, monthNumber, 0).getDate();
  const myToday = state.rooms[roomId]?.members.find(member => member.isMe)?.certification;
  return Array.from({ length: lastDay }, (_, index) => index + 1).flatMap(day => {
    const date = `${month}-${pad(day)}`;
    if (date === todayDate) return myToday ? [{ date, result: myToday.result }] : [];
    if (day % 5 === 2) return [{ date, result: "FAILED" }];
    if (day % 3 !== 0) return [{ date, result: "ENDURED" }];
    return [];
  });
};

const COLORS: BosalColor[] = ["PINK", "PURPLE", "MINT", "YELLOW"];
let nextMemberId = 100;

/** 서버처럼 이 방에서 아직 아무도 안 쓴 색 중 하나를 골라요. */
const pickColor = (taken: BosalColor[]) =>
  COLORS.find(color => !taken.includes(color)) ?? COLORS[0];

// 아직 들어가지 않은 남의 방이에요. 내 방 목록(state.rooms)에 넣으면 홈 화면에 보여서 따로 둬요.
let invited: TodayResponse | null = null;

/** 나갔다가 다시 들어오는 경우예요. `invite`와 같은 방이고 예전 닉네임을 돌려줘요. */
const REJOIN_TOKEN = "rejoin";

/** 초대 토큰이 가리키는 방이에요. 토큰 규칙은 `scenarios.ts`의 `inviteRoom` 주석에 있어요. */
const findInviteRoom = (token: string) => {
  const own = token.match(/^room(\d+)$/);
  if (own) return state.rooms[Number(own[1])] ?? null;
  if (token === "full") {
    const room = inviteRoom(FULL_ROOM_ID);
    room.members.push(member(13, "태경", "YELLOW", false), member(14, "윤지", "PINK", false));
    return room;
  }
  if (token !== "invite" && token !== REJOIN_TOKEN) return null;
  invited ??= inviteRoom();
  return invited;
};

const isMyRoom = (roomId: number) => state.me.rooms.some(room => room.roomId === roomId);

/** 서버의 판단 순서대로 입장할 수 있는지 봐요. */
const judgeInvite = (token: string) => {
  const room = findInviteRoom(token);
  if (!room) return { status: "UNAVAILABLE", room: null } as const;
  if (isMyRoom(room.room.roomId)) return { status: "ALREADY_MEMBER", room } as const;
  if (state.me.rooms.length >= MAX_JOINED_ROOMS) return { status: "ROOM_LIMIT", room } as const;
  if (room.members.length >= room.room.memberLimit) return { status: "ROOM_FULL", room } as const;
  return { status: "JOINABLE", room } as const;
};

const NICKNAME = /^[가-힣a-zA-Z0-9]{1,8}$/;
const ROOM_NAME = /^[가-힣a-zA-Z0-9 ]{1,12}$/;
/** 서버가 절약 목표마다 내려주는 제목과 설명이에요. 기획 문구를 따르고, 줄바꿈 위치는 목이에요. */
const GOAL_TEXTS: Record<RoomGoal, { goalTitle: string; goalDescription: string }> = {
  DELIVERY: {
    goalTitle: "배달 끊기 방",
    goalDescription: "배달 대신 집밥 먹고\n첫 공양미 한 솥까지 함께 가요",
  },
  SNACK: {
    goalTitle: "간식 참기 방",
    goalDescription: "달콤한 유혹은 잠시 내려놓고\n첫 공양미 한 솥까지 함께 가요",
  },
  SHOPPING: {
    goalTitle: "쇼핑 참기 방",
    goalDescription: "오늘의 지름신을 물리치고\n첫 공양미 한 솥까지 함께 가요",
  },
  ETC: {
    goalTitle: "자율 절약 방",
    goalDescription: "나만의 번뇌를 내려놓고\n첫 공양미 한 솥까지 함께 가요",
  },
};
const isGoal = (goal: string): goal is RoomGoal => goal in GOAL_TEXTS;

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

  if (route === "GET /api/rooms/new-color")
    return ok({ color: COLORS[Math.floor(Math.random() * COLORS.length)] });

  if (route === "POST /api/rooms") {
    const request = body as {
      name: string;
      goal: string;
      memberLimit: number;
      potGoalAmount: number;
      nickname: string;
      color: BosalColor;
    };
    const name = request.name.trim();
    const nickname = request.nickname.trim();
    if (!ROOM_NAME.test(name)) return fail(400, "COMMON_002", "요청 값이 올바르지 않아요.");
    if (!NICKNAME.test(nickname)) return fail(400, "COMMON_002", "요청 값이 올바르지 않아요.");
    if (!isGoal(request.goal)) return fail(400, "COMMON_002", "요청 값이 올바르지 않아요.");
    if (!COLORS.includes(request.color))
      return fail(400, "COMMON_002", "요청 값이 올바르지 않아요.");
    if (state.me.rooms.length >= MAX_JOINED_ROOMS)
      return fail(409, "ROOM_001", "참여 중인 방이 2개예요.");

    const roomId = Math.max(FULL_ROOM_ID, ...state.me.rooms.map(room => room.roomId)) + 1;
    const memberId = ++nextMemberId;
    const { color } = request;
    const room = today(roomId, name, [member(memberId, nickname, color, true)]);
    room.room.goal = request.goal;
    room.room.memberLimit = request.memberLimit;
    room.pot.goalAmount = request.potGoalAmount;
    state.rooms[roomId] = room;
    state.me.rooms.push({ roomId, name, nickname, color, hasUnseen: false });
    state.me.canCreateRoom = state.me.rooms.length < MAX_JOINED_ROOMS;
    return ok({ roomId, memberId, nickname, color }, 201);
  }

  if ((match = route.match(/^POST \/api\/rooms\/(\d+)\/members\/me\/invite-token$/))) {
    const roomId = Number(match[1]);
    if (!state.rooms[roomId]) return fail(404, "ROOM_005", "없거나 삭제된 방이에요.");
    if (!isMyRoom(roomId)) return fail(403, "ROOM_002", "이 방의 멤버가 아니에요.");
    return ok({ inviteToken: `room${roomId}` }, 201);
  }

  if ((match = route.match(/^GET \/api\/invites\/([^/]+)$/))) {
    const { status, room } = judgeInvite(decodeURIComponent(match[1]));
    if (!room) {
      return ok({ status, room: null, inviterNickname: null, previousNickname: null });
    }
    const { roomId, name, goal, memberLimit } = room.room;
    return ok({
      status,
      room: {
        roomId,
        name,
        goal,
        ...GOAL_TEXTS[goal],
        memberCount: room.members.length,
        memberLimit,
      },
      inviterNickname: room.members[0]?.nickname ?? null,
      previousNickname: decodeURIComponent(match[1]) === REJOIN_TOKEN ? "윤지" : null,
    });
  }

  if ((match = route.match(/^POST \/api\/invites\/([^/]+)\/join$/))) {
    const { status, room } = judgeInvite(decodeURIComponent(match[1]));
    const nickname = (body as { nickname: string }).nickname.trim();
    if (!NICKNAME.test(nickname)) return fail(400, "COMMON_002", "요청 값이 올바르지 않아요.");
    if (!room) return fail(403, "ROOM_006", "들어갈 수 없는 방이에요.");
    const mine = room.members.find(item => item.isMe);
    if (status === "ALREADY_MEMBER" && mine) {
      const { memberId, color } = mine;
      return ok({ roomId: room.room.roomId, memberId, nickname: mine.nickname, color });
    }
    if (status === "ROOM_LIMIT") return fail(409, "ROOM_001", "참여 중인 방이 2개예요.");
    if (status === "ROOM_FULL") return fail(409, "ROOM_003", "방이 가득 찼어요.");
    const taken = room.members.some(item => item.nickname.toLowerCase() === nickname.toLowerCase());
    if (taken) return fail(409, "ROOM_004", "이미 쓰는 닉네임이에요.");

    const memberId = ++nextMemberId;
    const color = pickColor(room.members.map(item => item.color));
    room.members.push(member(memberId, nickname, color, true));
    room.room.memberCount = room.members.length;
    const { roomId, name } = room.room;
    state.rooms[roomId] = room;
    state.me.rooms.push({ roomId, name, nickname, color, hasUnseen: false });
    state.me.canCreateRoom = state.me.rooms.length < MAX_JOINED_ROOMS;
    return ok({ roomId, memberId, nickname, color }, 201);
  }

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
    const roomId = Number(match[1]);
    if (!state.rooms[roomId]) return fail(404, "ROOM_005", "없거나 삭제된 방입니다.");
    const month = match[2] ?? thisMonth;
    return ok({ month, calendar: calendarOf(roomId, month) });
  }

  if ((match = route.match(/^PATCH \/api\/rooms\/(\d+)\/members\/me\/nickname$/))) {
    const roomId = Number(match[1]);
    const today = state.rooms[roomId];
    const room = state.me.rooms.find(item => item.roomId === roomId);
    if (!today || !room) return fail(404, "ROOM_005", "없거나 삭제된 방입니다.");
    const { nickname } = body as { nickname: string };
    const taken = today.members.some(
      member => !member.isMe && member.nickname.toLowerCase() === nickname.toLowerCase(),
    );
    if (taken) return fail(409, "ROOM_004", "이미 쓰는 닉네임입니다.");
    room.nickname = nickname;
    for (const member of today.members) if (member.isMe) member.nickname = nickname;
    return ok();
  }

  if ((match = route.match(/^DELETE \/api\/rooms\/(\d+)\/members\/me$/))) {
    const roomId = Number(match[1]);
    if (!state.rooms[roomId]) return fail(404, "ROOM_005", "없거나 삭제된 방입니다.");
    delete state.rooms[roomId];
    state.me.rooms = state.me.rooms.filter(room => room.roomId !== roomId);
    state.me.canCreateRoom = true;
    return ok();
  }

  if (route === "PATCH /api/users/me/settings") {
    Object.assign(state.me, body);
    return ok();
  }

  if (route === "DELETE /api/users/me") {
    state.rooms = {};
    state.me.rooms = [];
    state.me.canCreateRoom = true;
    return ok();
  }

  return fail(404, "COMMON_404", `목에 없는 API예요: ${route}`);
};
