import type { CSSProperties } from "react";

import { Button, Paragraph, TextButton } from "@toss/tds-mobile";

import { cn } from "@/shared/lib";
import { useSafeAreaBottom } from "@/shared/lib/appsInToss";

import { CloseIcon } from "../assets";
import bosalPrayingBody from "../assets/bosal_praying_body.svg";
import bosalPrayingFace from "../assets/bosal_praying_face.svg";
import bosalPrayingHands from "../assets/bosal_praying_hands.svg";
import glowRing from "../assets/glow_ring.svg";
import pedestalTop from "../assets/pedestal_top.svg";
import { COMPLETE_GLOW_RING_SIZES, PRACTICE_BACKGROUND } from "../config/scene";

interface PracticeCompleteProps {
  /** [보너스 공양미 받기]예요. 시안은 곳간으로 이동해요. */
  onClaimBonus: () => void;
  onClose: () => void;
}

/**
 * 목표만큼 친 뒤의 완료 화면이에요(시안 목탁-08).
 * 보살과 받침대는 화면 아래에 붙여요. 아래 장면의 좌표는 375px 시안의 y 208부터 잰 값이에요.
 * 🔖 시안 주석은 보살을 각자 받은 색으로 보여 달라는데, 지금은 민트 그림만 있어요.
 */
const PracticeComplete = ({ onClaimBonus, onClose }: PracticeCompleteProps) => {
  const safeAreaBottom = useSafeAreaBottom();

  return (
    <main
      className={cn(
        "relative flex min-h-svh flex-col items-center overflow-hidden",
        PRACTICE_BACKGROUND,
      )}
      style={{ "--safe-area-bottom": `${safeAreaBottom}px` } as CSSProperties}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 h-[604px] w-[375px] [transform:translateX(-50%)]"
      >
        {/* 시안의 링은 채움 투명도가 수행 화면(0.6)의 절반이에요. */}
        {COMPLETE_GLOW_RING_SIZES.map(size => (
          <img
            key={size}
            src={glowRing}
            alt=""
            style={{ "--ring-size": `${size}px` } as CSSProperties}
            className="absolute top-[calc(261px-var(--ring-size)/2)] left-[calc(187px-var(--ring-size)/2)] size-(--ring-size) max-w-none opacity-50"
          />
        ))}
        {/* 받침대: 윗판과 아래로 옅어지는 기둥이에요. 시안의 마스크 대신 기둥 안에서 흐린 그림자를 잘라내요. */}
        <img
          src={pedestalTop}
          alt=""
          className="absolute top-[394px] left-[63px] h-[17.143px] w-[248.347px] max-w-none"
        />
        <div className="absolute top-[411.14px] left-[86.1px] h-[192.857px] w-[199.833px] overflow-hidden bg-linear-to-b from-[#d9d9d9] to-[#d9d9d900]">
          <div className="h-[18px] w-full bg-[#c0c0c0] blur-[10px]" />
        </div>
        {/* 보살은 시안처럼 몸, 얼굴, 손 세 장을 겹쳐요. */}
        <img
          src={bosalPrayingBody}
          alt=""
          className="absolute top-[107px] left-[97px] h-[286.999px] w-[181.999px] max-w-none"
        />
        <img
          src={bosalPrayingFace}
          alt=""
          className="absolute top-[199.98px] left-[142.65px] h-[68.844px] w-[93.087px] max-w-none"
        />
        <img
          src={bosalPrayingHands}
          alt=""
          className="absolute top-[268.83px] left-[114.23px] h-[84.092px] w-[148.621px] max-w-none"
        />
      </div>

      <div className="relative flex flex-col items-center gap-3.5 pt-[65px]">
        {/* 제목 글자에 시안의 원형 그라데이션을 입혀요. iOS는 글자를 직접 감싼 요소에 걸어야 글자에 칠해져서,
            TDS가 글자를 넣는 span 안에 한 겹 더 두고 거기에 걸어요. 접두사도 iOS 때문이에요. */}
        <Paragraph typography="st2" fontWeight="bold" className="text-center!">
          <span className="inline-block bg-[radial-gradient(46%_50%_at_50%_50%,rgba(237,40,49,0.24)_0%,rgba(193,63,138,0.5)_50%,rgba(149,85,227,0.76)_100%)] bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
            수행을 완료했어요
          </span>
        </Paragraph>
        <Paragraph
          typography="t7"
          fontWeight="semibold"
          color="var(--adaptiveGreyOpacity600)"
          className="text-center!"
        >
          머릿속 번뇌가 모두 사라졌어요
        </Paragraph>
      </div>

      <div className="absolute inset-x-0 bottom-[calc(16px+var(--safe-area-bottom))] flex flex-col items-center gap-5">
        <Button size="medium" onClick={onClaimBonus}>
          보너스 공양미 받기
        </Button>
        <TextButton
          size="small"
          color="var(--adaptiveGrey900)"
          onClick={onClose}
          className="px-6! py-3.5!"
        >
          {/* TextButton은 내용을 글자 span 안에 넣어서 아이콘을 인라인으로 붙여요. */}
          <span className="mr-3 inline-flex size-5 items-center justify-center align-[-4px]">
            <CloseIcon aria-hidden className="size-[13px] text-(color:--adaptiveGrey800)" />
          </span>
          닫기
        </TextButton>
      </div>
    </main>
  );
};

export default PracticeComplete;
