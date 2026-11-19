import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

import grain1 from "../assets/grain_1.svg";
import grain2 from "../assets/grain_2.svg";
import grain3 from "../assets/grain_3.svg";
import grain4 from "../assets/grain_4.svg";
import grain5 from "../assets/grain_5.svg";
import grain6 from "../assets/grain_6.svg";
import grain7 from "../assets/grain_7.svg";
import ricePile from "../assets/rice_pile.svg";
import {
  PILE_START_SCALE,
  RICE_DROP_COUNT,
  RICE_DROP_INTERVAL_MS,
  RICE_FALL_MS,
  RICE_MERGE_MS,
} from "../config/motion";

interface RiceFallProps {
  /** 마지막 쌀알이 합쳐져 밥더미가 시안 크기가 되면 한 번 불려요. 모션 감소 설정이면 바로 불려요. */
  onSettled: () => void;
}

const GRAINS = [grain1, grain2, grain3, grain4, grain5, grain6, grain7];
const GRAIN_HALF_LENGTH = 15.46;
/** 쌀알이 떨어지기 시작하는 높이예요(`-top-10`). 화면 위 밖에서 시작해요. */
const START_TOP_PX = -40;
const PILE_HEIGHT = 473.4;
/** 밥더미 이미지 아래 끝이 화면 아래에서 이만큼 더 내려가 있어요(시안 위치). 커지는 축이에요. */
const PILE_BOTTOM_BELOW_PX = 181;
/** 밥더미 가운데가 화면 가운데보다 오른쪽으로 치우친 정도예요. */
const PILE_CENTER_OFFSET_PX = 1.5;
/** 밥더미 윗면 곡선이에요. 시안 크기에서 가운데로부터 dx만큼 떨어지면 0.0025·dx²만큼 낮아요(시안 이미지에서 잰 값). */
const surfaceDrop = (dx: number) => 0.0025 * dx * dx;
/** 쌀알이 밥더미 윤곽 안으로 묻히는 깊이예요. */
const SINK_PX = 6;
/** 시안 쌀알처럼 가운데 근처에서 엇갈려 떨어지는 x(px)예요. */
const DROP_X = [
  -6, 9, -14, 3, 15, -3, -18, 11, -9, 6, 19, -12, 1, -16, 13, -5, 8, -20, 16, -1, -11, 5, 18, -8,
];

/** 쌓인 알 수에 따른 밥더미 크기예요. 마지막 알이 합쳐지면 시안 크기(1)가 돼요. */
const pileScale = (landed: number) =>
  PILE_START_SCALE + ((1 - PILE_START_SCALE) * landed) / RICE_DROP_COUNT;

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * 쌀알이 위에서 하나씩 떨어져 밥더미에 묻히듯 합쳐지고, 그때마다 밥더미가 아래를 축으로 조금씩 커져요.
 * 처음부터 꽉 찬 반원이 아니라 쌓이면서 부풀어 시안 크기가 돼요. 한 번만 재생해요.
 *
 * 쌀알은 Web Animations API로 움직여요. 닿을 높이가 기기 높이와 그 순간의 밥더미 크기에 따라 달라 실행 시점에 계산해요.
 * 밥더미가 커지는 건 합쳐진 개수에 따른 CSS transition이라 연달아 닿아도 끊기지 않고 이어져요.
 */
const RiceFall = ({ onSettled }: RiceFallProps) => {
  const [landed, setLanded] = useState(0);
  const layerRef = useRef<HTMLDivElement>(null);
  const onSettledRef = useRef(onSettled);

  useEffect(() => {
    onSettledRef.current = onSettled;
  });

  useEffect(() => {
    if (landed === RICE_DROP_COUNT) onSettledRef.current();
  }, [landed]);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || prefersReducedMotion()) {
      setLanded(RICE_DROP_COUNT);
      return;
    }

    const pileBottom = layer.getBoundingClientRect().height + PILE_BOTTOM_BELOW_PX;
    const grains = [...layer.querySelectorAll<HTMLElement>("[data-grain]")];
    const animations: Animation[] = [];

    grains.forEach((grain, index) => {
      const x = DROP_X[index % DROP_X.length];
      // 이 알이 닿을 때의 밥더미 크기로 윗면 높이를 구해요.
      const scale = pileScale(index);
      const surface =
        pileBottom - PILE_HEIGHT * scale + surfaceDrop((x - PILE_CENTER_OFFSET_PX) / scale) * scale;
      const distance = surface + SINK_PX - GRAIN_HALF_LENGTH - (START_TOP_PX + GRAIN_HALF_LENGTH);
      const rotate = (index * 47) % 180;
      const landedAt = `translate(${x}px, ${distance}px) rotate(${rotate + 70}deg)`;

      const fall = grain.animate(
        [
          { transform: `translate(${x}px, 0) rotate(${rotate}deg)`, opacity: 1 },
          { transform: landedAt, opacity: 1 },
        ],
        {
          duration: RICE_FALL_MS,
          delay: index * RICE_DROP_INTERVAL_MS,
          // 처음엔 천천히, 갈수록 빨라지는 중력 느낌이에요.
          easing: "cubic-bezier(0.55, 0, 0.85, 0.4)",
          fill: "both",
        },
      );
      animations.push(fall);

      fall.finished
        .then(() => {
          setLanded(prev => prev + 1);
          // 닿으며 눌렸다가 밥더미 속으로 묻혀요. 같은 순간 밥더미가 한 칸 커져 감싸요.
          const merge = grain.animate(
            [
              { transform: `${landedAt} scale(1, 1)`, opacity: 1 },
              { transform: `${landedAt} scale(1.15, 0.7)`, opacity: 1, offset: 0.3 },
              {
                transform: `translate(${x}px, ${distance + 10}px) rotate(${rotate + 80}deg) scale(0.9, 0.6)`,
                opacity: 0,
              },
            ],
            { duration: RICE_MERGE_MS, easing: "ease-out", fill: "forwards" },
          );
          animations.push(merge);
          fall.cancel();
          // 다 묻힌 알은 기본 상태(opacity 0)로 돌려 합성 레이어를 놓아줘요.
          return merge.finished.then(() => merge.cancel());
        })
        // 화면을 벗어나 취소되면 finished가 거부돼요. 할 일이 없어요.
        .catch(() => {});
    });

    return () => animations.forEach(animation => animation.cancel());
  }, []);

  return (
    <div ref={layerRef} className="pointer-events-none absolute inset-0">
      {/* 아래 끝을 축으로 커져요. 다 커지면 시안의 밥더미 위치와 크기 그대로예요. */}
      <div className="absolute -bottom-[181px] left-[calc(50%+1.5px)] -translate-x-1/2">
        <div
          className="origin-bottom [transform:scale(var(--grow))] transition-transform duration-300 ease-out motion-reduce:transition-none"
          style={{ "--grow": pileScale(landed) } as CSSProperties}
        >
          <img
            src={ricePile}
            alt=""
            width={500.4}
            height={PILE_HEIGHT}
            className="block max-w-none select-none"
          />
        </div>
      </div>
      {Array.from({ length: RICE_DROP_COUNT }, (_, index) => (
        <img
          key={index}
          data-grain
          src={GRAINS[index % GRAINS.length]}
          alt=""
          width={17.67}
          height={30.92}
          className="absolute -top-10 left-[calc(50%-8.83px)] max-w-none opacity-0 select-none"
        />
      ))}
    </div>
  );
};

export default RiceFall;
