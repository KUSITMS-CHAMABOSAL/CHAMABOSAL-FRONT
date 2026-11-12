import { Paragraph } from "@toss/tds-mobile";

import { cn } from "@/shared/lib";
import type { Outfit } from "@/features/storehouse/equipItem";

import { PlusIcon } from "../assets";
import rudolphNoseIcon from "../assets/slot_rudolph_nose.svg";
import santaHatIcon from "../assets/slot_santa_hat.svg";
import type { ClosetTab } from "../config/demoItems";

interface OutfitSlotsProps {
  outfit: Outfit;
  onSelect: (tab: ClosetTab) => void;
}

const EXPRESSION_LABEL = {
  default: "",
  patient: "참음",
  failed: "못 참음",
  poked: "찔림",
} as const;

/** 위에서부터 모자, 얼굴, 표정 슬롯이에요. 누르면 해당 카테고리 탭으로 이동해요. */
const OutfitSlots = ({ outfit, onSelect }: OutfitSlotsProps) => {
  const slots = [
    {
      tab: "hat",
      label: "모자",
      filled: outfit.hat !== null,
      content: <img src={santaHatIcon} alt="" className="w-8 rotate-[6.67deg]" />,
    },
    {
      tab: "face",
      label: "얼굴",
      filled: outfit.faceItem !== null,
      content: <img src={rudolphNoseIcon} alt="" className="size-[15px]" />,
    },
    {
      tab: "expression",
      label: "표정",
      filled: outfit.expression !== "default",
      content: (
        <Paragraph typography="st13" fontWeight="semibold" color="var(--adaptiveGrey700)">
          {EXPRESSION_LABEL[outfit.expression]}
        </Paragraph>
      ),
    },
  ] as const;

  return (
    <div className="flex w-12 flex-col gap-1">
      {slots.map(slot => (
        <button
          key={slot.tab}
          type="button"
          aria-label={`${slot.label} ${slot.filled ? "착용 중" : "비어 있음"}`}
          onClick={() => onSelect(slot.tab)}
          className={cn(
            "flex size-12 appearance-none items-center justify-center rounded-[14px] border border-(--adaptiveGreyOpacity200) bg-(--adaptiveBackground) p-0 transition-transform duration-150 active:scale-95",
            !slot.filled && "border-dashed",
          )}
        >
          {slot.filled ? (
            slot.content
          ) : (
            <PlusIcon aria-hidden className="size-5 text-(color:--adaptiveGrey400)" />
          )}
        </button>
      ))}
    </div>
  );
};

export default OutfitSlots;
