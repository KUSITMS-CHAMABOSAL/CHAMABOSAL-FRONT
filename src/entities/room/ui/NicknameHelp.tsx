import { NICKNAME_MAX_LENGTH } from "../config/members";

interface NicknameHelpProps {
  /** 왼쪽 안내·오류 문구예요. 없으면 글자 수만 오른쪽에 보여줘요. */
  message: string | null;
  /** 앞뒤 띄어쓰기를 뺀 글자 수예요. */
  length: number;
}

/**
 * 닉네임 입력 칸 아래 줄이에요. 왼쪽은 안내·오류 문구, 오른쪽은 글자 수예요.
 * TDS `TextField`의 `help`로 넘겨요. 글자 크기와 문구 색은 TDS 도움말을 따라요.
 */
const NicknameHelp = ({ message, length }: NicknameHelpProps) => (
  <span className="flex justify-between gap-2">
    <span className="min-w-0">{message}</span>
    {/* 오류일 때 TDS가 도움말을 빨갛게 칠해도 글자 수는 시안처럼 회색으로 둬요. */}
    <span className="shrink-0 text-(color:--adaptiveGreyOpacity600)">
      {`${length}/${NICKNAME_MAX_LENGTH}`}
    </span>
  </span>
);

export default NicknameHelp;
