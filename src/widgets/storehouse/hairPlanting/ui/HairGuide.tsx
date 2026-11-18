import { type CSSProperties, useEffect, useState } from "react";

import { Button, Paragraph, TextButton } from "@toss/tds-mobile";

import { BosalGreyFigure, GREY_FIGURE, GREY_HAIR_CURLS } from "@/entities/bosal";
import { ItemCard } from "@/entities/item";
import { HAIR_PLANT_PRICE } from "@/features/storehouse/plantHair";
import { cn } from "@/shared/lib";
import { useSafeAreaBottom } from "@/shared/lib/appsInToss";

import bosalMintRestored from "../assets/bosal_mint_restored.svg";
import bottomFade from "../assets/bottom_fade.png";
import { CloseIcon } from "../assets";
import slotEmpty from "../assets/slot_empty.png";
import slotRing from "../assets/slot_ring.png";
import {
  GUIDE_CARD_PLUCKED,
  GUIDE_LAST_SCENE,
  GUIDE_LAYOUT,
  GUIDE_PLUCKED_BY_SCENE,
  GUIDE_SCENE_AT_MS,
  GUIDE_SLOT_FADE_MS,
  GUIDE_TRANSITION_MS,
} from "../config/guide";

const COPIES = [
  {
    title: "헉! 나발 한 알이 떨어졌어요",
    lines: ["나발은 꾸준한 수행의 흔적이에요", "수행을 쉬는 날마다 한 알씩 떨어져요"],
    dark: true,
  },
  {
    title: "중생으로 돌아가고 있어요",
    lines: ["괜찮아요, 누구나 쉬어 갈 때가 있어요", "오늘부터 다시 인증하면 돼요"],
    dark: true,
  },
  {
    title: "다시 보살이 되려면?",
    lines: ["열심히 공양미를 모아서", "아이템을 구매하면 다시 보살이 될 수 있어요"],
    dark: false,
  },
] as const;

/** 장면 번호(시안 01~07은 0~6)로 화면 모양을 정해요. */
const getGuideView = (scene: number) => ({
  zoomed: scene >= 1 && scene <= 4,
  light: scene >= 5,
  copy: scene === 0 ? 0 : scene <= 4 ? 1 : 2,
  showActions: scene >= 1,
  restored: scene === GUIDE_LAST_SCENE,
});

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// 빈 자리 원은 시안대로 보살 폭의 55/346이에요. 나발 심기 화면과 같은 방식으로 자리를 잡아요.
const slotStyle = (index: number) => {
  const [cx, cy] = GREY_HAIR_CURLS[index];
  return {
    "--slot-x": `${(cx / GREY_FIGURE.width) * 100}%`,
    "--slot-y": `${(cy / GREY_FIGURE.height) * 100}%`,
  } as CSSProperties;
};

// 가운데 맞춤과 확대는 `transform` 하나로 써요. 낮은 WebView는 개별 변환 속성(translate, scale)을 몰라요.
// 시간은 `main`에 넘긴 `--guide-transition`(GUIDE_TRANSITION_MS)이에요.
const transition =
  "transition-[transform,opacity] duration-(--guide-transition) ease-[cubic-bezier(0.33,1,0.68,1)] motion-reduce:transition-none";

interface HairGuideProps {
  onPlant: () => void;
  /** 07 카드의 [구매하기] */
  onBuy: () => void;
  onClose: () => void;
}

/**
 * 나발이 처음 빠졌을 때 보여주는 설명이에요. 들어오면 시안 01~07을 이어서 재생하고 07에서 멈춰요.
 * 동작 줄이기를 켠 사용자에게는 바로 마지막 장면을 보여줘요.
 */
