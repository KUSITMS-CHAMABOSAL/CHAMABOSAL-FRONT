import { MEMO_MAX_LENGTH } from "../config/certification";

const segmenter = new Intl.Segmenter("ko", { granularity: "grapheme" });

/** 한 줄 기록 글자 수예요. 서버처럼 이모지 하나를 한 글자로 세요. */
export const countMemo = (memo: string) => [...segmenter.segment(memo)].length;

/** 한 줄 기록을 최대 글자 수로 잘라요. 이모지를 반으로 자르지 않아요. */
export const sliceMemo = (memo: string) =>
  [...segmenter.segment(memo)]
    .slice(0, MEMO_MAX_LENGTH)
    .map(item => item.segment)
    .join("");

/** 1~50자이고 띄어쓰기만 있지 않으면 등록할 수 있어요. */
export const isValidMemo = (memo: string) =>
  memo.trim().length > 0 && countMemo(memo) <= MEMO_MAX_LENGTH;
