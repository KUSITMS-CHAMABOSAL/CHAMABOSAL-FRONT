import { SkeletonBlock } from "@/shared/ui";

/**
 * 인증 캘린더를 받는 동안이에요. 제목, 범례, 캘린더 카드 자리를 회색으로 비워 둬요.
 * 크기는 실제 화면에서 잰 값이에요. 카드는 항상 6주를 그려서 높이(326px)가 달마다 같아요.
 */
const CalendarSkeleton = () => (
  <section className="pt-3">
    <div className="flex h-11 items-center px-6">
      <SkeletonBlock className="h-5 w-[73px] rounded-md" />
    </div>
    <div className="mt-2.75 flex h-[19.5px] items-center gap-2.75 px-5">
      <SkeletonBlock className="h-4 w-[71px] rounded-md" />
      <SkeletonBlock className="h-4 w-[86px] rounded-md" />
    </div>
    <SkeletonBlock className="mx-5 mt-2.75 mb-4.75 h-[326px] rounded-xl" />
  </section>
);

export default CalendarSkeleton;