const HairGuide = ({ onPlant, onBuy, onClose }: HairGuideProps) => {
  const [scene, setScene] = useState(() => (prefersReducedMotion() ? GUIDE_LAST_SCENE : 0));
  const safeAreaBottom = useSafeAreaBottom();

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const timers = GUIDE_SCENE_AT_MS.slice(1).map((at, index) =>
      window.setTimeout(() => setScene(index + 1), at),
    );
    return () => timers.forEach(window.clearTimeout);
  }, []);

  const view = getGuideView(scene);
  const plucked = GUIDE_PLUCKED_BY_SCENE[scene];

  return (
    <main
      className="relative h-svh overflow-hidden bg-[linear-gradient(var(--adaptiveGrey900)_150px,var(--adaptiveGrey300))]"
      style={
        {
          "--safe-area-bottom": `${safeAreaBottom}px`,
          "--guide-transition": `${GUIDE_TRANSITION_MS}ms`,
          "--slot-fade": `${GUIDE_SLOT_FADE_MS}ms`,
        } as CSSProperties
      }
    >
      {/* 시안 배경은 위 30%까지 단색이에요. 토스 상단 바(94px)를 뺀 화면에서는 150px이에요. */}
      <div
        className={cn(
          "absolute inset-0 bg-[linear-gradient(var(--adaptiveGrey50)_150px,var(--adaptiveGrey300))]",
          transition,
          !view.light && "opacity-0",
        )}
      />

      {/* 회색 보살. 위쪽 끝을 기준으로 확대해요. 녹화처럼 천천히 시작해 빨라졌다가 멈춰요. */}
      <div
        className={cn(
          "absolute top-(--top) left-1/2 w-(--width) origin-top [transform:translateX(-50%)_scale(var(--zoom))]",
          transition,
          "ease-[cubic-bezier(0.65,0,0.35,1)]",
          view.restored && "opacity-0",
        )}
        style={
          {
            "--top": `${GUIDE_LAYOUT.figureTop}px`,
            "--width": `${GUIDE_LAYOUT.figureWidth}px`,
            "--zoom": view.zoomed ? GUIDE_LAYOUT.zoom : 1,
          } as CSSProperties
        }
      >
        <BosalGreyFigure pluckedHairs={plucked} className="block w-full" />
        {[...plucked].map(index => (
          <img
            key={index}
            src={slotEmpty}
            alt=""
            className="absolute top-(--slot-y) left-(--slot-x) w-[calc(100%*55/346)] [transform:translate(-50%,-50%)] motion-safe:animate-[fade-in_var(--slot-fade)_ease-out]"
            style={slotStyle(index)}
          />
        ))}
      </div>

      {/* 다시 보살이 된 초록 보살 */}
      <img
        src={bosalMintRestored}
        alt=""
        className={cn(
          "absolute top-(--top) left-1/2 w-(--width) max-w-none [transform:translate(-50%,var(--rise))]",
          transition,
          !view.restored && "opacity-0",
        )}
        style={
          {
            "--top": `${GUIDE_LAYOUT.mintTop}px`,
            "--width": `${GUIDE_LAYOUT.mintWidth}px`,
            "--rise": view.restored ? "0px" : `${GUIDE_LAYOUT.mintRise}px`,
          } as CSSProperties
        }
      />

      {/* 문구는 겹쳐 두고 장면에 맞는 것만 보여줘요. 다음 문구는 아래에, 지난 문구는 위에 숨겨 둬요. */}
      <div
        className="absolute inset-x-0 top-(--top) grid justify-items-center px-5"
        style={{ "--top": `${GUIDE_LAYOUT.copyTop}px` } as CSSProperties}
      >
        {COPIES.map((copy, index) => (
          <div
            key={copy.title}
            aria-hidden={index !== view.copy}
            className={cn(
              "flex [transform:translateY(var(--copy-y))] flex-col items-center gap-2.5 [grid-area:1/1]",
              transition,
              index !== view.copy && "opacity-0",
            )}
            style={
              {
                "--copy-y": `${index > view.copy ? GUIDE_LAYOUT.copyEnter : index < view.copy ? -GUIDE_LAYOUT.copyExit : 0}px`,
              } as CSSProperties
            }
          >
            <Paragraph
              typography="st5"
              fontWeight="bold"
              color={copy.dark ? "var(--color-on-fill)" : "var(--adaptiveGrey900)"}
              className="text-center!"
            >
              {copy.title}
            </Paragraph>
            <Paragraph
              typography="t7"
              fontWeight="semibold"
              color={copy.dark ? "var(--color-on-fill)" : "var(--adaptiveGreyOpacity700)"}
              className="text-center!"
            >
              {copy.lines[0]}
              <br />
              {copy.lines[1]}
            </Paragraph>
          </div>
        ))}
      </div>

      {/* 07 장면에서만 보이고 눌려요. 숨어 있는 동안은 누르거나 읽히지 않게 해요. */}
      <div
        aria-hidden={!view.restored}
        className={cn(
          "absolute top-(--top) left-1/2 w-40 [transform:translate(-50%,var(--rise))]",
          transition,
          !view.restored && "pointer-events-none opacity-0",
        )}
        style={
          {
            "--top": `${GUIDE_LAYOUT.cardTop}px`,
            "--rise": view.restored ? "0px" : `${GUIDE_LAYOUT.cardRise}px`,
          } as CSSProperties
        }
      >
        <ItemCard
          className="bg-(--adaptiveBackground) shadow-[0_2px_15px_var(--adaptiveGreyOpacity200)]"
          name="나발 심기"
          price={HAIR_PLANT_PRICE}
          status="보유 0개"
          thumbnail={
            // 곳간 나발 심기 카드처럼 회색 보살의 머리만 둥근 사각형 창(85px)으로 잘라 보여줘요.
            <div className="relative h-[95px] w-[136px]">
              <div className="absolute top-[5px] left-[25px] size-[85px] overflow-hidden rounded-xl">
                <BosalGreyFigure
                  pluckedHairs={GUIDE_CARD_PLUCKED}
                  className="absolute top-[23px] -left-[17px] w-[115px]"
                />
                <img
                  src={slotRing}
                  alt=""
                  className="absolute top-[15px] left-[35px] size-[26px]"
                />
              </div>
            </div>
          }
          action={
            <Button
              size="small"
              variant="weak"
              display="full"
              tabIndex={view.restored ? undefined : -1}
              onClick={onBuy}
            >
              구매하기
            </Button>
          }
        />
      </div>

      <div
        className={cn(
          "fixed inset-x-0 bottom-0 flex flex-col items-center pt-[57px] pb-[calc(16px+var(--safe-area-bottom))]",
          transition,
          !view.showActions && "pointer-events-none opacity-0",
        )}
      >
        <img src={bottomFade} alt="" className="absolute inset-0 -z-10 size-full" />
        <Paragraph
          typography="st12"
          color="var(--adaptiveGreyOpacity600)"
          className="mb-[17px]! text-center!"
        >
          모든 설정은 절약에 재미를 더하기 위한 창작적 표현이에요
        </Paragraph>
        <Button size="medium" onClick={onPlant}>
          나발 심으러 가기
        </Button>
        <TextButton
          size="small"
          color="var(--adaptiveGrey900)"
          onClick={onClose}
          className="mt-5! px-6! py-[12.75px]!"
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

export default HairGuide;
