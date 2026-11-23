import type { CertificationResult } from "@/shared/types";

/** DELETE /api/certifications/{id} 응답이에요. 회수한 개인 공양미와 한 솥 석이에요. */
export interface CertificationDeleteResponse {
  riceRecalled: number;
  potRecalled: number;
}

/** PATCH /api/certifications/{id} */
export interface CertificationUpdateRequest {
  result: CertificationResult;
  memo: string;
  /** FAILED면 필수예요. ENDURED면 보내지 않고, 저장된 금액은 서버가 지워요. */
  spentAmount?: number;
  /** 새 사진 키예요. 보내면 `isImageKept`는 false여야 해요. */
  imageKey?: string;
  /** 기존 사진을 둘지예요. 새 사진 없이 false면 사진을 지워요. */
  isImageKept: boolean;
}

export interface CertificationUpdateResponse {
  certificationId: number;
  result: CertificationResult;
  memo: string;
  spentAmount: number | null;
  imageUrl: string | null;
  editableUntil: string;
}
