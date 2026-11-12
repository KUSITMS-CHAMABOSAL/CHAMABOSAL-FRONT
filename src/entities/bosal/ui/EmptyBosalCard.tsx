import BosalSilhouette from "./BosalSilhouette";

/** 아직 아무도 들어오지 않은 격자 칸이에요. */
const EmptyBosalCard = () => (
  <div className="relative h-[213px] w-full overflow-hidden rounded-lg border border-dashed border-(--adaptiveGrey300) bg-(--adaptiveGrey100)">
    <div className="absolute top-9 left-7">
      <BosalSilhouette />
    </div>
  </div>
);

export default EmptyBosalCard;
