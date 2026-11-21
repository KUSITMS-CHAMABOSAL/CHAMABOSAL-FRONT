import { Paragraph } from "@toss/tds-mobile";

import BosalSilhouette from "./BosalSilhouette";

/** 정원 안이지만 아직 친구가 들어오지 않은 격자 칸이에요. */
const EmptyBosalCard = () => (
  <div className="relative h-[213px] w-full overflow-hidden rounded-lg border border-dashed border-(--adaptiveGrey300) bg-(--adaptiveGrey100) text-center">
    <div className="absolute top-9 left-7">
      <BosalSilhouette />
    </div>
    <Paragraph
      typography="t7"
      fontWeight="medium"
      color="var(--adaptiveGrey900)"
      className="absolute inset-x-0 top-[181px] truncate px-2 text-center"
    >
      초대받은 중생
    </Paragraph>
  </div>
);

export default EmptyBosalCard;
