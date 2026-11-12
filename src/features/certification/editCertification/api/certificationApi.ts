import { request } from "@/shared/api";

/** DELETE 응답이에요. 회수한 개인 공양미와 한 솥 석이에요. */
export interface CertificationDeleteResponse {
  riceRecalled: number;
  potRecalled: number;
}

/** 인증 후 10분 안에만 지울 수 있어요. 이미 지운 인증을 다시 지워도 0, 0으로 성공해요. */
export const deleteCertification = (certificationId: number) =>
  request<CertificationDeleteResponse>("DELETE", `/api/certifications/${certificationId}`);
