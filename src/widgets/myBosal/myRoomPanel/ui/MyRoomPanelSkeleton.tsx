import { Border, Top } from "@toss/tds-mobile";

import { SkeletonBlock } from "@/shared/ui";

import { SettingIcon } from "../assets";

/**
 * 내 보살 위쪽을 받는 동안이에요. 같은 제목과 설정 아이콘은 그대로 두고 방 탭, 보살 카드, 두 버튼 자리만 비워 둬요.
 * 높이는 실제 화면에서 잰 값이에요(탭 36.8px, 카드 211px, 버튼 56px).
 */
const MyRoomPanelSkeleton = () => (
  <section aria-hidden>
    <Top
      lowerGap={22}
      title={
        <Top.TitleParagraph size={28} color="var(--adaptiveGrey900)">
          내 보살
        </Top.TitleParagraph>
      }
      subtitleBottom={
        <Top.SubtitleParagraph typography="t5" fontWeight="regular">
          내 캐릭터와 기록을 확인해요.
        </Top.SubtitleParagraph>
      }
      // 실제 설정 버튼과 같은 자리에 아이콘만 둬요.
      right={
        <span className="-mt-0.75! mr-3.5! flex self-start p-2.5">
          <SettingIcon className="size-6 text-(color:--adaptiveGrey400)" />
        </span>
      }
    />
    <div className="flex h-[36.8px] items-center px-5">
      <SkeletonBlock className="h-5 w-16 rounded-md" />
    </div>
    <Border variant="full" />
    <div className="px-5 pt-4.25">
      <SkeletonBlock className="h-[211px] rounded-sm" />
    </div>
    <div className="flex gap-2.5 px-5 py-4">
      <SkeletonBlock className="h-14 flex-1 rounded-2xl" />
      <SkeletonBlock className="h-14 flex-1 rounded-2xl" />
    </div>
  </section>
);

export default MyRoomPanelSkeleton;
