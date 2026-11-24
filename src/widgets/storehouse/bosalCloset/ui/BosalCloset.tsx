import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Paragraph, SegmentedControl } from "@toss/tds-mobile";

import { BosalFigure, isItemCode } from "@/entities/bosal";
import { type StoreItem, type StoreResponse, useStoreQuery } from "@/entities/item";
import { type MyRoom, useMeQuery } from "@/entities/session";
import {
  getBuyErrorMessage,
  SHIELD_PRICE,
  useBuyDefenseTicket,
  useBuyItem,
} from "@/features/storehouse/buyItem";
import {
  getWornItems,
  type Outfit,
  useOutfit,
  useSaveEquippedItems,
} from "@/features/storehouse/equipItem";
import { useHairPlanting } from "@/features/storehouse/plantHair";
import { cn, useTabBarToast } from "@/shared/lib";

import { CLOSET_TABS, type ClosetItem, type ClosetTab, SLOT_TAB } from "../config/closetItems";
import ClosetCard from "./ClosetCard";
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
    case "shield":
      return false;
  }
};

const tabOf = (item: ClosetItem): ClosetTab => {
  switch (item.kind) {
    case "item":
      return SLOT_TAB[item.slot];
    case "shield":
      return "all";
  }
};

/** 저장할 착용 아이템 코드예요. 보유 여부는 저장 요청이 나갈 때 걸러요. */
const getWornCodes = (outfit: Outfit, storeItems: StoreItem[]): string[] => [
  ...getWornItems(outfit),
  // 그림이 없는 아이템은 곳간에 보이지 않아 벗을 수 없어요. 같은 슬롯에 다른 아이템을 입었을 때만 바꿔요.
  ...storeItems
    .filter(
      item => item.isEquipped && !isItemCode(item.code) && outfit.items[item.slot] === undefined,
    )
    .map(item => item.code),
];

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

// 화면 밖 카드는 보일 때까지 그리지 않아요. 높이는 카드 높이(약 210px)로 잡아 스크롤바가 튀지 않게 해요.
const CARD_CLASS = "[contain-intrinsic-size:auto_211px] [content-visibility:auto]";

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
  return <Closet {...props} store={store.data} myRoom={myRoom} />;
};

interface ClosetProps extends BosalClosetProps {
  store: StoreResponse;
  myRoom: MyRoom;
}

