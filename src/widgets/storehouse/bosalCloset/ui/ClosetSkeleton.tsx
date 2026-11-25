import { Paragraph } from "@toss/tds-mobile";

import { SkeletonBlock } from "@/shared/ui";

/** 첫 화면에 보이는 카드 두 줄이에요. 카드 높이(211px)는 카드 목록의 contain-intrinsic-size와 같아요. */
const CARD_SLOTS = 4;

/** 곳간을 받는 동안이에요. 곳간과 같은 틀에 보살, 착용 칸, 이름, 공양미, 탭, 카드 자리만 비워 둬요. */
const ClosetSkeleton = () => (
  <div className="min-h-svh bg-(--adaptiveBackground)">
    <section className="bg-(--adaptiveGrey50) px-5 pt-5 pb-4">
      <div className="relative mx-auto h-[199px] max-w-[295px]">
        <SkeletonBlock className="absolute top-[18px] left-1/2 h-[119px] w-[76px] -translate-x-1/2 rounded-t-full rounded-b-3xl" />
        <div className="absolute top-0 right-0 flex w-12 flex-col gap-1">
          {Array.from({ length: 3 }, (_, index) => (
            <SkeletonBlock key={index} className="size-12 rounded-[14px]" />
          ))}
        </div>
        <div className="absolute inset-x-0 top-[155px] flex flex-col items-center gap-1.5">
          <SkeletonBlock className="h-5 w-24 rounded-md" />
          <SkeletonBlock className="h-4 w-20 rounded-md" />
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between rounded-[14px] bg-(--adaptiveBlue50) px-3 py-2">
        <Paragraph typography="t7" fontWeight="medium" color="var(--adaptiveGrey900)">
          내 공양미
        </Paragraph>
        <SkeletonBlock className="h-5 w-10 rounded-md" />
      </div>
    </section>

    <section className="flex flex-col gap-3 py-3">
      <SkeletonBlock className="mx-6 h-9 rounded-xl" />
      <div className="grid grid-cols-2 gap-3.5 px-5">
        {Array.from({ length: CARD_SLOTS }, (_, index) => (
          <SkeletonBlock key={index} className="h-[211px] rounded-[10px]" />
        ))}
      </div>
    </section>
  </div>
);

export default ClosetSkeleton;
