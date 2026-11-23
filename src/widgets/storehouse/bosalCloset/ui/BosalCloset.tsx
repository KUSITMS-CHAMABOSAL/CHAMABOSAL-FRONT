import { useMemo, useRef, useState } from "react";

import { Button, Paragraph, SegmentedControl } from "@toss/tds-mobile";

import { BosalFigure, isItemCode } from "@/entities/bosal";
import { ItemCard, ShieldImage, type StoreItem, useStoreQuery } from "@/entities/item";
import { type MyRoom, useMeQuery } from "@/entities/session";
import {
  EquipItemButton,
  getWornItems,
  type Outfit,
  useOutfit,
} from "@/features/storehouse/equipItem";
import { useHairPlanting } from "@/features/storehouse/plantHair";
import { cn, useTabBarToast } from "@/shared/lib";

import {
  CLOSET_TABS,
  type ClosetItem,
  type ClosetTab,
  DEMO_SHIELD,
  EXPRESSION_ITEMS,
  SLOT_TAB,
} from "../config/closetItems";
import HairPlantCard from "./HairPlantCard";
import OutfitSlots from "./OutfitSlots";

interface BosalClosetProps {
  /** 나발 심기 화면으로 가요. */
  onPlantHair: () => void;
  /** 나발 빠짐 설명을 다시 봐요. */
  onHairGuide: () => void;
}

const isWorn = (item: ClosetItem, outfit: Outfit) => {
  switch (item.kind) {
    case "item":
      return outfit.items[item.slot] === item.code;
    case "expression":
      return outfit.expression === item.expression;
    case "shield":
      return false;
  }
};

const tabOf = (item: ClosetItem): ClosetTab => {
  switch (item.kind) {
    case "item":
      return SLOT_TAB[item.slot];
    case "expression":
      return "expression";
    case "shield":
      return "all";
  }
};

/** 곳간 아이템이에요. 그림이 없는 코드는 빼요. */
const toClosetItems = (items: StoreItem[]) =>
  items.flatMap(({ itemId, code, name, price, slot, isOwned }) =>
    isItemCode(code)
      ? [{ kind: "item", id: code, itemId, name, price, code, slot, isOwned } as const]
      : [],
  );

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

/** 곳간 조회와 내 정보를 받은 뒤 그려요. 처음 착용 상태를 서버 값으로 시작하려고 기다려요. */
const BosalCloset = (props: BosalClosetProps) => {
  const store = useStoreQuery();
  const me = useMeQuery();
  if (store.error) throw store.error;
  if (me.error) throw me.error;
  // 보살 색과 닉네임은 방마다 달라요. 곳간은 방 밖이라 첫 번째 방의 내 보살로 보여줘요.
  const myRoom = me.data?.rooms[0];
  if (!store.data || !myRoom) return null;
  return <Closet {...props} storeItems={store.data.items} myRoom={myRoom} />;
};

interface ClosetProps extends BosalClosetProps {
  storeItems: StoreItem[];
  myRoom: MyRoom;
}

const Closet = ({ onPlantHair, onHairGuide, storeItems, myRoom }: ClosetProps) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<ClosetTab>("all");
  const closetItems = useMemo(
    () => [DEMO_SHIELD, ...toClosetItems(storeItems), ...EXPRESSION_ITEMS],
    [storeItems],
  );
  const { outfit, toggleItem, toggleExpression } = useOutfit(
    toClosetItems(storeItems.filter(item => item.isEquipped)),
  );
  const wornItems = getWornItems(outfit);
  const { plucked, rice } = useHairPlanting();
  const openToast = useTabBarToast();
  const gridRef = useRef<HTMLDivElement>(null);
  const playStage = (keyframes: Keyframe[], duration: number) => {
    if (prefersReducedMotion()) return;
    stageRef.current?.animate(keyframes, { duration, easing: "ease-out" });
  };

  const toggle = (item: ClosetItem) => {
    if (item.kind === "item") toggleItem(item);
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

  const wornNames = closetItems.filter(item => isWorn(item, outfit)).map(item => item.name);

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
              color={myRoom.color}
              expression={outfit.expression}
              items={wornItems}
              pluckedHairs={plucked}
            />
          </div>
          <div className="absolute top-0 right-0">
            <OutfitSlots outfit={outfit} onSelect={changeTab} />
          </div>
          <div className="absolute inset-x-0 top-[155px] flex flex-col items-center gap-0.5">
            <Paragraph typography="t5" fontWeight="bold" color="var(--adaptiveGrey900)">
              {`${myRoom.nickname}보살`}
            </Paragraph>
            <Paragraph typography="t6" fontWeight="semibold" color="var(--adaptiveGrey600)">
              {wornNames.length > 0 ? `${wornNames.join(", ")} 착용 중` : "아이템 미착용"}
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
            <HairPlantCard onPlant={onPlantHair} onGuide={onHairGuide} />
          </div>
          {closetItems.map(item => (
            <div key={item.id} className={cn(tab !== "all" && tabOf(item) !== tab && "hidden")}>
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
                  ) : item.kind === "expression" || item.isOwned ? (
                    "보유 중"
                  ) : null
                }
                thumbnail={
                  item.kind === "shield" ? (
                    <div className="mt-1">
                      <ShieldImage />
                    </div>
                  ) : (
                    <BosalFigure
                      dimmed
                      color={myRoom.color}
                      className="mt-3 h-[107px] w-[68px]"
                      items={item.kind === "item" ? [item.code] : undefined}
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
