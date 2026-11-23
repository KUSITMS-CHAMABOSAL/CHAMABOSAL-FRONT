import type { CSSProperties } from "react";

import { Paragraph } from "@toss/tds-mobile";

import { ITEM_ART, type ItemCode } from "@/entities/bosal";
import type { Outfit } from "@/features/storehouse/equipItem";
import { cn } from "@/shared/lib";

import { PlusIcon } from "../assets";
import type { ClosetTab } from "../config/closetItems";

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

/** 슬롯 칸(48px) 안에 아이템 그림을 비율대로 줄여 넣어요. */
const SlotItem = ({ code }: { code: ItemCode }) => {
  const { href, rotate } = ITEM_ART[code];
  return (
    <img
      src={href}
      alt=""
      className="max-h-7 max-w-8 rotate-(--item-rotate)"
      style={{ "--item-rotate": `${rotate ?? 0}deg` } as CSSProperties}
    />
  );
};

// 🔖 시안 슬롯은 모자·얼굴·표정 세 칸이에요. 소품(ACCESSORY) 칸은 시안이 없어 두지 않았어요.
/** 위에서부터 모자, 얼굴, 표정 슬롯이에요. 누르면 해당 카테고리 탭으로 이동해요. */
const OutfitSlots = ({ outfit, onSelect }: OutfitSlotsProps) => {
  const slots = [
    {
      tab: "hat",
      label: "모자",
      filled: outfit.items.HAT !== undefined,
      content: outfit.items.HAT && <SlotItem code={outfit.items.HAT} />,
    },
    {
      tab: "face",
      label: "얼굴",
      filled: outfit.items.FACE !== undefined,
      content: outfit.items.FACE && <SlotItem code={outfit.items.FACE} />,
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