const Closet = ({ onPlantHair, onHairGuide, store, myRoom }: ClosetProps) => {
  const storeItems = store.items;
  const stageRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<ClosetTab>("all");
  const closetItems = useMemo(
    () => [
      {
        kind: "shield",
        id: "shield",
        name: "이마 방어권",
        price: SHIELD_PRICE,
        // 서버가 개수를 주지 않아 "보유 n개" 대신 보유 중/미보유로만 보여줘요(2026-11-24 확정).
        isOwned: store.defenseTicket.status === "OWNED",
      } as const,
      ...toClosetItems(storeItems),
    ],
    [storeItems, store.defenseTicket.status],
  );
  const { outfit, toggleItem, wear } = useOutfit(
    toClosetItems(storeItems.filter(item => item.isEquipped)),
  );
  // 같은 착용이면 같은 배열을 넘겨 BosalFigure의 memo가 탭 전환 때 다시 그리지 않게 해요.
  const wornItems = useMemo(() => getWornItems(outfit), [outfit]);
  const { plucked, rice } = useHairPlanting();
  const openToast = useTabBarToast();
  const gridRef = useRef<HTMLDivElement>(null);
  const { mutate: buyItem, isPending: isBuyingItem } = useBuyItem();
  const { mutate: buyShield, isPending: isBuyingShield } = useBuyDefenseTicket();
  const { mutate: saveEquipped } = useSaveEquippedItems();

  // 입어 보는 동안에는 저장하지 않고, 곳간을 떠날 때 바뀌었으면 한 번에 저장해요(API 문서 STORE-03).
  // 직접 바꾼 방문만 저장해요. 들어올 때 캐시가 옛 착용이었으면 다시 받은 서버 값과 달라 보여도 저장하지 않아요.
  // 바꿨으면 서버 값과 같아 보여도 보내요. 앞 방문의 저장이 끝나기 전에 받은 서버 값은 옛 착용일 수 있어요.
  const changed = useRef(false);
  // 구매 중인 아이템이에요. 응답 전에 떠나면 산 아이템을 입은 것으로 저장해요. 서버가 사는 순간 입혀요.
  const buying = useRef<Extract<ClosetItem, { kind: "item" }> | null>(null);
  const latest = useRef({ outfit, storeItems });
  useEffect(() => {
    latest.current = { outfit, storeItems };
  });
  useEffect(
    () => () => {
      if (!changed.current) return;
      const { outfit: last, storeItems: items } = latest.current;
      const pending = buying.current;
      const outfit = pending ? { items: { ...last.items, [pending.slot]: pending.code } } : last;
      saveEquipped(getWornCodes(outfit, items));
    },
    [saveEquipped],
  );

  const buy = (item: ClosetItem) => {
    // 공양미가 모자라면 요청하지 않아요(화면 설계서 30-1 ⑥). 서버도 STORE_001로 막아요.
    if (rice < item.price) {
      openToast("공양미가 부족해요");
      return;
    }
    const onError = (error: unknown) => openToast(getBuyErrorMessage(error));
    if (item.kind === "shield")
      buyShield(undefined, { onSuccess: () => openToast("이마 방어권을 샀어요"), onError });
    if (item.kind === "item") {
      buying.current = item;
      buyItem(item.itemId, {
        onSuccess: () => {
          // 서버가 사는 순간 입혀서 화면도 바로 입혀요.
          wear(item);
          playStage(SQUASH, 380);
          openToast("아이템을 사서 입혔어요");
        },
        onError,
        onSettled: () => {
          buying.current = null;
        },
      });
    }
  };

  const playStage = (keyframes: Keyframe[], duration: number) => {
    if (prefersReducedMotion()) return;
    stageRef.current?.animate(keyframes, { duration, easing: "ease-out" });
  };

  const toggle = (item: ClosetItem) => {
    if (item.kind === "item") toggleItem(item);
    changed.current = true;
    // 착용을 바꾼 순간에만 눌렸다 튀어요. effect로 걸면 StrictMode의 마운트 재실행에서도 재생돼요.
    playStage(SQUASH, 380);
  };

  const changeTab = (next: ClosetTab) => {
    setTab(next);
    if (!prefersReducedMotion()) {
      gridRef.current?.animate(LIST_IN, { duration: 240, easing: "ease-out" });
    }
  };

  // 카드의 memo가 유지되게 버튼 처리는 같은 함수로 넘기고, 누를 때 최신 상태로 실행해요.
  const actions = useRef({ buy, toggle });
  useEffect(() => {
    actions.current = { buy, toggle };
  });
  const onBuy = useCallback((item: ClosetItem) => actions.current.buy(item), []);
  const onToggle = useCallback((item: ClosetItem) => actions.current.toggle(item), []);

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
        {/* TDS SegmentedControl이 좌우 24px 여백을 갖고 있어서 감싸는 쪽에는 여백을 두지 않아요. */}
        <div>
          {/* 같은 폭으로 나누면 좁은 화면에서 "악세사리"가 들어가지 않아요. 넘치면 글자 폭에 맞춰요. */}
          <SegmentedControl
            size="small"
            alignment="fluid"
            value={tab}
            onChange={value => changeTab(value as ClosetTab)}
          >
            {CLOSET_TABS.map(({ value, label }) => (
              <SegmentedControl.Item key={value} value={value}>
                {/*
                  TDS는 넘치지 않으면 칸을 같은 폭(360px에서 78px)으로 나눠서, 안쪽 여백(14px)을 빼면 "악세사리"(52px)가 들어가지 않아요.
                  줄바꿈을 막고 좌우를 8px씩 여백 안으로 당겨 가운데에 맞춰요.
                */}
                <span className="-mx-2 whitespace-nowrap">{label}</span>
              </SegmentedControl.Item>
            ))}
          </SegmentedControl>
        </div>

        {/* 탭마다 카드를 새로 마운트하면 저사양 기기에서 프레임이 튀어서, 모두 마운트해 두고 숨김만 바꿔요. */}
        <div ref={gridRef} className="grid grid-cols-2 gap-3.5 px-5">
          <div className={cn(CARD_CLASS, tab !== "all" && "hidden")}>
            <HairPlantCard onPlant={onPlantHair} onGuide={onHairGuide} />
          </div>
          {closetItems.map(item => (
            // 탭 숨김은 감싸는 div만 바꿔서, 탭을 바꿔도 카드는 다시 그리지 않아요.
            <div
              key={item.id}
              className={cn(CARD_CLASS, tab !== "all" && tabOf(item) !== tab && "hidden")}
            >
              <ClosetCard
                item={item}
                color={myRoom.color}
                worn={isWorn(item, outfit)}
                buying={item.kind === "shield" ? isBuyingShield : isBuyingItem}
                onBuy={onBuy}
                onToggle={onToggle}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BosalCloset;
