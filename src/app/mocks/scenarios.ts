import type { TodayMember, TodayResponse } from "@/entities/room";
import type { MeResponse } from "@/entities/session";

import photo from "./assets/certification_photo.jpg";

// 개발 서버 목 데이터예요. 주소에 ?demo=이름 을 붙여 시안 상태를 골라요. 이름은 SCENARIOS의 키예요.
// 응답 모양은 API 초안(https://api.chamabosal.com/dev/openapi.yaml)과 같아요.

const minutesFromNow = (minutes: number) => {
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

const member = (
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
  isActivityPushEnabled: true,
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

const today = (roomId: number, name: string, members: TodayMember[]): TodayResponse => ({
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
  },
  members,
  me: { isLastCertifier: false, receivedPokeCount: 2 },
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
}

// 방마다 멤버와 인증을 새로 만들어요. 같은 객체를 나누면 한 방의 리액션·삭제가 다른 방에도 반영돼요.
const build = (roomNames: string[], makeMembers: () => TodayMember[]): Scenario => ({
  me: me(roomNames),
  rooms: Object.fromEntries(
    roomNames.map((name, index) => [index + 1, today(index + 1, name, makeMembers())]),
  ),
});

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
  /** 2-4 친구 기다리는중 */
  waiting: () => build(ROOMS.slice(0, 1), () => [member(1, "윤지", "PINK", true)]),
};
