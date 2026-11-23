import { request } from "@/shared/api";

import type {
  CertificationDeleteResponse,
  CertificationUpdateRequest,
  CertificationUpdateResponse,
} from "../model/types";

/** 인증 후 10분 안에만 지울 수 있어요. 이미 지운 인증을 다시 지워도 0, 0으로 성공해요. */
export const deleteCertification = (certificationId: number) =>
  request<CertificationDeleteResponse>("DELETE", `/api/certifications/${certificationId}`);

/** 인증 후 10분 안에, 투표가 시작되기 전까지 통째로 바꿔요. 공양미는 다시 주지 않아요. */
export const updateCertification = (certificationId: number, body: CertificationUpdateRequest) =>
  request<CertificationUpdateResponse>("PATCH", `/api/certifications/${certificationId}`, body);
