import type { CertificationResult } from "@/shared/types";

/** POST /api/rooms/{roomId}/certifications */
export interface CertificationCreateRequest {
  result: CertificationResult;
  /** 1~50자. 띄어쓰기만 있으면 안 돼요. */
  memo: string;
  /** FAILED면 필수 1~999,999원. ENDURED면 보내지 않아요. */
  spentAmount?: number;
  /** 업로드 URL로 올린 사진 키예요. 사진은 선택이에요. */
  imageKey?: string;
}

export interface CertificationCreateResponse {
  certificationId: number;
  roundDate: string;
  certifiedAt: string;
  /** 수정·삭제할 수 있는 마지막 시각 (등록 10분 뒤) */
  editableUntil: string;
  /** 이 인증으로 받은 개인 공양미. 방 인원이 1명이면 0 */
  riceEarned: number;
  /** 이 인증으로 한 솥에 들어간 석. 방 인원이 1명이면 0 */
  potEarned: number;
  /** 이 등록으로 전원이 인증해서 투표가 시작됐어요. */
  isVoteStarted: boolean;
}

/** POST /api/certifications/upload-urls. `uploadUrl`은 5분, `imageKey`는 올린 뒤 1일 동안 쓸 수 있어요. */
export interface PhotoUploadUrlResponse {
  uploadUrl: string;
  imageKey: string;
  expiresIn: number;
}

/** 사진 칸 상태예요. 고르면 바로 올리고, 실패하면 X로 지우고 다시 골라요. */
export type PhotoState =
  | { status: "empty" }
  | { status: "uploading"; previewUrl: string }
  | { status: "uploaded"; previewUrl: string; imageKey: string }
  | { status: "failed"; previewUrl: string };
