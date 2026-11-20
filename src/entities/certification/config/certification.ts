/** 한 줄 기록 최대 글자 수예요. 이모지도 한 글자로 세요(CERT-01). */
export const MEMO_MAX_LENGTH = 50;

/** 못 참았을 때 쓴 금액 범위예요(CERT-01). */
export const SPENT_AMOUNT_MIN = 1;
export const SPENT_AMOUNT_MAX = 999_999;

/** 인증 후 수정·삭제할 수 있는 시간이에요. 디자인 문구 "수정 및 삭제는 10분이내로만 가능해요" */
export const EDIT_WINDOW_MINUTES = 10;

/** 인증 사진 용량 상한이에요. 서버가 화면에서 지켜 달라고 한 값이에요(CERT-04, Q-30 임시 결정). */
export const PHOTO_MAX_BYTES = 10 * 1024 * 1024;
