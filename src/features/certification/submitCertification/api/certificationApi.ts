import { request, uploadToPresignedUrl } from "@/shared/api";

import type {
  CertificationCreateRequest,
  CertificationCreateResponse,
  PhotoUploadUrlResponse,
} from "../model/types";

/** 오늘 회차를 인증해요. 회차는 서버가 요청을 받은 시각으로 정해요. */
export const createCertification = (roomId: number, body: CertificationCreateRequest) =>
  request<CertificationCreateResponse>("POST", `/api/rooms/${roomId}/certifications`, body);

/** 사진을 발급받은 URL에 올리고 인증 등록에 보낼 키를 돌려줘요. */
export const uploadCertificationPhoto = async (file: Blob) => {
  const { uploadUrl, imageKey } = await request<PhotoUploadUrlResponse>(
    "POST",
    "/api/certifications/upload-urls",
    { contentType: file.type },
  );
  await uploadToPresignedUrl(uploadUrl, file);
  return imageKey;
};
