import { useState } from "react";

import { BottomSheet, TextField } from "@toss/tds-mobile";

import { NICKNAME_MAX_LENGTH } from "@/entities/room";
import { isApiError } from "@/shared/api";
import { useTabBarToast } from "@/shared/lib";

import {
  hasInvalidCharacter,
  isSubmittableNickname,
  NICKNAME_INVALID_MESSAGE,
  NICKNAME_TAKEN_MESSAGE,
} from "../model/nickname";
import { useRenameNickname } from "../model/useRenameNickname";

interface RenameNicknameSheetProps {
  open: boolean;
  roomId: number;
  roomName: string;
  /** 지금 닉네임이에요. 열 때마다 이 값으로 시작해요. */
  nickname: string;
  onClose: () => void;
}

/** 방 닉네임 수정 바텀시트예요. 닫혔다 열리면 지금 닉네임으로 다시 시작해요. */
const RenameNicknameSheet = ({
  open,
  roomId,
  roomName,
  nickname,
  onClose,
}: RenameNicknameSheetProps) => {
  const [value, setValue] = useState(nickname);
  const [isTaken, setIsTaken] = useState(false);
  const { mutate: rename, isPending } = useRenameNickname(roomId);
  const openToast = useTabBarToast();

  const isInvalid = hasInvalidCharacter(value);
  const errorMessage = isInvalid
    ? NICKNAME_INVALID_MESSAGE
    : isTaken
      ? NICKNAME_TAKEN_MESSAGE
      : null;
  const canSave = isSubmittableNickname(value) && value !== nickname && !isTaken;

  const save = () =>
    rename(value, {
      onSuccess: onClose,
      onError: error => {
        if (isApiError(error, "ROOM_004")) setIsTaken(true);
        else openToast("닉네임을 바꾸지 못했어요. 잠시 후 다시 시도해 주세요");
      },
    });

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
        maxLength={NICKNAME_MAX_LENGTH}
        hasError={errorMessage !== null}
        help={errorMessage ?? `${value.length}/${NICKNAME_MAX_LENGTH}`}
        aria-label="방 닉네임"
        onChange={event => {
          setValue(event.target.value.slice(0, NICKNAME_MAX_LENGTH));
          setIsTaken(false);
        }}
      />
    </BottomSheet>
  );
};

export default RenameNicknameSheet;
