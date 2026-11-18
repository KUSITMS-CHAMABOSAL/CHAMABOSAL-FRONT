import { useState } from "react";

import { FixedBottomCTA, TextField, Top } from "@toss/tds-mobile";

import {
  hasInvalidCharacter,
  isSubmittableNickname,
  NICKNAME_AVAILABLE_MESSAGE,
  NICKNAME_INVALID_MESSAGE,
  NICKNAME_MAX_LENGTH,
  NICKNAME_TAKEN_MESSAGE,
  trimNickname,
} from "@/entities/room";
import { limitLength } from "@/shared/lib";

interface NicknameFormProps {
  /** 처음 채워 둘 닉네임이에요. 나갔던 방에 다시 들어올 때 예전 닉네임을 넣어요. */
  initialNickname?: string;
  /** 서버가 이미 쓰는 닉네임이라고 답한 값이에요. 입력이 이 값과 같을 때만 오류를 보여줘요. */
  takenNickname?: string | null;
  isPending: boolean;
  onSubmit: (nickname: string) => void;
}

/**
 * 방에서 쓸 닉네임을 받는 화면이에요. 방 만들기와 초대 참여가 같이 써요.
 * 중복 확인 API가 없어서 "사용가능한 닉네임"은 글자 규칙을 통과했다는 뜻이에요. 중복은 보낸 뒤 서버가 알려줘요.
 */
const NicknameForm = ({
  initialNickname = "",
  takenNickname = null,
  isPending,
  onSubmit,
}: NicknameFormProps) => {
  const [value, setValue] = useState(initialNickname);
  const nickname = trimNickname(value);

  const isInvalid = hasInvalidCharacter(value);
  const isTaken = nickname === takenNickname;
  const canSubmit = isSubmittableNickname(value) && !isTaken;
  const help = isInvalid
    ? NICKNAME_INVALID_MESSAGE
    : isTaken
      ? NICKNAME_TAKEN_MESSAGE
      : canSubmit
        ? NICKNAME_AVAILABLE_MESSAGE
        : `${nickname.length}/${NICKNAME_MAX_LENGTH}`;

  return (
    <main>
      <Top
        title={
          <Top.TitleParagraph size={28} color="var(--adaptiveGrey900)">
            방에서 쓸 닉네임을
            <br />
            알려주세요.
          </Top.TitleParagraph>
        }
        subtitleBottom={
          <Top.SubtitleParagraph>친구들이 알아보기 쉬운 이름이 좋아요.</Top.SubtitleParagraph>
        }
      />
      <TextField
        variant="box"
        label="닉네임"
        labelOption="sustain"
        placeholder="한글, 영문 대소문자, 숫자 가능"
        value={value}
        hasError={isInvalid || isTaken}
        help={help}
        onChange={event => setValue(limitLength(event.target.value, NICKNAME_MAX_LENGTH, event))}
        onCompositionEnd={() => setValue(prev => prev.slice(0, NICKNAME_MAX_LENGTH))}
      />
      <FixedBottomCTA disabled={!canSubmit} loading={isPending} onClick={() => onSubmit(nickname)}>
        다음
      </FixedBottomCTA>
    </main>
  );
};

export default NicknameForm;
