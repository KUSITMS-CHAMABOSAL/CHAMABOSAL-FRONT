import { useEffect, useRef, useState } from "react";

import { Paragraph } from "@toss/tds-mobile";

import { BosalImage, BosalSilhouette, BosalStatusBadge } from "@/entities/bosal";
import { cn } from "@/shared/lib";

import type { BosalColor } from "@/entities/bosal";

/** 캐러셀 카드의 보살은 격자(139)보다 커요. 시안 184px */
const ART_HEIGHT = 184;
const POKED_FACE_MS = 900;
// 찔린 보살이 움찔해요. 누를 때마다 다시 재생해서 Web Animations API를 써요.
const WINCE: Keyframe[] = [
  { transform: "rotate(0deg)" },
  { transform: "rotate(-6deg) translateX(-3px)", offset: 0.25 },
  { transform: "rotate(5deg) translateX(2px)", offset: 0.55 },
  { transform: "rotate(0deg)" },
];

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

interface UnverifiedBosal {
  name: string;
  color: BosalColor;
  isMe: boolean;
}

interface UnverifiedCardProps {
  /** 없으면 아직 친구가 들어오기 전인 빈자리예요. */
  member?: UnverifiedBosal;
  /** 이 화면에서 콕 찌른 횟수예요. 늘 때마다 움찔해요. */
  pokes?: number;
}

const getMessage = (member?: UnverifiedBosal) => {
  if (!member) return "아직 친구가 들어오기 전이에요!";
  const next = member.isMe ? "친구에게 오늘의 순간을 인증해요!" : "콕 찔러서 알려줄까요?";
  return `${member.name}은 아직 인증하지 않았어요.\n${next}`;
};

/** 아직 인증하지 않은 보살이나 빈자리의 캐러셀 카드예요. 찔린 횟수가 늘면 표정이 잠깐 '찔림'으로 바뀌고 움찔해요. */
const UnverifiedCard = ({ member, pokes = 0 }: UnverifiedCardProps) => {
  const [isPoked, setIsPoked] = useState(false);
  const artRef = useRef<HTMLDivElement>(null);
  const lastPokes = useRef(pokes);

  useEffect(() => {
    if (pokes <= lastPokes.current) return;
    lastPokes.current = pokes;
    setIsPoked(true);
    if (!prefersReducedMotion())
      artRef.current?.animate(WINCE, { duration: 420, easing: "ease-out" });
    const timer = window.setTimeout(() => setIsPoked(false), POKED_FACE_MS);
    return () => window.clearTimeout(timer);
  }, [pokes]);

  return (
    <article className="flex h-[406px] flex-col gap-3 overflow-hidden rounded-[14px] border border-solid border-(--adaptiveGreyOpacity200) bg-(--adaptiveGreyOpacity100) p-3.5">
      <div className="flex min-w-0 items-center gap-1.5">
        <BosalStatusBadge status="unverified" />
        <Paragraph
          typography="t6"
          fontWeight="bold"
          color="var(--adaptiveGrey900)"
          className="truncate"
        >
          {member?.name ?? "중생"}
        </Paragraph>
      </div>
      <Paragraph typography="t6" color="var(--adaptiveGrey900)" className="whitespace-pre-line">
        {getMessage(member)}
      </Paragraph>
      <div className="flex min-h-0 flex-1 items-center justify-center">
        {member ? (
          // 두 표정을 겹쳐 두고 opacity만 바꿔요. 찔릴 때 그림을 새로 불러오느라 깜빡이지 않아요.
          <div ref={artRef} className="relative">
            <BosalImage
              color={member.color}
              expression="default"
              height={ART_HEIGHT}
              className={cn("block transition-opacity duration-150", isPoked && "opacity-0")}
            />
            <BosalImage
              color={member.color}
              expression="poked"
              height={ART_HEIGHT}
              className={cn(
                "absolute inset-0 opacity-0 transition-opacity duration-150",
                isPoked && "opacity-100",
              )}
            />
          </div>
        ) : (
          <BosalSilhouette height={ART_HEIGHT} />
        )}
      </div>
    </article>
  );
};

export default UnverifiedCard;
