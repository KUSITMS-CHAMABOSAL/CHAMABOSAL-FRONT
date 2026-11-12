import { Paragraph } from "@toss/tds-mobile";

import { BosalImage, type BosalColor } from "@/entities/bosal";
import { cn } from "@/shared/lib";

import twirlyFlower from "../assets/twirly_flower.svg";
import { PROFILE_GRADIENT } from "../config/profileBackground";

/** 시안의 보살 높이예요. 원본(139)보다 작게 그려요. */
const ART_HEIGHT = 119;

interface BosalProfileProps {
  nickname: string;
  color: BosalColor;
}

/** 내 보살 카드예요. 이 방에서 쓰는 닉네임과 보살 색을 보여줘요. */
const BosalProfile = ({ nickname, color }: BosalProfileProps) => (
  <div
    className={cn(
      "relative flex h-[211px] flex-col items-center overflow-hidden rounded-sm bg-linear-to-b from-(--adaptiveBackground) pt-4.25",
      PROFILE_GRADIENT[color],
    )}
  >
    <img
      src={twirlyFlower}
      alt=""
      width={162}
      height={162}
      className="pointer-events-none absolute top-12 left-px max-w-none select-none"
    />
    <BosalImage color={color} expression="default" height={ART_HEIGHT} className="relative" />
    <div className="relative mt-2 flex w-42 flex-col items-center gap-1.5 text-center">
      <Paragraph typography="t5" fontWeight="bold" color="var(--adaptiveGrey900)">
        {`${nickname}보살`}
      </Paragraph>
      {/* 🔖 오늘 인증 상태에 따라 바뀌는 문구인지 디자이너 확인이 필요해요. */}
      <Paragraph typography="t6" fontWeight="semibold" color="var(--adaptiveGrey600)">
        오늘도 맑은 마음이에요.
      </Paragraph>
    </div>
  </div>
);

export default BosalProfile;
