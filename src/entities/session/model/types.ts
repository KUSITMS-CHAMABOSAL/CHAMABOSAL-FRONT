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
  isPokePushEnabled: boolean;
  isActivityPushEnabled: boolean;
  isCertReminderAgreed: boolean;
  equippedItemCodes: string[];
  /** 현재 멤버인 방. 비어 있으면 첫 화면 */
  rooms: MyRoom[];
  /** 참여 중인 방이 2개면 false */
  canCreateRoom: boolean;
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
