const ALLOWED = /^[가-힣a-zA-Z0-9]*$/;
const COMPOSING = /^[가-힣a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ]*$/;

// 🔖 오류 문구는 시안에 없어요. 디자이너 확인이 필요해요.
export const NICKNAME_INVALID_MESSAGE = "한글, 영문, 숫자만 쓸 수 있어요.";
export const NICKNAME_TAKEN_MESSAGE = "이미 쓰는 닉네임이에요.";

/** 자모까지 포함해 허용하지 않는 글자가 있으면 오류 문구를 보여줘요. */
export const hasInvalidCharacter = (value: string) => !COMPOSING.test(value);

/** 서버에 보낼 수 있는 닉네임이에요. 자모만 남은 글자는 아직 보낼 수 없어요. */
export const isSubmittableNickname = (value: string) => value.length > 0 && ALLOWED.test(value);
