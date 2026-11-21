import type { CSSProperties } from "react";
import { BottomSheet, ListRow } from "@toss/tds-mobile";

import { AlbumIcon, CameraColorIcon } from "../assets";
import type { PhotoSource } from "../model/usePhotoUpload";

interface PhotoPickerSheetProps {
  open: boolean;
  onClose: () => void;
  onSelect: (source: PhotoSource) => void;
}

// 시안은 아이콘과 글자 사이가 16px이에요. ListRow 기본값은 12px이라 TDS 변수로 바꿔요.
const rowStyle = { "--list-row-left-gap": "16px" } as CSSProperties;

/** 인증 사진을 찍을지 앨범에서 고를지 정하는 바텀시트예요. 사진은 한 장만 붙여요. */
const PhotoPickerSheet = ({ open, onClose, onSelect }: PhotoPickerSheetProps) => (
  // 목록을 누르다 시트가 끌려 내려가지 않게 손잡이로만 끌어요.
  <BottomSheet open={open} onClose={onClose} disableChildrenDragging>
    <ListRow
      verticalPadding="large"
      style={rowStyle}
      left={<CameraColorIcon aria-hidden className="size-6" />}
      contents={<ListRow.Texts type="1RowTypeC" top="사진 촬영하기" />}
      onClick={() => onSelect("camera")}
    />
    <ListRow
      verticalPadding="large"
      style={rowStyle}
      left={
        // 시안의 앨범 아이콘은 24px 칸 안에 19.5px로 그려져요.
        <span className="flex size-6 items-center justify-center">
          <AlbumIcon aria-hidden />
        </span>
      }
      contents={<ListRow.Texts type="1RowTypeC" top="앨범에서 선택하기" />}
      onClick={() => onSelect("album")}
    />
    {/* 시안은 목록 아래에 20px 여백이 있어요. */}
    <div aria-hidden className="h-5" />
  </BottomSheet>
);

export default PhotoPickerSheet;
