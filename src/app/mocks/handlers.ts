import type { MockHandler } from "@/shared/api";

import type { BosalColor } from "@/entities/bosal";
import { MAX_JOINED_ROOMS, type RoomGoal, type TodayResponse } from "@/entities/room";
import { MIN_VOTERS, type VoteCandidate, type VoteTabStatusResponse } from "@/entities/vote";

import {
  FULL_ROOM_ID,
  inviteRoom,
  member,
  minutesFromNow,
  newCertification,
  SCENARIOS,
  today,
} from "./scenarios";

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

/** 목탁 수행 목 데이터예요. 시안처럼 받은 톡톡 합계가 201번이에요. */
const RECEIVED_TAPS = [
  { nickname: "예나", color: "PINK", count: 120 },
  { nickname: "도윤", color: "MINT", count: 60 },
  { nickname: "하린", color: "YELLOW", count: 21 },
];
/** 발급한 인증 사진 업로드 URL 수예요. 키가 겹치지 않게 써요. */
let uploadCount = 0;

/** 새로고침 전까지 수행을 마친 회차를 기억해요. */
const moktakDoneRounds = new Set<number>();

/** 새로고침 전까지 내가 투표한 회차를 기억해요. */
const votedRounds = new Set<number>();

/** 나보다 먼저 투표한 친구 수예요. 내가 투표하면 1 늘어요. */
const OTHERS_VOTED = 1;

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
/** 마지막으로 만든 방 ID예요. 초대 방(10, 20) 뒤부터 쓰고, 나가거나 데이터를 지워도 되돌리지 않아 ID가 다시 쓰이지 않아요. */
let lastRoomId = FULL_ROOM_ID;

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

/** 서버처럼 투표 명단에서 후보를 만들어요. 투표권이 없으면 나도 후보로 보여요. */
const candidatesOf = (room: TodayResponse, includeMe: boolean): VoteCandidate[] =>
  room.members
    .filter(item => includeMe || !item.isMe)
    .map(({ memberId, nickname, color, equippedItemCodes, certification }) => ({
      memberId,
      nickname,
      color,
      equippedItemCodes,
      certification: certification && {
        result: certification.result,
        memo: certification.memo,
        spentAmount: certification.spentAmount,
        imageUrl: certification.imageUrl,
        certifiedAt: certification.certifiedAt,
      },
    }));

