import { Paragraph } from "@toss/tds-mobile";

import { BosalImage, type BosalColor } from "@/entities/bosal";
import { TwirlyFlower } from "@/shared/assets/illustrations";
import { cn } from "@/shared/lib";

import { PROFILE_GRADIENT } from "../config/profileBackground";

/** 시안의 보살 높이예요. 원본(139)보다 작게 그려요. */
const ART_HEIGHT = 119;

interface BosalProfileProps {
  nickname: string;
  color: BosalColor;
  /** 빠진 나발 번호예요. */
  fallenHairs: readonly number[];
  /** 착용한 아이템 코드예요. 착용은 사용자 단위라 모든 방에 같아요. */
  items: readonly string[];
}

/** 내 보살 카드예요. 이 방에서 쓰는 닉네임과 보살 색을 보여줘요. */
const BosalProfile = ({ nickname, color, fallenHairs, items }: BosalProfileProps) => (
  <div
    className={cn(
      "relative flex h-[211px] flex-col items-center overflow-hidden rounded-sm bg-linear-to-b from-(--adaptiveBackground) pt-4.25",
      PROFILE_GRADIENT[color],
    )}
  >
    <TwirlyFlower
      aria-hidden
      className="text-on-fill/30 pointer-events-none absolute top-12 left-px"
    />
    <BosalImage
      color={color}
      expression="default"
      fallenHairs={fallenHairs}
      items={items}
      height={ART_HEIGHT}
      className="relative"
    />
    <div className="relative mt-2 flex w-42 flex-col items-center gap-1.5 text-center">
      <Paragraph typography="t5" fontWeight="bold" color="var(--adaptiveGrey900)">
        {`${nickname}보살`}
      </Paragraph>
      {/* 🔖 오늘 인증 상태에 따라 바뀌는 문구인지 디자이너 확인이 필요해요. */}
      <Paragraph typography="t6" fontWeight="semibold" color="var(--adaptiveGrey700)">
        오늘도 맑은 마음이에요.
      </Paragraph>
    </div>
  </div>
);

export default BosalProfile;
