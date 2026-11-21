import type { BosalColor, CertificationResult } from "@/shared/types";

// 이름과 필드는 API 문서(Swagger)와 같아요.

/** 투표 탭에 이름과 색만 보여주는 멤버예요. */
export interface VoteMemberSummary {
  memberId: number;
  nickname: string;
  color: BosalColor;
}

/** 후보의 이번 회차 인증이에요. */
export interface VoteCandidateCertification {
  result: CertificationResult;
  memo: string;
  /** 못 참았을 때만 있어요. */
  spentAmount: number | null;
  imageUrl: string | null;
  certifiedAt: string;
}

/** 투표 후보 한 명이에요. 인증하지 않은 멤버도 후보예요. */
export interface VoteCandidate extends VoteMemberSummary {
  /** 상점 노출 순서 */
  equippedItemCodes: string[];
  /** 인증하지 않았으면 null */
  certification: VoteCandidateCertification | null;
}

interface VoteRound {
  roundId: number;
  /** "2026-11-20" */
  roundDate: string;
}

/** 투표가 늦어도 닫히는 시각("2026-11-21T15:00:00")이에요. 명단 전원이 투표하면 그 전에 닫혀요. */
interface VoteClosing {
  closesAt: string;
}

/**
 * GET /api/rooms/{roomId}/vote. 방의 투표 탭 상태예요.
 * 서버는 상태마다 정해진 필드만 채우고 나머지는 null로 보내요. 여기에는 상태별로 채워지는 필드만 적었어요.
 */
export type VoteTabStatusResponse =
  /** 방 인원이 3명 미만이에요. */
  | { status: "UNDER_THREE"; memberCount: number; memberLimit: number }
  /** 지난 결과가 없고 투표 전이에요. 미인증 수와 첫 번째 미인증 멤버에서 나는 빠져요. */
  | {
      status: "BEFORE_FIRST_VOTE";
      uncertifiedCount: number;
      firstUncertifiedMember: VoteMemberSummary | null;
    }
  /** 투표가 시작된 뒤 들어와 명단에 없어요. */
  | ({ status: "NOT_IN_LIST" } & VoteRound & VoteClosing)
  /** 명단에 있지만 인증하지 않아 투표권이 없어요. 후보 목록에 나도 있어요. */
  | ({ status: "NO_VOTING_RIGHT"; candidates: VoteCandidate[] } & VoteRound & VoteClosing)
  /** 아직 투표하지 않았어요. 후보 목록에 나는 없어요. */
  | ({
      status: "VOTING";
      votedCount: number;
      voterCount: number;
      candidates: VoteCandidate[];
    } & VoteRound &
      VoteClosing)
  | ({ status: "VOTED"; votedCount: number; voterCount: number } & VoteRound & VoteClosing)
  /** 가장 최근 발표 회차예요. 결과 내용은 결과 API로 받아요. */
  | ({ status: "RESULT_UNSEEN" | "RESULT_SEEN" } & VoteRound)
  /** 결과를 봤고 지금 이마 톡톡을 보낼 수 있어요. */
  | ({ status: "TAP"; tapClosesAt: string } & VoteRound)
  /** 지목된 내가 받은 톡톡만큼 목탁 수행을 해야 해요. */
  | ({ status: "MOKTAK"; moktakCount: number } & VoteRound);

export type VoteTabStatus = VoteTabStatusResponse["status"];

/** 나에게 톡톡을 보낸 친구 한 명이에요. */
export interface ReceivedTap {
  nickname: string;
  color: BosalColor;
  count: number;
}

/** GET /api/rounds/{roundId}/taps/received. 지목된 내가 받은 톡톡이에요. */
export interface ReceivedTapsResponse {
  /** 톡톡이 나에게 전달됐는지예요. 투표 마감 뒤 일정 시간이 지나야 전달돼요. */
  isDelivered: boolean;
  deliveredAt: string | null;
  /** 받은 톡톡 합계예요. 이만큼 목탁을 쳐야 수행이 끝나요. */
  totalCount: number;
  /** 이미 목탁 수행을 마쳤는지예요. */
  isMoktakDone: boolean;
  taps: ReceivedTap[];
}

/** POST /api/rounds/{roundId}/moktak */
export interface MoktakCompleteResponse {
  /** 번뇌 완료 보상이에요. 처음 완료하면 10, 이미 완료했거나 방 인원이 1명이면 0 */
  riceEarned: number;
}
