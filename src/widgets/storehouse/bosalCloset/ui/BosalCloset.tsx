import { useRef, useState } from "react";

import { Button, Paragraph, SegmentedControl } from "@toss/tds-mobile";

import { BosalFigure } from "@/entities/bosal";
import { ItemCard, ShieldImage } from "@/entities/item";
import { EquipItemButton, type Outfit, useOutfit } from "@/features/storehouse/equipItem";
import { useHairPlanting } from "@/features/storehouse/plantHair";
import { cn, useTabBarToast } from "@/shared/lib";

import {
  CLOSET_TABS,
  type ClosetItem,
  type ClosetTab,
  DEMO_BOSAL_NAME,
  DEMO_ITEMS,
  ITEM_TAB,
} from "../config/demoItems";
import HairPlantCard from "./HairPlantCard";
import OutfitSlots from "./OutfitSlots";

interface BosalClosetProps {
  /** 나발 심기 화면으로 가요. */
  onPlantHair: () => void;
}

const isWorn = (item: ClosetItem, outfit: Outfit) => {
  switch (item.kind) {
    case "hat":
      return outfit.hat === item.hat;
    case "faceItem":
      return outfit.faceItem === item.faceItem;
    case "expression":
      return outfit.expression === item.expression;
    case "shield":
      return false;
  }
};

const wornSummary = (outfit: Outfit) => {
  const names = DEMO_ITEMS.filter(item => isWorn(item, outfit)).map(item => item.name);
  return names.length > 0 ? `${names.join(", ")} 착용 중` : "아이템 미착용";
};

// 착용이 바뀌면 보살이 살짝 눌렸다 튀어 올라요. 감싼 div에 걸어 GPU 합성만 일어나게 해요.
const SQUASH: Keyframe[] = [
  { transform: "scale(1, 1)" },
  { transform: "scale(1.06, 0.94)", offset: 0.35 },
  { transform: "scale(0.98, 1.03)", offset: 0.7 },
  { transform: "scale(1, 1)" },
];
const LIST_IN: Keyframe[] = [
  { transform: "translateY(8px)", opacity: 0 },
  { transform: "translateY(0)", opacity: 1 },
];

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const isVisible = (item: ClosetItem, tab: ClosetTab) =>
  tab === "all" || ITEM_TAB[item.kind] === tab;

const BosalCloset = ({ onPlantHair }: BosalClosetProps) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<ClosetTab>("all");
  const { outfit, toggleHat, toggleFaceItem, toggleExpression } = useOutfit();
  const { plucked, rice } = useHairPlanting();
  const openToast = useTabBarToast();
  const gridRef = useRef<HTMLDivElement>(null);

  const playStage = (keyframes: Keyframe[], duration: number) => {
    if (prefersReducedMotion()) return;
    stageRef.current?.animate(keyframes, { duration, easing: "ease-out" });
  };

  const toggle = (item: ClosetItem) => {
    if (item.kind === "hat") toggleHat(item.hat);
    if (item.kind === "faceItem") toggleFaceItem(item.faceItem);
    if (item.kind === "expression") toggleExpression(item.expression);
    // 착용을 바꾼 순간에만 눌렸다 튀어요. effect로 걸면 StrictMode의 마운트 재실행에서도 재생돼요.
    playStage(SQUASH, 380);
  };

  const changeTab = (next: ClosetTab) => {
    setTab(next);
    if (!prefersReducedMotion()) {
      gridRef.current?.animate(LIST_IN, { duration: 240, easing: "ease-out" });
    }
  };

  return (
    <div className="min-h-svh bg-(--adaptiveBackground)">
      <section className="bg-(--adaptiveGrey50) px-5 pt-5 pb-4">
        <div className="relative mx-auto h-[199px] max-w-[295px]">
          <div
            ref={stageRef}
            className="absolute top-[18px] left-1/2 z-10 origin-bottom -translate-x-1/2"
          >
            <BosalFigure
              className="h-[119px] w-[76px]"
              expression={outfit.expression}
              hat={outfit.hat}
              faceItem={outfit.faceItem}
              pluckedHairs={plucked}
            />
          </div>
          <div className="absolute top-0 right-0">
            <OutfitSlots outfit={outfit} onSelect={changeTab} />
          </div>
          <div className="absolute inset-x-0 top-[155px] flex flex-col items-center gap-0.5">
            <Paragraph typography="t5" fontWeight="bold" color="var(--adaptiveGrey900)">
              {DEMO_BOSAL_NAME}
            </Paragraph>
            <Paragraph typography="t6" fontWeight="semibold" color="var(--adaptiveGrey600)">
              {wornSummary(outfit)}
            </Paragraph>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between rounded-[14px] bg-(--adaptiveBlue50) px-3 py-2">
          <Paragraph typography="t7" fontWeight="medium" color="var(--adaptiveGrey900)">
            내 공양미
          </Paragraph>
          <Paragraph typography="t5" fontWeight="semibold" color="var(--adaptiveBlue600)">
            {`${rice}석`}
          </Paragraph>
        </div>
      </section>

      <section className="flex flex-col gap-3 py-3">
        <div className="px-6">
          <SegmentedControl value={tab} onChange={value => changeTab(value as ClosetTab)}>
            {CLOSET_TABS.map(({ value, label }) => (
              <SegmentedControl.Item key={value} value={value}>
                {label}
              </SegmentedControl.Item>
            ))}
          </SegmentedControl>
        </div>

        {/* 탭마다 카드를 새로 마운트하면 저사양 기기에서 프레임이 튀어서, 모두 마운트해 두고 숨김만 바꿔요. */}
        <div ref={gridRef} className="grid grid-cols-2 gap-3.5 px-5">
          <div className={cn(tab !== "all" && "hidden")}>
            <HairPlantCard onPlant={onPlantHair} />
          </div>
          {DEMO_ITEMS.map(item => (
            <div key={item.id} className={cn(!isVisible(item, tab) && "hidden")}>
              <ItemCard
                name={item.name}
                price={item.kind === "expression" ? undefined : item.price}
                status={
                  item.kind === "shield" ? (
                    <>
                      보유{" "}
                      <Paragraph.Text
                        typography="t7"
                        fontWeight="semibold"
                        color="var(--adaptiveBlue600)"
                      >
                        {item.owned}
                      </Paragraph.Text>
                      개
                    </>
                  ) : (
                    "보유 중"
                  )
                }
                thumbnail={
                  item.kind === "shield" ? (
                    <div className="mt-1">
                      <ShieldImage />
                    </div>
                  ) : (
                    <BosalFigure
                      dimmed
                      className="mt-3 h-[107px] w-[68px]"
                      hat={item.kind === "hat" ? item.hat : null}
                      faceItem={item.kind === "faceItem" ? item.faceItem : null}
                      expression={item.kind === "expression" ? item.expression : "default"}
                    />
                  )
                }
                action={
                  item.kind === "shield" ? (
                    <Button
                      size="small"
                      display="full"
                      variant="weak"
                      onClick={() => openToast("데모에서는 구매할 수 없어요")}
                    >
                      구매하기
                    </Button>
                  ) : (
                    <EquipItemButton worn={isWorn(item, outfit)} onClick={() => toggle(item)} />
                  )
                }
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BosalCloset;
