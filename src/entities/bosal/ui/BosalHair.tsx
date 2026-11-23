import { useId } from "react";

import { BOSAL_HAIR_GRADIENT } from "../config/art";
import {
  EXPRESSION_HAIR_CURLS,
  EXPRESSION_HAIR_RADIUS_X,
  HAIR_CURL_RADIUS,
  HAIR_CURLS,
  HEAD_OFFSET_X,
} from "../config/hairCurls";
import type { BosalColor, BosalExpression } from "../model/types";

/** 기본 표정과 나머지 표정은 그림의 나발 자리가 조금 달라요. */
const DEFAULT_HAIRS = HAIR_CURLS.map(([cx, cy]) => [cx + HEAD_OFFSET_X, cy] as const);
const getHairLayout = (expression: BosalExpression) =>
  expression === "default"
    ? { curls: DEFAULT_HAIRS, rx: HAIR_CURL_RADIUS }
    : { curls: EXPRESSION_HAIR_CURLS, rx: EXPRESSION_HAIR_RADIUS_X };

interface BosalHairProps {
  color: BosalColor;
  expression: BosalExpression;
  /** 빠진 나발 번호(0~37)예요. */
  fallenHairs: ReadonlySet<number>;
}

/**
 * 보살 그림(88×139) 위에 그리는 나발 38가닥이에요. SVG 안에 넣어 써요.
 * 색별 그림 파일에는 나발이 없어서, 빠진 나발만 비우고 그려요. 가닥마다 `data-hair`로 찾을 수 있어요.
 */
const BosalHair = ({ color, expression, fallenHairs }: BosalHairProps) => {
  const gradientId = useId();
  const [top, bottom] = BOSAL_HAIR_GRADIENT[color];
  const { curls, rx } = getHairLayout(expression);

  return (
    <>
      <defs>
        <linearGradient id={gradientId} x1={0} y1={0} x2={0} y2={1}>
          <stop stopColor={top} />
          <stop offset={1} stopColor={bottom} />
        </linearGradient>
      </defs>
      <g fill={`url(#${gradientId})`}>
        {curls.map(([cx, cy], index) =>
          fallenHairs.has(index) ? null : (
            <ellipse
              key={index}
              data-hair={index}
              cx={cx}
              cy={cy}
              rx={rx}
              ry={HAIR_CURL_RADIUS}
              className="origin-center transform-fill"
            />
          ),
        )}
      </g>
    </>
  );
};

export default BosalHair;
