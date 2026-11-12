import { type CSSProperties, useEffect, useRef, useState } from "react";

import { Button, Paragraph, TextButton, useToast } from "@toss/tds-mobile";

import { BosalGreyFigure, GREY_FIGURE, GREY_HAIR_CURLS } from "@/entities/bosal";
import { HAIR_PLANT_PRICE, useHairPlanting } from "@/features/storehouse/plantHair";
import { cn } from "@/shared/lib";
import { useSafeAreaBottom } from "@/shared/lib/appsInToss";

import bottomFade from "../assets/bottom_fade.png";
import { CloseIcon } from "../assets";
import hairPlanted from "../assets/hair_planted.png";
import slotEmpty from "../assets/slot_empty.png";
import slotSelected from "../assets/slot_selected.png";
import {
  PLANT_MOTION,
  PLANT_ZOOM,
  PLANT_ZOOM_CENTER_RANGE,
  PLANT_ZOOM_ORIGIN_Y,
  PLANT_ZOOM_SHIFT,
  TOAST_GAP,
} from "../config/motion";

/** 머리카락 자리를 `--slot-x`, `--slot-y` 변수로 넘겨요. 빈 자리 원은 시안대로 보살 폭의 55/346이에요. */
const slotStyle = (index: number) => {
  const [cx, cy] = GREY_HAIR_CURLS[index];
  return {
    "--slot-x": `${(cx / GREY_FIGURE.width) * 100}%`,
    "--slot-y": `${(cy / GREY_FIGURE.height) * 100}%`,
  } as CSSProperties;
};

/** 고른 자리가 보이도록 확대한 보살을 가운데, 왼쪽 끝, 오른쪽 끝 중 어디에 맞출지 정해요. */
const getZoomAlign = (index: number): keyof typeof PLANT_ZOOM_SHIFT => {
  const offset = GREY_HAIR_CURLS[index][0] / GREY_FIGURE.width - 0.5;
  if (offset < -PLANT_ZOOM_CENTER_RANGE) return "left";
  if (offset > PLANT_ZOOM_CENTER_RANGE) return "right";
  return "center";
};

// 가운데 맞춤은 개별 `translate` 속성(-translate-1/2) 대신 `transform`으로 해요. 낮은 WebView는 개별 변환 속성을 몰라요.
const slotClass =
  "absolute top-(--slot-y) left-(--slot-x) w-[calc(100%*55/346)] [transform:translate(-50%,-50%)]";

type Phase = "select" | "zoom" | "planted";

interface HairPlantingProps {
  onClose: () => void;
}

/**
 * 비어 있는 자리를 골라 공양미로 나발을 심어요.
 * 심으면 고른 자리로 확대해 새 나발이 돋아나는 걸 보여주고, 다시 원래 크기로 돌아와요.
 */
