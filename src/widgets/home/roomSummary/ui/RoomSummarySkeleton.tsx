import { Paragraph, Top } from "@toss/tds-mobile";

import { SkeletonBlock } from "@/shared/ui";

/**
 * 방 요약을 받는 동안이에요. 같은 Top과 공양미 한 솥 틀에 방 이름, 함께한 날, 공양미, 진행 바, 보너스 자리만 비워 둬요.
 * 방 탭은 방이 두 개 이상일 때만 있어서 그리지 않아요.
 */
const RoomSummarySkeleton = () => (
  <section>
    <Top
      lowerGap={16}
      title={<SkeletonBlock className="h-[37px] w-40 rounded-md" />}
      subtitleTop={
        <Top.SubtitleParagraph typography="t7" color="var(--adaptiveGreyOpacity700)">
          오늘도 함께 참는 중
        </Top.SubtitleParagraph>
      }
      // Top.RightButton은 오른쪽 여백을 스스로 둬서 블록에도 같은 여백을 줘요.
      right={<SkeletonBlock className="mr-6 h-8 w-[57px] rounded-lg" />}
    />
    <div className="flex flex-col px-6 pt-5 pb-[19px]">
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between">
          <Paragraph typography="t7" fontWeight="semibold" color="var(--adaptiveGrey600)">
            공양미 한 솥
          </Paragraph>
          <SkeletonBlock className="h-4 w-24 rounded-md" />
        </div>
        <SkeletonBlock className="h-8 w-32 rounded-md" />
      </div>
      <div className="relative mt-[3px] h-[34px]">
        <SkeletonBlock className="absolute inset-x-0 top-[29px] h-[5px] rounded-full" />
      </div>
      <div className="mt-1.5 flex justify-end">
        <SkeletonBlock className="h-4 w-32 rounded-md" />
      </div>
    </div>
  </section>
);

export default RoomSummarySkeleton;
