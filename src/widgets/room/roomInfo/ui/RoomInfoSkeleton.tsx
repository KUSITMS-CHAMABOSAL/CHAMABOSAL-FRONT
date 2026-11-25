import { Paragraph } from "@toss/tds-mobile";

import { MAX_MEMBERS } from "@/entities/room";
import { SkeletonBlock } from "@/shared/ui";

/** 방 정보를 받는 동안이에요. 방 정보와 같은 틀에 방 이름, 보살 줄, 아래 버튼 자리만 비워 둬요. */
const RoomInfoSkeleton = () => (
  <main className="flex min-h-svh flex-col bg-(--adaptiveBackground) pb-16">
    <header className="flex h-11 items-center px-5">
      <SkeletonBlock className="h-6 w-28 rounded-md" />
    </header>

    <Paragraph
      typography="t6"
      fontWeight="semibold"
      color="var(--adaptiveGreyOpacity800)"
      className="mt-4.5 px-5"
    >
      함께하는 보살
    </Paragraph>
    {/* 인원을 모르니 정원만큼 그려요. */}
    <ul role="list" className="m-0! mt-5! p-0!">
      {Array.from({ length: MAX_MEMBERS }, (_, index) => (
        <li
          key={index}
          className="flex h-[85px] list-none items-center gap-4.75 border-0 border-b border-solid border-(--adaptiveGreyOpacity200) pl-5.75"
        >
          <SkeletonBlock className="size-15 shrink-0 rounded-full" />
          <div className="flex items-center gap-[11px]">
            <SkeletonBlock className="h-5 w-[67px] rounded-md" />
            <SkeletonBlock className="h-9 w-16 rounded-md" />
            <SkeletonBlock className="h-9 w-16 rounded-md" />
          </div>
        </li>
      ))}
    </ul>

    <div className="mt-auto flex flex-col gap-3 px-5 pt-16">
      <SkeletonBlock className="h-14 rounded-xl" />
      <SkeletonBlock className="h-14 rounded-xl" />
    </div>
  </main>
);

export default RoomInfoSkeleton;