const HairPlanting = ({ onClose }: HairPlantingProps) => {
  const { plucked, rice, plant } = useHairPlanting();
  const [selected, setSelected] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>("select");
  const [zoomSlot, setZoomSlot] = useState<number | null>(null);
  const { openToast } = useToast();
  const safeAreaBottom = useSafeAreaBottom();
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const later = (delay: number, run: () => void) => {
    timers.current.push(window.setTimeout(run, delay));
  };

  const isSelecting = phase === "select";

  const canAfford = rice >= HAIR_PLANT_PRICE;

  // 시안(나발심기-08)처럼 공양미가 부족하면 버튼은 꺼 두고, 자리를 누를 때 고르지 않고 토스트로 알려요.
  const selectSlot = (index: number) => {
    if (!canAfford) {
      openToast("공양미가 부족해요", { gap: TOAST_GAP.aboveButtons + safeAreaBottom });
      return;
    }
    setSelected(index);
  };

  const submit = () => {
    if (selected === null) return;

    const index = selected;
    setZoomSlot(index);
    setPhase("zoom");
    later(PLANT_MOTION.zoomMs, () => {
      plant(index);
      setPhase("planted");
    });
    later(PLANT_MOTION.zoomMs + PLANT_MOTION.growMs, () =>
      openToast("나발이 심어졌어요", {
        gap: TOAST_GAP.bottom + safeAreaBottom,
        duration: PLANT_MOTION.toastMs,
      }),
    );
    later(PLANT_MOTION.zoomMs + PLANT_MOTION.holdMs, () => {
      setSelected(null);
      setPhase("select");
    });
  };

  return (
    <main
      className="relative flex h-svh flex-col overflow-hidden bg-(--adaptiveGrey900)"
      style={{ "--safe-area-bottom": `${safeAreaBottom}px` } as CSSProperties}
    >
      {/* TDS 글자 줄 높이가 시안보다 1~2px 커서 간격(13px)과 공양미 박스 높이(39px)를 고정해 시안 위치에 맞춰요. */}
      <header
        className={cn(
          "flex flex-col items-center gap-[13px] px-[43px] pt-8 transition-opacity duration-500 motion-reduce:transition-none",
          !isSelecting && "opacity-50",
        )}
      >
        <Paragraph
          typography="st12"
          color="var(--color-on-fill-opacity-60)"
          className="text-center!"
        >
          모든 설정은 절약에 재미를 더하기 위한 창작적 표현이에요
        </Paragraph>
        <Paragraph
          typography="st5"
          fontWeight="bold"
          color="var(--color-on-fill)"
          className="text-center!"
        >
          나발을 심을
          <br />
          자리를 선택해주세요
        </Paragraph>
        <div className="bg-on-fill-opacity-10 flex h-[39px] w-full items-center justify-between rounded-[14px] px-3">
          <Paragraph typography="t7" fontWeight="medium" color="var(--color-on-fill)">
            내 공양미
          </Paragraph>
          <Paragraph typography="t5" fontWeight="semibold" color="var(--adaptiveBlue600)">
            {`${rice}석`}
          </Paragraph>
        </div>
        <Paragraph typography="t7" fontWeight="semibold" color="var(--color-on-fill)">
          현재{" "}
          <Paragraph.Text typography="t7" fontWeight="semibold" color="var(--adaptiveRed600)">
            {plucked.size}
          </Paragraph.Text>
          곳 비어있어요
        </Paragraph>
      </header>

      {/*
        시안처럼 보살 아래 73px(다리)는 화면 밖으로 잘리게 화면 아래에 붙여요. 화면이 길면 머리 위 여백이 늘고,
        짧으면 문구와 겹치지 않게 문구 아래 31.5px에서 멈추고 다리가 더 가려져요.
      */}
      <div className="flex min-h-0 flex-1 flex-col justify-end-safe px-3.5 pt-[31.5px]">
        {/*
          시안처럼 머리를 가로 가운데에 두고 확대해요. 가장자리 자리를 골랐을 때만 그 자리가 보이게 밀어요.
          밀기와 확대를 `transform` 하나로 묶어 같이 전환해요. Tailwind의 translate-x-*, scale-*는 개별 변환 속성이라
          낮은 WebView에서 밀기만 애니메이션 없이 튀어, 양옆 자리를 심을 때 머리가 '슉' 옮겨 보였어요.
        */}
        <div
          className="relative mx-auto -mb-[73px] w-full max-w-[346px] shrink-0 origin-[50%_var(--zoom-origin-y)] [transform:translateX(var(--zoom-shift))_scale(var(--zoom))] transition-[transform] duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] motion-reduce:transition-none"
          style={
            {
              "--zoom": isSelecting ? 1 : PLANT_ZOOM,
              "--zoom-origin-y": `${PLANT_ZOOM_ORIGIN_Y * 100}%`,
              "--zoom-shift": `${(isSelecting || zoomSlot === null ? 0 : PLANT_ZOOM_SHIFT[getZoomAlign(zoomSlot)]) * 100}%`,
            } as CSSProperties
          }
        >
          {/*
            흐림은 SVG 안이 아니라 감싼 div에 걸어요. SVG 안쪽 투명도를 바꾸면 매 프레임 SVG 전체를 다시 그려
            실기기에서 확대와 함께 끊겨요. 보살 전체를 한 번에 흐려서 시안처럼 이목구비가 피부보다 어두워요.
          */}
          <div
            className={cn(
              "transition-opacity duration-500 motion-reduce:transition-none",
              isSelecting && "opacity-50",
            )}
          >
            <BosalGreyFigure pluckedHairs={plucked} className="block w-full" />
          </div>

          {isSelecting &&
            [...plucked].map((index, order) => (
              <button
                key={index}
                type="button"
                // 스크린 리더에서 자리를 구분하게 남은 빈 자리 중 몇 번째인지 붙여요.
                aria-label={`나발을 심을 빈 자리, ${plucked.size}곳 중 ${order + 1}번째`}
                aria-pressed={selected === index}
                onClick={() => selectSlot(index)}
                className={cn(
                  slotClass,
                  "aspect-square appearance-none rounded-full! border-0 bg-transparent p-0 outline-none! focus-visible:outline-2! focus-visible:outline-offset-2 focus-visible:outline-white! focus-visible:outline-solid!",
                )}
                style={slotStyle(index)}
              >
                <img
                  src={selected === index ? slotSelected : slotEmpty}
                  alt=""
                  className="block size-full"
                />
              </button>
            ))}

          {/* 자리 맞춤(transform)과 돋아나기(transform)를 같은 요소에 걸면 서로 덮어써서, 감싸는 요소를 나눠요. */}
          {phase === "planted" && selected !== null && (
            <div className={slotClass} style={slotStyle(selected)}>
              <img
                src={hairPlanted}
                alt=""
                className="motion-safe:animate-hair-grow block w-full"
              />
            </div>
          )}
        </div>
      </div>

      <div
        className={cn(
          // 그라데이션은 터치를 통과시켜서 그 밑에 깔린 빈 자리도 누를 수 있게 하고, 버튼만 눌려요.
          "pointer-events-none fixed inset-x-0 bottom-0 flex flex-col items-center gap-5 pt-[57px] pb-[calc(16px+var(--safe-area-bottom))] transition-opacity duration-300 motion-reduce:transition-none",
          isSelecting ? "[&>button]:pointer-events-auto" : "opacity-0",
        )}
      >
        <img src={bottomFade} alt="" className="absolute inset-0 -z-10 size-full" />
        <Button
          size="medium"
          className="w-41!"
          disabled={!canAfford || selected === null}
          onClick={submit}
        >
          {`${HAIR_PLANT_PRICE}석으로 나발 심기`}
        </Button>
        <TextButton
          size="small"
          color="var(--adaptiveGrey900)"
          onClick={onClose}
          className="px-6! py-[12.75px]!"
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

export default HairPlanting;
