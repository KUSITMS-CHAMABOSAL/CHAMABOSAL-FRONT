import { useLayoutEffect, useRef, useState } from "react";
import { IconButton } from "@toss/tds-mobile";

import type { CandidateChoice, ChoiceKey } from "../model/types";
import CandidateCard from "./CandidateCard";

interface CandidateCarouselProps {
  choices: CandidateChoice[];
  selected: ChoiceKey | null;
  onSelect: (key: ChoiceKey) => void;
}

/** 가운데에서 한 칸 이상 떨어진 카드의 투명도예요(화면설계서 20 "보고 있는 카드 외에는 투명도 60%"). */
const DIMMED_OPACITY = 0.6;

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const keyOf = (choice: CandidateChoice): ChoiceKey =>
  choice.kind === "allBosal" ? "allBosal" : choice.candidate.memberId;

/**
 * 후보 고르기 캐러셀이에요. 드래그하거나 화살표로 한 칸씩 넘기고, 보고 있는 카드 말고는 흐려요.
 * 넘기기는 브라우저 가로 스크롤과 scroll-snap이라 관성과 멈출 자리를 WebView가 맞춰요(홈 오늘의 보살들과 같아요).
 */
const CandidateCarousel = ({ choices, selected, onSelect }: CandidateCarouselProps) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);
  const [focused, setFocused] = useState(0);

  /**
   * 카드마다 자기가 멈추는 자리에서 떨어진 만큼 흐려요. 넘기는 동안 손가락을 따라 서서히 바뀌어요.
   * 양 끝 카드는 끝까지 넘겨도 가운데에 오지 않아서, 가운데가 아니라 그 카드가 멈추는 스크롤 위치를 기준으로 재요.
   * 매 프레임 다시 그리지 않도록 투명도는 요소에 바로 쓰고, 화살표에 쓰는 보고 있는 카드만 상태로 둬요.
   */
  const updateCards = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const { scrollLeft, clientWidth, scrollWidth } = scroller;
    const cards = [...scroller.querySelectorAll<HTMLElement>("[data-card]")];
    const pitch = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : 1;
    const maxScroll = scrollWidth - clientWidth;
    const away = cards.map(card => {
      const stop = card.offsetLeft + card.offsetWidth / 2 - clientWidth / 2;
      return Math.min(1, Math.abs(scrollLeft - Math.min(Math.max(stop, 0), maxScroll)) / pitch);
    });
    cards.forEach((card, index) => {
      card.style.opacity = String(1 - (1 - DIMMED_OPACITY) * away[index]);
    });
    setFocused(away.indexOf(Math.min(...away)));
  };

  // 스크롤 이벤트마다가 아니라 화면을 그릴 때 한 번만 계산해요.
  const scheduleUpdate = () => {
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(updateCards);
  };

  // 처음 그릴 때도 가장자리 카드를 흐려 둬요.
  useLayoutEffect(() => {
    updateCards();
    return () => cancelAnimationFrame(frameRef.current);
  }, [choices.length]);

  const goTo = (index: number) =>
    scrollerRef.current?.querySelectorAll("[data-card]")[index]?.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      inline: "center",
      block: "nearest",
    });

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        onScroll={scheduleUpdate}
        className="flex snap-x snap-mandatory [scrollbar-width:none] gap-2 overflow-x-auto overscroll-x-contain px-6 [&::-webkit-scrollbar]:hidden"
      >
        {choices.map(choice => {
          const key = keyOf(choice);
          return (
            <div key={key} data-card className="flex shrink-0 snap-center">
              <CandidateCard
                choice={choice}
                selected={selected === key}
                onSelect={() => onSelect(key)}
              />
            </div>
          );
        })}
      </div>
      {/* 시안처럼 카드 가운데 높이에 흰 원 화살표가 떠요. */}
      {focused > 0 && (
        <IconButton
          name="icon-arrow-left-mono"
          variant="fill"
          bgColor="var(--adaptiveBackground)"
          color="var(--adaptiveGrey600)"
          iconSize={16}
          aria-label="이전 후보"
          onClick={() => goTo(focused - 1)}
          className="absolute top-1/2 left-6 size-8! -translate-y-1/2 rounded-full! shadow-[0_1px_3px_var(--adaptiveGreyOpacity200)]"
        />
      )}
      {focused < choices.length - 1 && (
        <IconButton
          name="icon-arrow-left-mono"
          variant="fill"
          bgColor="var(--adaptiveBackground)"
          color="var(--adaptiveGrey600)"
          iconSize={16}
          aria-label="다음 후보"
          onClick={() => goTo(focused + 1)}
          className="absolute top-1/2 right-6 size-8! -translate-y-1/2 rotate-180 rounded-full! shadow-[0_1px_3px_var(--adaptiveGreyOpacity200)]"
        />
      )}
    </div>
  );
};

export default CandidateCarousel;
