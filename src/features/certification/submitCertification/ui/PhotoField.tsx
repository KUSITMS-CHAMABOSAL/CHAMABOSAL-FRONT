import { type CSSProperties, useState } from "react";
import { Loader, Paragraph, useToast } from "@toss/tds-mobile";

import { cn } from "@/shared/lib";
import { isPhotoPermissionError } from "@/shared/lib/appsInToss";

import { CameraIcon, CloseIcon, LoadingIcon } from "../assets";
import photoTileMask from "../assets/photo_tile_mask.svg";
import photoTilePending from "../assets/photo_tile_pending.svg";
import type { PhotoState } from "../model/types";
import type { PhotoSource } from "../model/usePhotoUpload";
import PhotoPickerSheet from "./PhotoPickerSheet";

interface PhotoFieldProps {
  photo: PhotoState;
  onPick: (source: PhotoSource) => Promise<void>;
  onRemove: () => void;
}

// 지우기 버튼이 걸리도록 오른쪽 위가 파인 모양으로 사진을 잘라요. 올리는 중 칸도 같은 모양이에요.
const tileStyle = {
  // 작은 SVG는 따옴표가 든 data URI로 들어와서 url()을 따옴표로 감싸야 해요.
  "--photo-mask": `url("${photoTileMask}")`,
  "--photo-pending": `url("${photoTilePending}")`,
} as CSSProperties;

/** 인증 사진 칸이에요. 한 장만 붙이고, 업로드에 실패하면 X로 지우고 다시 골라요. 사진은 선택 입력이에요. */
const PhotoField = ({ photo, onPick, onRemove }: PhotoFieldProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { openToast } = useToast();
  const isFailed = photo.status === "failed";

  const pick = (source: PhotoSource) => {
    setIsSheetOpen(false);
    // 권한을 거부해도 사진 없이 인증할 수 있어요.
    // 🔖 권한 거부·실패 문구는 시안에 없어 임시 문구예요.
    onPick(source).catch((error: unknown) =>
      openToast(
        isPhotoPermissionError(error)
          ? "사진을 올리려면 권한을 허용해 주세요"
          : "사진을 불러오지 못했어요",
      ),
    );
  };

  return (
    <section className={cn("flex flex-col gap-2.5 px-5 py-4", isFailed && "bg-(--adaptiveRed50)")}>
      <div className="flex flex-col gap-1.5">
        <Paragraph typography="t7" fontWeight="medium" color="var(--adaptiveGreyOpacity800)">
          사진
        </Paragraph>
        {photo.status === "empty" ? (
          <button
            type="button"
            onClick={() => setIsSheetOpen(true)}
            className="flex size-25 cursor-pointer appearance-none flex-col items-center justify-center gap-2 rounded-[14px]! border border-solid border-(--adaptiveGreyOpacity200) bg-(--adaptiveGrey50) p-0"
          >
            <CameraIcon aria-hidden className="size-6 text-(color:--adaptiveGrey400)" />
            <Paragraph typography="t7" fontWeight="semibold" color="var(--adaptiveGreyOpacity500)">
              사진 추가하기
            </Paragraph>
          </button>
        ) : (
          <div className="relative size-25">
            {photo.status === "uploaded" || photo.status === "kept" ? (
              <img
                src={photo.previewUrl}
                alt="첨부한 사진"
                style={tileStyle}
                className="size-full [mask-image:var(--photo-mask)] [mask-size:100%_100%] object-cover"
              />
            ) : (
              // 시안은 올리는 중과 실패를 같은 칸으로 그려요. 올리는 중에는 TDS 로더가 돌고, 실패하면 시안 아이콘으로 멈춰요.
              <div
                role="status"
                aria-label={isFailed ? "사진 업로드 실패" : "사진 올리는 중"}
                style={tileStyle}
                className="flex size-full items-center justify-center bg-(image:--photo-pending) bg-size-[100%_100%]"
              >
                {isFailed ? (
                  <LoadingIcon aria-hidden className="size-5.25 text-(color:--adaptiveGrey400)" />
                ) : (
                  <Loader size="small" type="dark" />
                )}
              </div>
            )}
            <button
              type="button"
              aria-label="사진 지우기"
              onClick={onRemove}
              className="absolute -top-1.25 left-20.25 flex size-6 cursor-pointer appearance-none items-center justify-center rounded-full! border border-solid border-(--adaptiveGreyOpacity200) bg-(--adaptiveGrey50) p-0"
            >
              <CloseIcon aria-hidden className="size-3.5 text-(color:--adaptiveGrey800)" />
            </button>
          </div>
        )}
      </div>
      {isFailed ? (
        <Paragraph typography="t7" color="var(--adaptiveRed600)">
          사진 업로드에 실패했어요. 다시 시도해주세요
        </Paragraph>
      ) : (
        <Paragraph typography="t7" color="var(--adaptiveGreyOpacity600)">
          이름, 주소, 주문번호 등 개인정보는 꼭 가려주세요.
        </Paragraph>
      )}
      <PhotoPickerSheet open={isSheetOpen} onClose={() => setIsSheetOpen(false)} onSelect={pick} />
    </section>
  );
};

export default PhotoField;
