import { Paragraph } from "@toss/tds-mobile";

import { MAX_MEMBERS } from "@/entities/room";
import { SkeletonBlock } from "@/shared/ui";

/** 오늘의 보살을 받는 동안이에요. 같은 제목과 첫 장(4칸 격자) 틀에 보살 카드 자리만 비워 둬요. */
const TodayBosalsSkeleton = () => (
  <section className="flex flex-col gap-1.5 pb-9">
    <div className="flex flex-col gap-2.5 px-5 py-5">
      <Paragraph typography="t6" fontWeight="semibold" color="var(--adaptiveGreyOpacity800)">
        오늘의 보살들
      </Paragraph>
      <Paragraph typography="t7" fontWeight="semibold" color="var(--adaptiveGrey400)">
        화면을 넘겨 인증을 확인해요.
      </Paragraph>
    </div>
    <div className="flex justify-center">
      <div className="grid w-[296px] grid-cols-2 gap-2.5">
        {Array.from({ length: MAX_MEMBERS }, (_, index) => (
          <SkeletonBlock key={index} className="h-[213px] rounded-lg" />
        ))}
      </div>
    </div>
  </section>
);

export default TodayBosalsSkeleton;
