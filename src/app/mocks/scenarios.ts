import type { TodayMember, TodayResponse } from "@/entities/room";
import type { MeResponse } from "@/entities/session";
import type { RoundResultResponse, VoteTabStatus } from "@/entities/vote";

import photo from "./assets/certification_photo.jpg";

// 개발 서버 목 데이터예요. 주소에 ?demo=이름 을 붙여 시안 상태를 골라요. 이름은 SCENARIOS의 키예요.
// 응답 모양은 API 초안(https://api.chamabosal.com/dev/openapi.yaml)과 같아요.

export const minutesFromNow = (minutes: number) => {
  // 서버처럼 시간대 없는 KST 문자열로 만들어요.
  const date = new Date(Date.now() + minutes * 60_000);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

let nextCertificationId = 500;
const certified = (
  result: "ENDURED" | "FAILED",
  memo: string,
  editMinutesLeft = -50,
): TodayMember["certification"] => ({
  certificationId: ++nextCertificationId,
  result,
  memo,
  spentAmount: result === "FAILED" ? 18900 : null,
  imageUrl: photo,
  certifiedAt: minutesFromNow(editMinutesLeft - 10),
  myReaction: null,
  editableUntil: minutesFromNow(editMinutesLeft),
  lockReason: editMinutesLeft > 0 ? null : "TIME_OVER",
});

/** 방금 등록한 인증이에요. 마지막 인증이면 바로 투표가 시작돼서 수정할 수 없어요. */
export const newCertification = (
  result: "ENDURED" | "FAILED",
  memo: string,
  spentAmount: number | null,
  hasPhoto: boolean,
  isVoteStarted: boolean,
): NonNullable<TodayMember["certification"]> => ({
  certificationId: ++nextCertificationId,
  result,
  memo,
  spentAmount,
  imageUrl: hasPhoto ? photo : null,
  certifiedAt: minutesFromNow(0),
  myReaction: null,
  editableUntil: minutesFromNow(10),
  lockReason: isVoteStarted ? "VOTE_STARTED" : null,
});

export const member = (
  memberId: number,
  nickname: string,
  color: TodayMember["color"],
  isMe: boolean,
  certification: TodayMember["certification"] = null,
): TodayMember => ({
  memberId,
  nickname,
  color,
  equippedItemCodes: [],
  isMe,
  monthlyEnduredCount: 9,
  monthlyPickedCount: 3,
  certification,
});

const PASTA = "집에 있는 재료로 파스타 해먹었어요.\n오이시~";

const me = (roomNames: string[]): MeResponse => ({
  isPokePushEnabled: true,
  isResultPushEnabled: false,
  isVoteOpenedPushEnabled: true,
  isCertReminderPushEnabled: true,
  isCertReminderAgreed: false,
  equippedItemCodes: [],
  rooms: roomNames.map((name, index) => ({
    roomId: index + 1,
    name,
    nickname: "윤지",
    color: "PINK",
    hasUnseen: index === 1,
  })),
  canCreateRoom: roomNames.length < 2,
});

/** 서버처럼 나만 인증 전이고 3명 이상일 때만 true예요. 3명 미만 방은 다 인증해도 투표가 열리지 않아요. */
export const isLastCertifier = (members: TodayMember[]) =>
  members.length >= 3 &&
  members.every(item => (item.isMe ? !item.certification : item.certification));

export const today = (roomId: number, name: string, members: TodayMember[]): TodayResponse => ({
  room: {
    roomId,
    name,
    goal: roomId === 1 ? "DELIVERY" : "SHOPPING",
    memberCount: members.length,
    memberLimit: 4,
    isOwner: true,
    potCompletedCount: 0,
    hasVotingRound: false,
    daysTogether: members.length > 1 ? 7 : 0,
  },
  pot: { amount: members.length > 1 ? 186 : 0, goalAmount: 300 },
  round: {
    roundId: 101,
    status: "CERTIFYING",
    certifiedCount: members.filter(item => item.certification).length,
    isAllCertified: members.every(item => item.certification),
    isCertificationOpen: true,
  },
  members,
  me: { isLastCertifier: isLastCertifier(members), receivedPokeCount: 2 },
  entry: { unplayedTapRoundId: null, unseenResultRoundId: null, hasUnseenPotCelebration: false },
});

const ROOMS = ["배달 끊기 방", "쇼핑 참기 방"];

/** 방마다 오늘 탭 응답이에요. 나(isMe)를 누구로 둘지로 상태를 바꿔요. */
const fourMembers = (meId: number, myEditMinutes?: number) => [
  member(1, "윤지", "PINK", meId === 1),
  member(2, "예나", "PURPLE", meId === 2, certified("ENDURED", PASTA)),
  member(3, "태경", "YELLOW", meId === 3, certified("ENDURED", PASTA, myEditMinutes)),
  member(4, "예은", "MINT", meId === 4, certified("FAILED", "야식 배달 시켜버렸어요…")),
];

export interface Scenario {
  me: MeResponse;
  /** roomId별 오늘 탭이에요. 없는 방은 ROOM_005로 응답해요. */
  rooms: Record<number, TodayResponse>;
  /** 인증 사진 업로드를 실패시켜요. */
  failUpload?: boolean;
  /** 인증 사진 업로드를 이만큼 늦춰요. 올리는 중 화면을 볼 때 써요. */
  uploadDelayMs?: number;
  /** 투표 탭 상태를 이걸로 고정해요. 없으면 방 인원과 회차 상태로 정해요. */
  voteStatus?: VoteTabStatus;
  /** 투표 결과 종류예요. 없으면 지목(PICKED)이에요. */
  resultType?: RoundResultResponse["resultType"];
}

// 방마다 멤버와 인증을 새로 만들어요. 같은 객체를 나누면 한 방의 리액션·삭제가 다른 방에도 반영돼요.
const build = (roomNames: string[], makeMembers: () => TodayMember[]): Scenario => ({
  me: me(roomNames),
  rooms: Object.fromEntries(
    roomNames.map((name, index) => [index + 1, today(index + 1, name, makeMembers())]),
  ),
});

/** 회차가 투표 중인 방이에요. 인증한 멤버만 투표권이 있어요. */
const voteRound = (makeMembers: () => TodayMember[]): Scenario => {
  const scenario = build(ROOMS, makeMembers);
  for (const room of Object.values(scenario.rooms)) {
    room.round.status = "VOTING";
    room.round.isCertificationOpen = false;
  }
  return scenario;
};

export const SCENARIOS: Record<string, () => Scenario> = {
  /** 2-0 디폴트, 2-1 넘겼을 때_친구 (나는 예나) */
  default: () => build(ROOMS, () => fourMembers(2)),
  /** 2-0 한팀일때 */
  oneRoom: () => build(ROOMS.slice(0, 1), () => fourMembers(2)),
  /** 2-1.1 넘겼을 때_본인_인증전 (나는 윤지) */
  meBefore: () => build(ROOMS, () => fourMembers(1)),
  /** 2-1.2 넘겼을 때_본인_인증완 (나는 태경, 9분 남음) */
  meDone: () => build(ROOMS, () => fourMembers(3, 9)),
  /** 2-1.3 수정기한 지남 (나는 태경) */
  meExpired: () => build(ROOMS, () => fourMembers(3)),
  /** 2-2 참여하지 않는 방: 첫 방이 사라져서 ROOM_005, 닫으면 남은 방으로 가요 */
  roomGone: () => {
    const scenario = build(ROOMS, () => fourMembers(2));
    delete scenario.rooms[1];
    return scenario;
  },
  /** 04 인증: 아무도 인증 전이라 등록해도 투표가 열리지 않아요 (나는 윤지) */
  certifyFirst: () =>
    build(ROOMS, () => fourMembers(1).map(item => ({ ...item, certification: null }))),
  /** 04 인증: 등록하면 솥이 가득 차서 방 홈에서 한 솥 축하가 떠요 (나는 윤지, 마지막 인증) */
  potAlmostFull: () => {
    const scenario = build(ROOMS, () => fourMembers(1));
    scenario.rooms[1].pot.amount = 295;
    return scenario;
  },
  /** 04 인증: 방 홈에 들어가면 안 본 한 솥 축하가 바로 떠요 (나는 예나) */
  potFull: () => {
    const scenario = build(ROOMS, () => fourMembers(2));
    scenario.rooms[1].room.potCompletedCount = 1;
    scenario.rooms[1].entry.hasUnseenPotCelebration = true;
    return scenario;
  },
  /** 04 인증: 사진 업로드가 3초 걸려서 올리는 중 로더를 볼 수 있어요 (나는 윤지) */
  slowUpload: () => ({ ...build(ROOMS, () => fourMembers(1)), uploadDelayMs: 3000 }),
  /** 04 인증: 사진을 고르면 업로드가 실패해요 (나는 윤지) */
  uploadFail: () => ({ ...build(ROOMS, () => fourMembers(1)), failUpload: true }),
  /** 05 투표: 투표 중 (나는 예나, 윤지는 미인증 후보) */
  voting: () => voteRound(() => fourMembers(2)),
  /** 05 투표: 인증하지 않아 투표권이 없어요 (나는 윤지) */
  voteNoRight: () => voteRound(() => fourMembers(1)),
  /** 05 투표: 투표 완료 */
  voted: () => ({ ...voteRound(() => fourMembers(2)), voteStatus: "VOTED" }),
  /** 05 투표: 투표가 시작된 뒤 들어와 명단에 없어요 */
  voteNotInList: () => ({ ...voteRound(() => fourMembers(2)), voteStatus: "NOT_IN_LIST" }),
  /** 05 투표: 결과를 아직 안 봤어요 */
  voteResult: () => ({ ...build(ROOMS, () => fourMembers(2)), voteStatus: "RESULT_UNSEEN" }),
  /** 05 투표: 동점이라 뽑힌 보살이 없어요 */
  voteResultSafe: () => ({
    ...build(ROOMS, () => fourMembers(2)),
    voteStatus: "RESULT_UNSEEN",
    resultType: "ALL_SAFE",
  }),
  /** 05 투표: 과반이 오늘은 모두 보살을 골랐어요 */
  voteResultAllBosal: () => ({
    ...build(ROOMS, () => fourMembers(2)),
    voteStatus: "RESULT_UNSEEN",
    resultType: "ALL_BOSAL",
  }),
  /** 05 투표: 지목된 보살이 방어권을 썼어요 */
  voteResultDefended: () => ({
    ...build(ROOMS, () => fourMembers(2)),
    voteStatus: "RESULT_UNSEEN",
    resultType: "DEFENDED",
  }),
  /** 05 투표: 방 홈에 들어가면 안 본 결과가 먼저 떠요 */
  voteResultEntry: () => {
    const scenario = build(ROOMS, () => fourMembers(2));
    scenario.rooms[1].entry.unseenResultRoundId = scenario.rooms[1].round.roundId;
    return { ...scenario, voteStatus: "RESULT_UNSEEN" };
  },
  /** 05 투표: 결과를 봤어요 */
  voteResultSeen: () => ({ ...build(ROOMS, () => fourMembers(2)), voteStatus: "RESULT_SEEN" }),
  /** 05 투표: 결과를 보고 이마 톡톡을 보낼 수 있어요 */
  voteTap: () => ({ ...build(ROOMS, () => fourMembers(2)), voteStatus: "TAP" }),
  /** 05 투표: 지목돼서 목탁 수행을 해야 해요 */
  voteMoktak: () => ({ ...build(ROOMS, () => fourMembers(2)), voteStatus: "MOKTAK" }),
  /** 2-4 친구 기다리는중 */
  waiting: () => build(ROOMS.slice(0, 1), () => [member(1, "윤지", "PINK", true)]),
  /** 1-1 인트로: 참여 중인 방이 없는 처음 온 사용자 */
  newUser: () => build([], () => []),
};

/**
 * 초대 링크로 들어가는 남의 방이에요. 토큰 `invite`로 열어요. `rejoin`은 같은 방에 예전 닉네임("윤지")이 있는 경우예요.
 * 내 방에서 받은 토큰(`room{방 번호}`)은 그 방으로 들어가요.
 * 막힌 화면은 토큰 `full`(가득 참), `gone`(들어갈 수 없음)으로 봐요. 방이 2개인 시나리오면 방 2개 제한이에요.
 */
const INVITE_ROOM_ID = 10;
export const FULL_ROOM_ID = 20;
export const inviteRoom = (roomId = INVITE_ROOM_ID) => {
  const room = today(roomId, "배달 끊기 방", [
    member(11, "예나", "PURPLE", false),
    member(12, "예은", "MINT", false),
  ]);
  room.room.goal = "DELIVERY";
  room.room.isOwner = false;
  return room;
};
