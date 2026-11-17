import { BosalGreyFigure, GREY_FIGURE } from "@/entities/bosal";

const NO_PLUCKED_HAIRS: ReadonlySet<number> = new Set();

/** 팻말 색은 회색 보살 그림의 피부(#D2D2D2), 그림자(#B3B3B3), 선(#4E5968)과 맞춰요. */
const SIGN = { x: 58, y: 342, width: 230, height: 120 } as const;
const SIGN_CENTER_X = SIGN.x + SIGN.width / 2;
const SIGN_CENTER_Y = SIGN.y + SIGN.height / 2;

/**
 * 회색 보살이 404 팻말을 몸 앞에 들고 있는 그림이에요.
 * 🔖 시안이 없어 기존 회색 보살 위에 팻말과 손을 코드로 겹쳤어요. 시안이 오면 이미지 한 장으로 바꿔요.
 */
const NotFoundFigure = () => (
  <div className="relative mx-auto w-[180px]" aria-hidden>
    <BosalGreyFigure pluckedHairs={NO_PLUCKED_HAIRS} className="block w-full" />
    <svg
      viewBox={`0 0 ${GREY_FIGURE.width} ${GREY_FIGURE.height}`}
      className="absolute inset-0 size-full"
    >
      {/* 팻말 막대 */}
      <rect
        x={SIGN_CENTER_X - 8}
        y={SIGN.y + SIGN.height - 4}
        width={16}
        height={90}
        rx={6}
        fill="#B3B3B3"
      />
      <rect {...SIGN} rx={18} fill="#FFFFFF" stroke="#B3B3B3" strokeWidth={6} />
      <text
        x={SIGN_CENTER_X}
        y={SIGN_CENTER_Y}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={68}
        fontWeight={700}
        fill="#4E5968"
      >
        404
      </text>
      {/* 팻말 양쪽을 잡은 손 */}
      {[SIGN.x, SIGN.x + SIGN.width].map(cx => (
        <circle
          key={cx}
          cx={cx}
          cy={SIGN_CENTER_Y}
          r={24}
          fill="#D2D2D2"
          stroke="#B3B3B3"
          strokeWidth={4}
        />
      ))}
    </svg>
  </div>
);

export default NotFoundFigure;
