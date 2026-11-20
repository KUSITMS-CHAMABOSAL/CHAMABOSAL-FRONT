import { useRef, useState } from "react";

import { PHOTO_MAX_BYTES } from "@/entities/certification";
import { pickAlbumPhoto, takePhoto } from "@/shared/lib/appsInToss";

import { uploadCertificationPhoto } from "../api/certificationApi";
import type { PhotoState } from "./types";

export type PhotoSource = "camera" | "album";

/**
 * 인증 사진 한 장이에요. 고르는 즉시 올려서, 실패하면 폼에서 바로 알려요.
 * 카메라·앨범을 열지 못하면(권한 거부 등) `pick`이 에러를 던져요. 업로드 실패는 `failed` 상태로 남아요.
 */
export const usePhotoUpload = () => {
  const [photo, setPhoto] = useState<PhotoState>({ status: "empty" });
  // 올리는 중에 지우거나 다시 고르면 이전 업로드 결과를 버려요.
  const attempt = useRef(0);

  const pick = async (source: PhotoSource) => {
    const picked = source === "camera" ? await takePhoto() : await pickAlbumPhoto();
    if (!picked) return;

    const id = ++attempt.current;
    const { previewUrl, file } = picked;
    if (file.size > PHOTO_MAX_BYTES) return setPhoto({ status: "failed", previewUrl });

    setPhoto({ status: "uploading", previewUrl });
    try {
      const imageKey = await uploadCertificationPhoto(file);
      if (id === attempt.current) setPhoto({ status: "uploaded", previewUrl, imageKey });
    } catch {
      if (id === attempt.current) setPhoto({ status: "failed", previewUrl });
    }
  };

  const remove = () => {
    attempt.current++;
    setPhoto({ status: "empty" });
  };

  return { photo, pick, remove };
};
