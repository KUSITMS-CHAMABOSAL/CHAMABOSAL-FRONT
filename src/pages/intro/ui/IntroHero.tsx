import { Badge } from "@toss/tds-mobile";

import body from "../assets/bosal_green_body.svg";
import face from "../assets/bosal_green_face.svg";
import hands from "../assets/bosal_green_hands.svg";

/**
 * 원 안의 초록 보살과 떠 있는 배지예요. 시안(폭 375에 원 253)과 같은 비율로 화면 폭을 따라 커져요.
 * 보살은 시안의 세 레이어(몸, 손, 얼굴)를 원 크기에 대한 비율 좌표로 겹쳐요.
 * 몸 그림이 원보다 길어서 원 밖으로 나간 아래쪽은 잘려요.
 */
const IntroHero = () => (
  <div className="relative aspect-square w-[67.5%] max-w-[340px]" aria-hidden>
    <div className="relative size-full overflow-hidden rounded-full bg-linear-to-b from-(--adaptiveYellow50) to-(--adaptiveBackground) shadow-[0_0_20px_var(--adaptiveBackground)]">
      <img
        src={body}
        alt=""
        width={126}
        height={199}
        className="absolute top-[25.3%] left-[25.3%] h-auto w-[49.82%] max-w-none"
      />
      <img
        src={face}
        alt=""
        width={64}
        height={48}
        className="absolute top-[50.78%] left-[37.79%] h-auto w-[25.48%] max-w-none"
      />
      <img
        src={hands}
        alt=""
        width={103}
        height={58}
        className="absolute top-[69.65%] left-[30.01%] h-auto w-[40.68%] max-w-none"
      />
    </div>
    {/* 🔖 시안과 같은 TDS xsmall 배지(10px)예요. 검수 기준(11px 이상)에 걸리는지 확인이 필요해요. */}
    <Badge
      size="xsmall"
      variant="weak"
      color="green"
      className="absolute! top-[17.39%] -left-[3.16%]"
    >
      배달 참기
    </Badge>
    <Badge
      size="xsmall"
      variant="weak"
      color="green"
      className="absolute! top-[67.59%] left-[86.17%]"
    >
      +10석
    </Badge>
  </div>
);

export default IntroHero;
