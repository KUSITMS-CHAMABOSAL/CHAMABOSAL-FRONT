import type { Ref } from "react";

import { Button } from "@toss/tds-mobile";

import { ChevronDownIcon } from "@/shared/assets/icons";
import { cn } from "@/shared/lib";

import type { ControlTone } from "../model/types";

interface TourControlsProps {
  tone: ControlTone;
  lightRef: Ref<HTMLDivElement>;
  darkRef: Ref<HTMLDivElement>;
  onNext: () => void;
  onSkip: () => void;
}

/**
 * ∨와 [스킵하기]예요. 모든 화면에서 같은 자리라 넘길 때 움직이지 않아요.
 * 색이 다른 두 벌을 겹쳐 두고 넘기기가 opacity를 바꿔요.
 * ∨는 위로 쓸어 넘기라는 표시라 눌러도 넘어가지 않아요(시안). 쓸 수 없는 스크린 리더 사용자만 숨긴 [다음 화면]으로 넘겨요.
 */
const TourControls = ({ tone, lightRef, darkRef, onNext, onSkip }: TourControlsProps) => (
  <div className="pointer-events-auto absolute top-[560px] left-[154px] h-[94px] w-[68px]">
    <div
      ref={lightRef}
      aria-hidden={tone !== "light"}
      className={cn(
        "absolute inset-0 flex flex-col items-center gap-3.5",
        tone !== "light" && "pointer-events-none opacity-0",
      )}
    >
      <span className="flex size-12 items-center justify-center">
        <ChevronDownIcon aria-hidden className="text-on-fill h-5 w-[35px]" />
      </span>
      <Button
        size="small"
        variant="weak"
        color="light"
        display="block"
        tabIndex={tone === "light" ? undefined : -1}
        onClick={onSkip}
      >
        스킵하기
      </Button>
    </div>
    <div
      ref={darkRef}
      aria-hidden={tone !== "dark"}
      className={cn(
        "absolute inset-0 flex flex-col items-center gap-3.5 drop-shadow-[0_-2px_15px_var(--adaptiveGreyOpacity200)]",
        tone !== "dark" && "pointer-events-none opacity-0",
      )}
    >
      <span className="flex size-12 items-center justify-center">
        <ChevronDownIcon aria-hidden className="h-5 w-[35px] text-(color:--adaptiveGrey700)" />
      </span>
      <Button
        size="small"
        variant="weak"
        color="dark"
        display="block"
        tabIndex={tone === "dark" ? undefined : -1}
        onClick={onSkip}
      >
        스킵하기
      </Button>
    </div>
    <button type="button" onClick={onNext} className="sr-only">
      다음 화면
    </button>
  </div>
);

export default TourControls;
