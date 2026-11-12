import { memo, type Ref, useId } from "react";

import { cn } from "@/shared/lib";

import armLeft from "../assets/arm_left.svg";
import armRight from "../assets/arm_right.svg";
import body from "../assets/body.svg";
import faceDefault from "../assets/face_default.svg";
import faceFailed from "../assets/face_failed.svg";
import facePatient from "../assets/face_patient.svg";
import facePoked from "../assets/face_poked.svg";
import hands from "../assets/hands.svg";
import headBase from "../assets/head_base.svg";
import rudolphNose from "../assets/item_rudolph_nose.svg";
import santaHat from "../assets/item_santa_hat.svg";
import sweat from "../assets/sweat.svg";
import { HAIR_CURL_RADIUS, HAIR_CURLS, HEAD_OFFSET_X } from "../config/hairCurls";
import type { BosalExpression, BosalFaceItem, BosalHat } from "../model/types";

interface BosalFigureProps {
  expression?: BosalExpression;
  hat?: BosalHat | null;
  faceItem?: BosalFaceItem | null;
  /** 뽑힌 머리카락 인덱스 */
  pluckedHairs?: ReadonlySet<number>;
  /** 아이템 카드처럼 보살은 흐리게, 아이템만 또렷하게 보여줄 때 써요. */
  dimmed?: boolean;
  className?: string;
  /** 뽑기 애니메이션이 SVG 안의 머리카락을 찾을 때 써요. */
  svgRef?: Ref<SVGSVGElement>;
}

const HEAD = { x: HEAD_OFFSET_X, y: 0, width: 87.89, height: 88.87 };

const FACES: Record<
  BosalExpression,
  { href: string; x: number; y: number; width: number; height: number }
> = {
  default: { href: faceDefault, ...HEAD },
  patient: { href: facePatient, x: 21.84, y: 45.04, width: 45.91, height: 33.34 },
  failed: { href: faceFailed, x: 21.67, y: 45.04, width: 45.55, height: 33.34 },
  poked: { href: facePoked, x: 21.4, y: 45.03, width: 45.38, height: 35.47 },
};

// 착용 아이템은 항상 렌더링하고 투명도만 바꿔요. 착용하는 순간 이미지를 불러오면 WebView에서 한 프레임 비어 보여요.
const itemClass = (worn: boolean) =>
  cn(
    "transition-[opacity,translate,scale] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none",
    worn ? "translate-y-0 scale-100 opacity-100" : "-translate-y-3 scale-90 opacity-0",
  );

const BosalFigure = ({
  expression = "default",
  hat = null,
  faceItem = null,
  pluckedHairs,
  dimmed = false,
  className,
  svgRef,
}: BosalFigureProps) => {
  const gradientPrefix = useId().replace(/:/g, "");

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 88.58 139"
      className={cn("overflow-visible!", className)}
      aria-hidden
    >
      <defs>
        {HAIR_CURLS.map(([cx, , y1, y2], index) => (
          <linearGradient
            key={index}
            id={`${gradientPrefix}-hair-${index}`}
            x1={cx}
            y1={y1}
            x2={cx}
            y2={y2}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFE2E9" />
            <stop offset="1" stopColor="#FB93AC" />
          </linearGradient>
        ))}
      </defs>

      <g className={cn(dimmed && "opacity-60")}>
        <g transform="translate(57.43 63.7) rotate(-8.91) scale(-1 1)">
          <image href={armRight} x={-21.65} y={-20.78} width={43.3} height={41.57} />
        </g>
        <g transform="translate(30.89 63.7) rotate(8.91)">
          <image href={armLeft} x={-21.65} y={-20.78} width={43.3} height={41.57} />
        </g>
        <image href={body} x={1.03} y={6.98} width={86.16} height={132.02} />
        <image href={headBase} {...HEAD} />

        <g transform={`translate(${HEAD_OFFSET_X} 0)`}>
          {HAIR_CURLS.map(([cx, cy], index) =>
            pluckedHairs?.has(index) ? null : (
              <g key={index} data-hair={index} className="origin-center transform-fill">
                <circle
                  cx={cx}
                  cy={cy}
                  r={HAIR_CURL_RADIUS}
                  fill={`url(#${gradientPrefix}-hair-${index})`}
                />
              </g>
            ),
          )}
        </g>

        {Object.entries(FACES).map(([key, { href, ...box }]) => (
          <image
            key={key}
            href={href}
            {...box}
            className={cn(
              "transition-opacity duration-200 motion-reduce:transition-none",
              key === expression ? "opacity-100" : "opacity-0",
            )}
          />
        ))}
        <image
          href={sweat}
          x={85}
          y={15}
          width={22}
          height={22}
          className={cn(
            "transition-opacity duration-200 motion-reduce:transition-none",
            expression === "failed" ? "opacity-100" : "opacity-0",
          )}
        />
        <image href={hands} x={7.49} y={78.38} width={71.89} height={40.73} />
      </g>

      <g transform="translate(44.69 68.35)">
        <g className={cn("origin-center transform-fill", itemClass(faceItem === "rudolphNose"))}>
          <image href={rudolphNose} x={-6.44} y={-6.44} width={12.88} height={12.88} />
        </g>
      </g>
      <g transform="translate(47.95 0.55) rotate(6.67)">
        <g className={cn("origin-center transform-fill", itemClass(hat === "santaHat"))}>
          <image href={santaHat} x={-34.2} y={-17.33} width={68.4} height={34.66} />
        </g>
      </g>
    </svg>
  );
};

// 그라디언트 38개와 이미지 10여 개를 그려서, 같은 화면의 다른 상태가 바뀔 때 다시 그리지 않게 해요.
export default memo(BosalFigure);
