import type { CSSProperties } from "react";

import { cn } from "@/shared/lib";

import type { VoteEmoji } from "../config/emoji";

/** 안내 화면 위 이모지 한 개예요. 그림이 놓인 자리를 시안 프레임 안의 여백으로 맞춰요. */
const EmojiFigure = ({ src, size, inset }: VoteEmoji) => (
  <div
    aria-hidden
    style={{ "--emoji-size": `${size}px` } as CSSProperties}
    className="relative mx-auto size-(--emoji-size)"
  >
    <div className={cn("absolute", inset)}>
      <img src={src} alt="" className="block size-full" />
    </div>
  </div>
);

export default EmojiFigure;
