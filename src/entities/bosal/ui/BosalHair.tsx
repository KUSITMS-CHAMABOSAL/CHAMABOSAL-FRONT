import { useId } from "react";

import { BOSAL_HAIR_GRADIENT } from "../config/art";
import { HAIR_CURL_RADIUS, HAIR_CURLS, HEAD_OFFSET_X } from "../config/hairCurls";
import type { BosalColor } from "../model/types";

// 표정별 그림은 머리가 1px쯤 다르지만 시안 실수라서, 모든 표정에 기본 표정의 나발 자리를 써요.
const HAIRS = HAIR_CURLS.map(([cx, cy]) => [cx + HEAD_OFFSET_X, cy] as const);

interface BosalHairProps {
  color: BosalColor;
  /** 빠진 나발 번호(0~37)예요. */
  fallenHairs: ReadonlySet<number>;
}

/**
 * 보살 그림(88×139) 위에 그리는 나발 38가닥이에요. SVG 안에 넣어 써요.
 * 색별 그림 파일에는 나발이 없어서, 빠진 나발만 비우고 그려요.
 */
const BosalHair = ({ color, fallenHairs }: BosalHairProps) => {
  const gradientId = useId();
  const [top, bottom] = BOSAL_HAIR_GRADIENT[color];

  return (
    <>
      <defs>
        <linearGradient id={gradientId} x1={0} y1={0} x2={0} y2={1}>
          <stop stopColor={top} />
          <stop offset={1} stopColor={bottom} />
        </linearGradient>
      </defs>
      <g fill={`url(#${gradientId})`}>
        {HAIRS.map(([cx, cy], index) =>
          fallenHairs.has(index) ? null : (
            <circle key={index} cx={cx} cy={cy} r={HAIR_CURL_RADIUS} />
          ),
        )}
      </g>
    </>
  );
};

export default BosalHair;
