import { memo, useId } from "react";

import { cn } from "@/shared/lib";

import greyFace from "../assets/bosal_grey_face.svg";
import greyHead from "../assets/bosal_grey_head.svg";
import greyLower from "../assets/bosal_grey_lower.svg";
import faceGrey from "../assets/face_grey.svg";
import {
  GREY_FIGURE,
  GREY_HAIR_CURL_RADIUS,
  GREY_HAIR_CURLS,
  GREY_HAIR_LAYERS,
} from "../config/greyHairCurls";

interface BosalGreyFigureProps {
  /** 뽑힌 머리카락 인덱스 */
  pluckedHairs: ReadonlySet<number>;
  className?: string;
}

const LAYER = { width: GREY_FIGURE.width, height: GREY_FIGURE.height };

/**
 * 나발 심기에서 보이는 회색 보살이에요. 시안의 `몸`을 층 순서 그대로 세 장으로 나누고,
 * 그 사이에 머리카락을 뽑힌 상태에 맞춰 그려서 시안과 같은 겹침을 만들어요.
 */
const BosalGreyFigure = ({ pluckedHairs, className }: BosalGreyFigureProps) => {
  const gradientId = `${useId().replace(/:/g, "")}-hair`;

  const curls = (indexes: readonly number[]) =>
    indexes.map(index => {
      if (pluckedHairs.has(index)) return null;
      const [cx, cy] = GREY_HAIR_CURLS[index];
      return (
        <circle
          key={index}
          cx={cx}
          cy={cy}
          r={GREY_HAIR_CURL_RADIUS}
          fill={`url(#${gradientId})`}
        />
      );
    });

  return (
    <svg
      viewBox={`0 0 ${GREY_FIGURE.width} ${GREY_FIGURE.height}`}
      // 맨 위 가닥(7번)은 원 위쪽이 시안 몸 영역(346×546) 밖으로 3.8 나가요. 잘리지 않게 영역 밖도 그려요.
      className={cn("overflow-visible!", className)}
      aria-hidden
    >
      <defs>
        {/* 시안 가닥마다 위(#D2D2D2)에서 아래(#BCBCBC)로 가는 그라디언트예요. 가닥 상자 기준이라 하나로 모두 그려요. */}
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#D2D2D2" />
          <stop offset="1" stopColor="#BCBCBC" />
        </linearGradient>
      </defs>
      {curls(GREY_HAIR_LAYERS.back)}
      <image href={greyHead} {...LAYER} />
      {curls(GREY_HAIR_LAYERS.outer)}
      <image href={greyFace} {...LAYER} />
      {curls(GREY_HAIR_LAYERS.inner)}
      <image href={greyLower} {...LAYER} />
      {curls(GREY_HAIR_LAYERS.top)}
      <image href={faceGrey} x={98.7} y={187.09} width={154.63} height={129.27} />
    </svg>
  );
};

export default memo(BosalGreyFigure);
