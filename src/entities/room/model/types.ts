import type { BosalColor, CertificationResult, LockReason, ReactionType } from "@/shared/types";

// GET /api/rooms/{roomId}/today 응답이에요. 이름과 필드는 API 문서(초안 0.2.0)와 같아요.

/** 절약 목표. `DELIVERY` 배달 끊기, `SNACK` 간식 참기, `SHOPPING` 쇼핑 참기, `ETC` 자율 절약 */
export type RoomGoal = "DELIVERY" | "SNACK" | "SHOPPING" | "ETC";
export type RoundStatus = "CERTIFYING" | "VOTING" | "ANNOUNCED" | "NO_VOTE";

export interface TodayRoom {
  roomId: number;
  name: string;
  goal: RoomGoal;
  memberCount: number;
  memberLimit: number;
  isOwner: boolean;
  /** 한 솥을 다 채운 횟수 */
  potCompletedCount: number;
  hasVotingRound: boolean;
  /** 방을 만든 회차 날짜부터 지난 일수. 만든 날은 0 */
  daysTogether: number;
}

export interface TodayPot {
  /** 지금 솥에 찬 석 */
  amount: number;
  goalAmount: number;
}

export interface TodayRound {
  /** 오늘 회차 행이 아직 없으면 null */
  roundId: number | null;
  status: RoundStatus;
  certifiedCount: number;
  isAllCertified: boolean;
}

export interface TodayCertification {
  certificationId: number;
  result: CertificationResult;
  memo: string;
  /** ENDURED면 null */
  spentAmount: number | null;
  /** 만료 URL. 없거나 삭제됐으면 null */
  imageUrl: string | null;
  certifiedAt: string;
  myReaction: ReactionType | null;
  /** 수정·삭제 마감 시각 (인증 후 10분) */
  editableUntil: string;
  /** 수정·삭제할 수 있으면 null */
  lockReason: LockReason | null;
}

export interface TodayMember {
  memberId: number;
  nickname: string;
  color: BosalColor;
  equippedItemCodes: string[];
  isMe: boolean;
  monthlyEnduredCount: number;
  monthlyPickedCount: number;
  /** 인증 전이면 null */
  certification: TodayCertification | null;
}

export interface TodayMe {
  isLastCertifier: boolean;
  /** 이번 회차에 받은 콕 수 */
  receivedPokeCount: number;
}

export interface TodayEntry {
  unplayedTapRoundId: number | null;
  unseenResultRoundId: number | null;
  hasUnseenPotCelebration: boolean;
}

export interface TodayResponse {
  room: TodayRoom;
  pot: TodayPot;
  round: TodayRound;
  members: TodayMember[];
  me: TodayMe;
  entry: TodayEntry;
}

/**
 * GET /api/invites/{token} 의 입장 판단 결과예요.
 * `ROOM_LIMIT` 참여 중인 방 2개, `ROOM_FULL` 방이 가득 참,
 * `UNAVAILABLE` 없는 토큰·삭제된 방·초대한 사람이나 내가 내보내짐
 */
export type InviteStatus =
  "JOINABLE" | "ALREADY_MEMBER" | "ROOM_LIMIT" | "ROOM_FULL" | "UNAVAILABLE";

/** 초대 미리보기에 보여줄 방 정보예요. */
export interface RoomSummary {
  roomId: number;
  name: string;
  goal: RoomGoal;
  /** 절약 목표별 제목이에요. 예: 배달 끊기 방 */
  goalTitle: string;
  /** 절약 목표별 설명이에요. 줄바꿈은 `\n` */
  goalDescription: string;
  memberCount: number;
  memberLimit: number;
}

/** GET /api/invites/{token}. 막힌 경우도 200으로 오고 `status`로 화면을 나눠요. */
export interface InvitePreview {
  status: InviteStatus;
  /** `UNAVAILABLE`이면 null */
  room: RoomSummary | null;
  /** 초대한 사람이 나갔으면 null */
  inviterNickname: string | null;
  /** 나간 지 6개월이 안 된 방이면 내 예전 닉네임. 지금 다른 멤버가 쓰고 있으면 null */
  previousNickname: string | null;
}
