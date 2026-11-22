import { BottomCTA, Paragraph } from "@toss/tds-mobile";

import { BOSAL_COLOR_NAME, BosalImage, type BosalColor } from "@/entities/bosal";
import { TwirlyFlower } from "@/shared/assets/illustrations";
import { cn } from "@/shared/lib";

import {
  RECEIVE_BACKGROUND,
  RECEIVE_BOTTOM_FLOWER,
  RECEIVE_TOP_FLOWER,
} from "../config/receiveBosal";

/** 시안의 보살 높이예요. 원본(139)을 약 2.15배로 키워요. */
const ART_HEIGHT = 298.5;

interface ReceiveBosalProps {
  nickname: string;
  color: BosalColor;
  /** 다음 단계를 정하는 중이에요. 버튼이 로딩으로 기다려요. */
  isPending?: boolean;
  onReceive: () => void;
}

/** 내 보살 받기 화면이에요. 이 방에서 쓸 닉네임과 보살 색을 보여줘요. */
const ReceiveBosal = ({ nickname, color, isPending = false, onReceive }: ReceiveBosalProps) => (
  <main
    className={cn(
      "flex min-h-svh flex-col items-center overflow-hidden bg-white text-center",
      RECEIVE_BACKGROUND[color],
    )}
  >
    {/* 보살과 문구 묶음을 버튼 위 공간의 가운데에 둬요. 좁은 화면에서도 위 24, 아래 32는 남겨요. */}
    <div aria-hidden className="min-h-6 grow" />
    {/* 꽃은 보살을 기준으로 시안 위치(오른쪽 위, 왼쪽 아래)에 둬요. */}
    <div className="relative">
      <TwirlyFlower
        aria-hidden
        className={cn("pointer-events-none absolute -top-18 left-23", RECEIVE_TOP_FLOWER[color])}
      />
      <TwirlyFlower
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-[221px] -left-19.5",
          RECEIVE_BOTTOM_FLOWER[color],
        )}
      />
      {/* 꽃은 그대로 두고 보살만 위에서 내려오며 나타나요. 화면에 들어올 때 한 번이라 CSS 키프레임으로 충분해요.
          모션 감소 설정이면 바로 끝 화면이에요. */}
      <BosalImage
        color={color}
        expression="default"
        height={ART_HEIGHT}
        className="motion-safe:animate-bosal-arrive relative"
      />
    </div>
    <div className="motion-safe:animate-bosal-arrive-text relative mt-10 flex flex-col items-center gap-4.5 px-5">
      <Paragraph typography="st5" fontWeight="bold" color="var(--adaptiveGrey900)">
        {`${nickname}보살`}
      </Paragraph>
      <Paragraph typography="t6" fontWeight="semibold" color="var(--adaptiveGreyOpacity700)">
        {`${nickname}님에게 ${BOSAL_COLOR_NAME[color]}보살이 찾아왔어요!`}
      </Paragraph>
    </div>
    <div aria-hidden className="min-h-8 grow" />
    {/* 작은 화면에서 버튼이 문구를 가리지 않도록 화면 흐름 안의 맨 아래에 둬요. */}
    <BottomCTA className="w-full" background="none" loading={isPending} onClick={onReceive}>
      내 보살 받기
    </BottomCTA>
  </main>
);

export default ReceiveBosal;
