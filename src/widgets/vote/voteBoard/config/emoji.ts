import ballotBox from "../assets/emoji_ballot_box.svg";
import eyes from "../assets/emoji_eyes.svg";
import lotusPosition from "../assets/emoji_lotus_position.svg";
import tippingHand from "../assets/emoji_tipping_hand.svg";

/** 안내 화면 위 이모지예요. 시안 프레임 크기(`size`) 안에서 그림이 놓인 자리(`inset`)까지 시안 그대로예요. */
export interface VoteEmoji {
  src: string;
  size: number;
  inset: string;
}

export const VOTE_EMOJI = {
  /** 👀 첫 투표 전 */
  eyes: { src: eyes, size: 52, inset: "inset-[14.97%_7.5%]" },
  /** 💁‍♂️ 3명 미만 */
  tippingHand: { src: tippingHand, size: 60, inset: "inset-[6.3%_3.48%_7.78%_4.28%]" },
  /** 🗳️ 명단 밖 */
  ballotBox: { src: ballotBox, size: 60, inset: "inset-[6.44%_8.36%_6.06%_8.37%]" },
  /** 🧘‍♀️ 투표 완료 */
  lotusPosition: { src: lotusPosition, size: 60, inset: "inset-[6.11%_8.89%_4.14%_8.84%]" },
} satisfies Record<string, VoteEmoji>;
