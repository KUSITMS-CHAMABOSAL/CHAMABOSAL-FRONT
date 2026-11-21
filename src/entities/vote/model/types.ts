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
  | ({ status: "MOKTAK"; moktakCount: number } & VoteRound)
  /** 인증한 보살이 없어 투표가 열리지 않았어요. 인증도 콕도 없던 날은 회차가 없어 회차 ID가 null이에요. */
  | { status: "NO_VOTE"; roundId: number | null; roundDate: string };

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

/** 결과 종류예요. `ALL_BOSAL` 과반이 모두 보살, `ALL_SAFE` 동점·0표로 모두 무사, `DEFENDED` 지목된 사람이 방어권을 씀 */
export type RoundResultType = "PICKED" | "ALL_BOSAL" | "ALL_SAFE" | "DEFENDED";

/** 지목된 보살이에요. PICKED·DEFENDED일 때만 와요. */
export interface PickedMember {
  memberId: number;
  nickname: string;
  color: BosalColor;
  equippedItemCodes: string[];
  /** 투표 중에 방을 나간 "떠난 보살"이에요. */
  isLeft: boolean;
  /** 인증하지 않았으면 null */
  certificationResult: CertificationResult | null;
  /** 인증하지 않았거나 참았으면 null */
  spentAmount: number | null;
}

/** 표를 받은 멤버예요. 지목이 없을 때만 와요. */
export interface VoteCount {
  memberId: number;
  nickname: string;
  count: number;
  isLeft: boolean;
}

/** GET /api/rounds/{roundId}/result. 누가 누구에게 투표했는지는 오지 않아요. */
export interface RoundResultResponse {
  roundId: number;
  roundDate: string;
  resultType: RoundResultType;
  picked: PickedMember | null;
  /** 지목이 없을 때(ALL_BOSAL·ALL_SAFE)만, 득표 수가 많은 순. 지목이 있으면 빈 배열 */
  voteCounts: VoteCount[];
  /** 지목이 없을 때만 "오늘은 모두 보살" 득표 수. 지목이 있으면 null */
  allBosalCount: number | null;
  isMePicked: boolean;
  /** 내가 지목됐고 톡톡 마감 전에 처음 열었을 때만, 처음 연 시각 + 2분 */
  defenseUsableUntil: string | null;
  /** 내가 지목됐을 때만, 보유한 방어권 개수 */
  defenseTicketCount: number | null;
  canUseDefense: boolean;
  /** 지금 이마 톡톡을 보낼 수 있어요. 그 회차에 투표했고 지목되지 않았을 때만 true일 수 있어요. */
  canTap: boolean;
  isTapExpired: boolean;
  /** 나를 뺀, 그 회차에 한 번 이상 톡톡한 멤버 수 */
  tappedMemberCount: number;
  isDefensePending: boolean;
}
