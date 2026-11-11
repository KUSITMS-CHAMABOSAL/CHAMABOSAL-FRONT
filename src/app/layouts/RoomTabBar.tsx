import type { CSSProperties } from "react";
import { Paragraph } from "@toss/tds-mobile";

import { BallotBoxIcon, BosalIcon, HomeIcon, StorehouseIcon } from "@/shared/assets/icons";
import { useSafeAreaBottom } from "@/shared/lib/appsInToss";
import { cn } from "@/shared/lib";

export type RoomTab = "home" | "vote" | "storehouse" | "my";

const TABS = [
  { key: "home", label: "홈", Icon: HomeIcon },
  { key: "vote", label: "투표", Icon: BallotBoxIcon },
  { key: "storehouse", label: "곳간", Icon: StorehouseIcon },
  { key: "my", label: "내 보살", Icon: BosalIcon },
] as const;

interface RoomTabBarProps {
  activeTab?: RoomTab;
  updatedTabs?: readonly RoomTab[];
  onTabClick?: (tab: RoomTab) => void;
}

// 앱인토스 가이드의 플로팅 탭바 형태입니다. 화면 아래에 고정되고, 같은 높이의 빈 공간을 남겨 내용을 가리지 않습니다.
const RoomTabBar = ({ activeTab, updatedTabs = [], onTabClick }: RoomTabBarProps) => {
  const safeAreaBottom = useSafeAreaBottom();
  const style = { "--safe-area-bottom": `${safeAreaBottom}px` } as CSSProperties;

  return (
    <div style={style}>
      {/* 위 여백 16 + 바 59 */}
      <div aria-hidden className="h-[calc(75px+var(--safe-area-bottom))]" />
      <nav
        aria-label="방 메뉴"
        className="fixed inset-x-0 bottom-0 z-10 px-6 pt-4 pb-(--safe-area-bottom)"
      >
        <div className="flex items-center justify-center gap-3 rounded-full bg-(--adaptiveBackground) px-4.5 py-2 shadow-[0_2px_30px_var(--adaptiveGreyOpacity200)]">
          {TABS.map(({ key, label, Icon }) => {
            const isActive = key === activeTab;
            const isUpdated = updatedTabs.includes(key);

            return (
              <button
                key={key}
                type="button"
                aria-current={isActive ? "page" : undefined}
                aria-label={isUpdated ? `${label}, 새 소식 있음` : label}
                onClick={() => onTabClick?.(key)}
                className="flex h-[43px] w-15 appearance-none flex-col items-center gap-0.5 border-0 bg-transparent p-0"
              >
                <span className="relative">
                  <Icon
                    aria-hidden
                    className={cn(
                      "block size-6",
                      isActive
                        ? "text-(color:--adaptiveGreyOpacity800)"
                        : "text-(color:--adaptiveGreyOpacity300)",
                    )}
                  />
                  {isUpdated && (
                    <span className="absolute top-0 left-full size-1.25 rounded-full bg-(--adaptiveRed500)" />
                  )}
                </span>
                <Paragraph
                  typography="st13"
                  fontWeight="medium"
                  textAlign="center"
                  ellipsisAfterLines={1}
                  color={
                    isActive ? "var(--adaptiveGreyOpacity800)" : "var(--adaptiveGreyOpacity500)"
                  }
                  className="w-full"
                >
                  <Paragraph.Text className="leading-[1.2]!">{label}</Paragraph.Text>
                </Paragraph>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default RoomTabBar;
