import { useState } from "react";

import { BottomSheet, TextField } from "@toss/tds-mobile";

import {
  hasInvalidCharacter,
  isSameNickname,
  isSubmittableNickname,
  NICKNAME_INVALID_MESSAGE,
  NICKNAME_MAX_LENGTH,
  NICKNAME_TAKEN_MESSAGE,
  trimNickname,
} from "@/entities/room";
import { isApiError } from "@/shared/api";
import { limitLength, useTabBarToast } from "@/shared/lib";

import { useRenameNickname } from "../model/useRenameNickname";

interface RenameNicknameSheetProps {
  open: boolean;
  roomId: number;
  roomName: string;
  /** 지금 닉네임이에요. 열 때마다 이 값으로 시작해요. */
  nickname: string;
  /** 투표 중(투표 시작 ~ 결과 발표)에는 저장할 수 없어요(설계서 33). */
  isVoting: boolean;
  onClose: () => void;
}

/** 방 닉네임 수정 바텀시트예요. 닫혔다 열리면 지금 닉네임으로 다시 시작해요. */
const RenameNicknameSheet = ({
  open,
  roomId,
  roomName,
  nickname,
  isVoting,
  onClose,
}: RenameNicknameSheetProps) => {
  const [value, setValue] = useState(nickname);
  /** 서버가 중복이라고 답한 닉네임이에요. 응답 전에 입력을 바꿔도 지금 값에 오류가 붙지 않아요. */
  const [takenNickname, setTakenNickname] = useState<string | null>(null);
  const { mutate: rename, isPending } = useRenameNickname(roomId);
  const openToast = useTabBarToast();

  const trimmed = trimNickname(value);
  const isTaken = takenNickname !== null && isSameNickname(trimmed, takenNickname);
  const isInvalid = hasInvalidCharacter(value);
  const errorMessage = isInvalid
    ? NICKNAME_INVALID_MESSAGE
    : isTaken
      ? NICKNAME_TAKEN_MESSAGE
      : null;
  const canSave = isSubmittableNickname(value) && trimmed !== nickname && !isTaken && !isVoting;

  const save = () => {
    const submitted = trimmed;
    rename(submitted, {
      onSuccess: onClose,
      onError: error => {
        if (isApiError(error, "ROOM_004")) setTakenNickname(submitted);
        else openToast("닉네임을 바꾸지 못했어요. 잠시 후 다시 시도해 주세요");
      },
    });
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      hasTextField
      header={<BottomSheet.Header>방 닉네임 수정</BottomSheet.Header>}
      headerDescription={<BottomSheet.HeaderDescription>{roomName}</BottomSheet.HeaderDescription>}
      cta={
        <BottomSheet.CTA disabled={!canSave} loading={isPending} onClick={save}>
          저장하기
        </BottomSheet.CTA>
      }
    >
      <TextField
        variant="box"
        value={value}
        hasError={errorMessage !== null}
        help={errorMessage ?? `${trimmed.length}/${NICKNAME_MAX_LENGTH}`}
        aria-label="방 닉네임"
        onChange={event => setValue(limitLength(event.target.value, NICKNAME_MAX_LENGTH, event))}
        onCompositionEnd={() => setValue(prev => prev.slice(0, NICKNAME_MAX_LENGTH))}
      />
    </BottomSheet>
  );
};

export default RenameNicknameSheet;
