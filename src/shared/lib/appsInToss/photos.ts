import {
  Device,
  FetchAlbumPhotosPermissionError,
  type ImageResponse,
  OpenCameraPermissionError,
} from "@apps-in-toss/web-framework";

/** 고른 사진이에요. `previewUrl`은 화면에 바로 그리고, `file`은 업로드에 써요. */
export interface PickedPhoto {
  previewUrl: string;
  file: Blob;
}

// 문서 예제처럼 base64로 받아요. 앱이 JPEG로 돌려줘서 형식을 고정해요.
const CONTENT_TYPE = "image/jpeg";
/** 1024px 넘는 사진은 앱이 줄여서 줘요(SDK 기본값). */
const MAX_WIDTH = 1024;

const toPhoto = ({ dataUri }: ImageResponse): PickedPhoto => {
  const bytes = Uint8Array.from(atob(dataUri), char => char.charCodeAt(0));
  return {
    previewUrl: `data:${CONTENT_TYPE};base64,${dataUri}`,
    file: new Blob([bytes], { type: CONTENT_TYPE }),
  };
};

/** 카메라로 한 장 찍어요. `apps-in-toss.config.ts`에 `camera` 권한이 있어야 해요. */
export const takePhoto = async () =>
  toPhoto(await Device.openCamera({ base64: true, maxWidth: MAX_WIDTH }));

/** 앨범에서 한 장 골라요. 고르지 않고 닫으면 null이에요. `photos` 권한이 있어야 해요. */
export const pickAlbumPhoto = async () => {
  const [photo] = await Device.getPhotos({ base64: true, maxCount: 1, maxWidth: MAX_WIDTH });
  return photo ? toPhoto(photo) : null;
};

/** 사용자가 카메라나 앨범 권한을 거부했어요. */
export const isPhotoPermissionError = (error: unknown) =>
  error instanceof OpenCameraPermissionError || error instanceof FetchAlbumPhotosPermissionError;
