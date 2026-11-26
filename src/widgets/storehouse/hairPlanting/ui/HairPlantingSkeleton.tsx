import { Paragraph } from "@toss/tds-mobile";

import { BosalGreyFigure } from "@/entities/bosal";
import { SkeletonBlock } from "@/shared/ui";

/** 빠진 나발을 아직 몰라서 나발이 다 있는 보살로 그려요. */
const NO_PLUCKED: ReadonlySet<number> = new Set();

/**
 * 나발 심기에 필요한 값(빠진 나발, 공양미)을 받는 동안이에요.
 * 나발 심기와 같은 틀에 문구와 회색 보살은 그대로 두고, 공양미와 빈자리 수만 비워 둬요.
 */
const HairPlantingSkeleton = () => (
  <main className="fixed inset-0 z-20 flex touch-none flex-col overflow-hidden bg-(--adaptiveGrey900)">
    <header className="flex flex-col items-center gap-[13px] px-[43px] pt-8 opacity-50">
      <Paragraph typography="st12" color="var(--color-on-fill-opacity-60)" className="text-center!">
        모든 설정은 절약에 재미를 더하기 위한 창작적 표현이에요
      </Paragraph>
      <Paragraph
        typography="st5"
        fontWeight="bold"
        color="var(--color-on-fill)"
        className="text-center!"
      >
        나발을 심을
        <br />
        자리를 선택해주세요
      </Paragraph>
      <div className="bg-on-fill-opacity-10 flex h-[39px] w-full items-center justify-between rounded-[14px] px-3">
        <Paragraph typography="t7" fontWeight="medium" color="var(--color-on-fill)">
          내 공양미
        </Paragraph>
        <SkeletonBlock tone="dark" className="h-5 w-10 rounded-md" />
      </div>
      <SkeletonBlock tone="dark" className="h-5 w-28 rounded-md" />
    </header>

    <div className="flex min-h-0 flex-1 flex-col justify-end-safe px-3.5 pt-[31.5px]">
      <div className="relative mx-auto -mb-[73px] w-full max-w-[346px] shrink-0 opacity-50">
        <BosalGreyFigure pluckedHairs={NO_PLUCKED} className="block w-full" />
      </div>
    </div>
  </main>
);

export default HairPlantingSkeleton;
