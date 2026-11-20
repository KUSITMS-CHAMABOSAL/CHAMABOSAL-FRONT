import { API_MOCK } from "@/shared/config";

import { mockFetch } from "./mock";

/**
 * 서버가 발급한 presigned URL에 파일을 PUT으로 올려요. API 서버가 아니라 저장소로 바로 가서 토큰을 붙이지 않아요.
 * Content-Type은 업로드 URL을 받을 때 보낸 값과 같아야 해요. 목 모드에서는 목 핸들러가 응답해요.
 */
export const uploadToPresignedUrl = async (url: string, file: Blob) => {
  const response = API_MOCK
    ? await mockFetch("PUT", url, undefined)
    : await fetch(url, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
  if (!response.ok) throw new Error(`사진을 올리지 못했어요 (${response.status})`);
};
