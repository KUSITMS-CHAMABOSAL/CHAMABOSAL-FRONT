import type { BosalColor } from "@/shared/types";

/** GET /api/users/me 의 `rooms[]` */
export interface MyRoom {
  roomId: number;
  name: string;
  /** 이 방의 내 닉네임 */
  nickname: string;
  color: BosalColor;
  /** 안 본 결과나 한 솥 축하가 있음 */
  hasUnseen: boolean;
}

/** GET /api/users/me */
export interface MeResponse {
  /** 설정 화면의 알림 토글이에요. 토스 알림 동의와 별개예요. */
  isPokePushEnabled: boolean;
  isResultPushEnabled: boolean;
  isVoteOpenedPushEnabled: boolean;
  isCertReminderPushEnabled: boolean;
  isCertReminderAgreed: boolean;
  equippedItemCodes: string[];
  /** 현재 멤버인 방. 비어 있으면 첫 화면 */
  rooms: MyRoom[];
  /** 참여 중인 방이 2개면 false */
  canCreateRoom: boolean;
  nabal: NabalStatus;
}

/** GET /api/users/me 의 `nabal`. 내 보살의 나발 상태예요. */
export interface NabalStatus {
  /** 빠진 나발 번호(0~37), 오름차순. 비어 있으면 보살, 하나라도 있으면 중생 */
  fallenNumbers: number[];
  /** 아직 빠지는 연출을 안 본 나발 번호 */
  unseenFallenNumbers: number[];
  /** 가장 최근 나발 기록 ID. 연출을 본 뒤 seen-nabal-loss로 보내요. 기록이 없으면 null */
  lastNabalLossId: number | null;
  /** 처음 빠졌는지. true면 보살 → 중생 회귀 스토리를 보여줘요 */
  isFirstLoss: boolean;
}

/** POST /api/auth/login */
export interface LoginResponse {
  accessToken: string;
  /** 유효 시간(초) */
  expiresIn: number;
  /** 처음 온 사용자. 6개월 안에 돌아와 복구했으면 false */
  isNewUser: boolean;
}

/** POST /api/auth/test-token. 개발 환경 전용이에요. */
export interface TestTokenResponse {
  accessToken: string;
  /** 유효 시간(초) */
  expiresIn: number;
}
