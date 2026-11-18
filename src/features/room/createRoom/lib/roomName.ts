const ALLOWED = /^[가-힣a-zA-Z0-9 ]*$/;
/** 한글 조합 중인 자모는 남겨야 해서 지울 때는 자모도 허용해요. */
const NOT_ALLOWED_WHILE_TYPING = /[^가-힣a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ ]/g;

/** 쓸 수 없는 글자(특수문자, 이모지 등)를 입력하는 즉시 지워요. 그래서 오류 문구를 따로 보여주지 않아요. */
export const sanitizeRoomName = (value: string) => value.replace(NOT_ALLOWED_WHILE_TYPING, "");

/** 서버에 보낼 수 있는 방 이름이에요. 서버처럼 앞뒤 띄어쓰기를 지운 뒤 한 글자 이상이어야 해요. */
export const isSubmittableRoomName = (value: string) =>
  value.trim().length > 0 && ALLOWED.test(value);
