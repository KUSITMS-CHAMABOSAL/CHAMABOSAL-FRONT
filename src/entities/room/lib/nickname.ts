const ALLOWED = /^[가-힣a-zA-Z0-9]*$/;
const COMPOSING = /^[가-힣a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ]*$/;

/** 띄어쓰기, 특수문자, 이모지, 자음·모음만 있는 글자를 넣었을 때 문구예요. */
export const NICKNAME_INVALID_MESSAGE = "사용할 수 없는 닉네임이에요.";
/** 디자인 문구예요(닉네임 입력 1-3.2). */
export const NICKNAME_AVAILABLE_MESSAGE = "사용가능한 닉네임이에요.";
export const NICKNAME_TAKEN_MESSAGE = "이미 쓰는 닉네임이에요.";

/** 같은 방 안의 닉네임 중복은 영문 대소문자를 구분하지 않아요(기획: Jisu = jisu). */
export const isSameNickname = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();

/** 서버처럼 앞뒤 띄어쓰기는 지우고 판단해요. 보낼 때도 이 값을 보내요. */
export const trimNickname = (value: string) => value.trim();

/**
 * 허용하지 않는 글자가 있으면 오류 문구를 보여줘요. 앞뒤 띄어쓰기는 오류가 아니에요.
 * 한글을 조합하는 중에는 "ㄱ → 가"처럼 자모를 거치니 자모를 봐주고, 조합이 끝난 뒤 남은 자모(ㅋㅋ)는 오류예요.
 */
export const hasInvalidCharacter = (value: string, isComposing: boolean) =>
  !(isComposing ? COMPOSING : ALLOWED).test(trimNickname(value));

/** 서버에 보낼 수 있는 닉네임이에요. 자모만 남은 글자는 아직 보낼 수 없어요. */
export const isSubmittableNickname = (value: string) => {
  const nickname = trimNickname(value);
  return nickname.length > 0 && ALLOWED.test(nickname);
};