/** 투표 탭 상태예요. 시나리오가 고정하지 않으면 방 인원과 회차 상태로 정해요. 시안처럼 마감까지 2시간 17분 남아요. */
const voteTabOf = (room: TodayResponse): VoteTabStatusResponse => {
  // 오늘 탭에 회차가 없어도 화면을 볼 수 있게 방 ID를 회차 ID로 써요.
  const round = { roundId: room.round.roundId ?? room.room.roomId, roundDate: todayDate };
  const closesAt = minutesFromNow(137);
  const voterCount = room.members.filter(item => item.certification).length;
  const amICertified = room.members.some(item => item.isMe && item.certification);
  const status =
    state.voteStatus ??
    (room.round.status === "VOTING"
      ? !amICertified
        ? "NO_VOTING_RIGHT"
        : votedRounds.has(round.roundId)
          ? "VOTED"
          : "VOTING"
      : room.members.length < MIN_VOTERS
        ? "UNDER_THREE"
        : "BEFORE_FIRST_VOTE");

  switch (status) {
    case "UNDER_THREE":
      return { status, memberCount: room.members.length, memberLimit: room.room.memberLimit };
    case "BEFORE_FIRST_VOTE": {
      const uncertified = room.members.filter(item => !item.isMe && !item.certification);
      const [first] = uncertified;
      return {
        status,
        uncertifiedCount: uncertified.length,
        firstUncertifiedMember: first
          ? { memberId: first.memberId, nickname: first.nickname, color: first.color }
          : null,
      };
    }
    case "NOT_IN_LIST":
      return { status, ...round, closesAt };
    case "NO_VOTING_RIGHT":
      return { status, ...round, closesAt, candidates: candidatesOf(room, true) };
    case "VOTING":
      return {
        status,
        ...round,
        closesAt,
        votedCount: OTHERS_VOTED,
        voterCount,
        candidates: candidatesOf(room, false),
      };
    case "VOTED":
      return {
        status,
        ...round,
        closesAt,
        // 투표 완료는 나도 투표한 상태라 직접 제출했든 시나리오로 고정했든 같은 값이에요.
        votedCount: OTHERS_VOTED + 1,
        voterCount,
      };
    case "RESULT_UNSEEN":
    case "RESULT_SEEN":
      return { status, ...round };
    case "TAP":
      return { status, ...round, tapClosesAt: minutesFromNow(180) };
    case "NO_VOTE":
      return { status, ...round };
    case "MOKTAK":
      return {
        status,
        ...round,
        moktakCount: RECEIVED_TAPS.reduce((sum, tap) => sum + tap.count, 0),
      };
  }
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

    const roomId = Math.max(lastRoomId, ...state.me.rooms.map(room => room.roomId)) + 1;
    lastRoomId = roomId;
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

  if (route === "POST /api/certifications/upload-urls") {
    const id = ++uploadCount;
    return ok(
      { uploadUrl: `mock://upload/${id}`, imageKey: `tmp/1/mock-${id}`, expiresIn: 300 },
      201,
    );
  }

  // presigned URL 업로드예요. 실서버는 저장소로 바로 가요.
  if (route.startsWith("PUT mock://upload/")) {
    const result = state.failUpload ? fail(500, "UPLOAD_FAILED", "업로드에 실패했어요.") : ok();
    if (!state.uploadDelayMs) return result;
    return new Promise<typeof result>(resolve =>
      setTimeout(() => resolve(result), state.uploadDelayMs),
    );
  }

  if ((match = route.match(/^POST \/api\/rooms\/(\d+)\/certifications$/))) {
    const today = state.rooms[Number(match[1])];
    if (!today) return fail(404, "ROOM_005", "없거나 삭제된 방입니다.");
    const mine = today.members.find(item => item.isMe);
    if (!mine) return fail(403, "ROOM_002", "이 방 멤버가 아닙니다.");
    if (mine.certification) return fail(409, "CERT_001", "이미 인증했습니다.");
    const { result, memo, spentAmount, imageKey } = body as {
      result: "ENDURED" | "FAILED";
      memo: string;
      spentAmount?: number;
      imageKey?: string;
    };
    const memoLength = [...new Intl.Segmenter("ko", { granularity: "grapheme" }).segment(memo)]
      .length;
    if (!memo.trim() || memoLength > 50) return fail(400, "COMMON_002", "입력값 오류");
    const amount = result === "FAILED" ? (spentAmount ?? 0) : null;
    if (amount !== null && (amount < 1 || amount > 999_999))
      return fail(400, "COMMON_002", "입력값 오류");

    const isVoteStarted = today.me.isLastCertifier;
    mine.certification = newCertification(result, memo, amount, !!imageKey, isVoteStarted);
    today.me.isLastCertifier = false;
    // 인증을 지웠다가 다시 올려도 수가 늘어나지 않게 지금 목록에서 세요.
    today.round.certifiedCount = today.members.filter(item => item.certification).length;
    today.round.isAllCertified = today.members.every(item => item.certification);
    if (isVoteStarted) today.round.status = "VOTING";
    // 2명부터 공양미가 쌓여요. 솥을 다 채우면 넘친 석으로 다음 솥이 시작돼요.
    const earned = today.members.length >= 2 ? 10 : 0;
    today.pot.amount += earned;
    if (today.pot.amount >= today.pot.goalAmount) {
      today.pot.amount -= today.pot.goalAmount;
      today.room.potCompletedCount += 1;
      today.entry.hasUnseenPotCelebration = true;
    }
    return ok(
      {
        certificationId: mine.certification.certificationId,
        roundDate: todayDate,
        certifiedAt: mine.certification.certifiedAt,
        editableUntil: mine.certification.editableUntil,
        riceEarned: earned,
        potEarned: earned,
        isVoteStarted,
      },
      201,
    );
  }

  if ((match = route.match(/^GET \/api\/rooms\/(\d+)\/pots\/(\d+)$/))) {
    const today = state.rooms[Number(match[1])];
    if (!today) return fail(404, "ROOM_005", "없거나 삭제된 방입니다.");
    // 시안처럼 같은 석이 있어서 같은 순위가 나와요.
    const amounts = [84, 77, 77, 62];
    const contributions = today.members.map((item, index) => ({
      rank: amounts.indexOf(amounts[index]) + 1,
      memberId: item.memberId,
      nickname: item.nickname,
      color: item.color,
      equippedItemCodes: item.equippedItemCodes,
      amount: amounts[index],
    }));
    return ok({
      seq: Number(match[2]),
      goalAmount: today.pot.goalAmount,
      rewardAmount: today.pot.goalAmount / 10,
      contributions,
    });
  }

  if ((match = route.match(/^PUT \/api\/rooms\/(\d+)\/members\/me\/seen-pot$/))) {
    const today = state.rooms[Number(match[1])];
    if (!today) return fail(404, "ROOM_005", "없거나 삭제된 방입니다.");
    today.entry.hasUnseenPotCelebration = false;
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
    // 초대로 들어간 방은 남의 방이라 다른 멤버는 두고 나만 빠져요. 다시 들어와도 예전 멤버가 남지 않아요.
    if (invited?.room.roomId === roomId) {
      invited.members = invited.members.filter(item => !item.isMe);
      invited.room.memberCount = invited.members.length;
    }
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

  if ((match = route.match(/^GET \/api\/rooms\/(\d+)\/vote$/))) {
    const room = state.rooms[Number(match[1])];
    if (!room) return fail(404, "ROOM_005", "없거나 삭제된 방입니다.");
    return ok(voteTabOf(room));
  }

  if ((match = route.match(/^GET \/api\/rounds\/(\d+)\/result$/))) {
    const roundId = Number(match[1]);
    const room =
      Object.values(state.rooms).find(
        item => (item.round.roundId ?? item.room.roomId) === roundId,
      ) ?? Object.values(state.rooms)[0];
    if (!room) return fail(404, "ROUND_001", "없는 회차입니다.");
    const resultType = state.resultType ?? "PICKED";
    // 시안처럼 못 참은 친구가 지목돼요. 없으면 나 아닌 첫 멤버예요.
    const target =
      room.members.find(item => !item.isMe && item.certification?.result === "FAILED") ??
      room.members.find(item => !item.isMe);
    const isPicked = resultType === "PICKED" || resultType === "DEFENDED";
    const others = room.members.filter(item => !item.isMe);
    return ok({
      roundId,
      roundDate: todayDate,
      resultType,
      picked:
        isPicked && target
          ? {
              memberId: target.memberId,
              nickname: target.nickname,
              color: target.color,
              equippedItemCodes: target.equippedItemCodes,
              isLeft: false,
              certificationResult: target.certification?.result ?? null,
              spentAmount: target.certification?.spentAmount ?? null,
            }
          : null,
      // 시안처럼 동점이면 두 명이 2표씩이에요.
      voteCounts: isPicked
        ? []
        : others.slice(0, resultType === "ALL_SAFE" ? 2 : 1).map(item => ({
            memberId: item.memberId,
            nickname: item.nickname,
            count: resultType === "ALL_SAFE" ? 2 : 1,
            isLeft: false,
          })),
      allBosalCount: isPicked ? null : resultType === "ALL_BOSAL" ? 3 : 0,
      isMePicked: false,
      defenseUsableUntil: null,
      defenseTicketCount: null,
      canUseDefense: false,
      canTap: resultType === "PICKED",
      isTapExpired: false,
      tappedMemberCount: 0,
      isDefensePending: false,
    });
  }

  if ((match = route.match(/^PUT \/api\/rooms\/(\d+)\/members\/me\/seen-result$/))) {
    const room = state.rooms[Number(match[1])];
    if (!room) return fail(404, "ROOM_005", "없거나 삭제된 방입니다.");
    room.entry.unseenResultRoundId = null;
    if (state.voteStatus === "RESULT_UNSEEN") state.voteStatus = "RESULT_SEEN";
    return ok();
  }

  if ((match = route.match(/^POST \/api\/rounds\/(\d+)\/votes$/))) {
    const roundId = Number(match[1]);
    if (votedRounds.has(roundId)) return fail(409, "VOTE_004", "이미 투표했습니다.");
    const target = body as { targetType: "MEMBER" | "ALL_BOSAL"; targetMemberId?: number };
    if (target.targetType === "MEMBER" && !target.targetMemberId)
      return fail(400, "COMMON_002", "입력값 오류");
    votedRounds.add(roundId);
    return ok({ riceEarned: 5, potEarned: 5, isClosed: false }, 201);
  }

  if ((match = route.match(/^GET \/api\/rounds\/(\d+)\/taps\/received$/))) {
    const total = RECEIVED_TAPS.reduce((sum, tap) => sum + tap.count, 0);
    return ok({
      isDelivered: true,
      deliveredAt: new Date().toISOString(),
      totalCount: total,
      isMoktakDone: moktakDoneRounds.has(Number(match[1])),
      taps: RECEIVED_TAPS,
    });
  }

  if ((match = route.match(/^POST \/api\/rounds\/(\d+)\/moktak$/))) {
    const total = RECEIVED_TAPS.reduce((sum, tap) => sum + tap.count, 0);
    if ((body as { count: number }).count < total)
      return fail(400, "MOKTAK_004", "받은 톡톡보다 적게 두드렸습니다.");
    const roundId = Number(match[1]);
    const first = !moktakDoneRounds.has(roundId);
    moktakDoneRounds.add(roundId);
    return ok({ riceEarned: first ? 10 : 0 }, 201);
  }

  return fail(404, "COMMON_404", `목에 없는 API예요: ${route}`);
};
