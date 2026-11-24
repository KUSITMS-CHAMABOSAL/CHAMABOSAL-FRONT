import beadEarring from "../assets/item_bead_earring.svg";
import duckLips from "../assets/item_duck_lips.svg";
import energyWave from "../assets/item_energy_wave.svg";
import eyebrowPiercing from "../assets/item_eyebrow_piercing.svg";
import gyaruHairpin from "../assets/item_gyaru_hairpin.svg";
import headset from "../assets/item_headset.svg";
import jadeRing from "../assets/item_jade_ring.svg";
import leopardGlasses from "../assets/item_leopard_glasses.svg";
import rudolphHeadband from "../assets/item_rudolph_headband.svg";
import rudolphNose from "../assets/item_rudolph_nose.svg";
import santaBeard from "../assets/item_santa_beard.svg";
import santaHat from "../assets/item_santa_hat.svg";
import sunglasses from "../assets/item_sunglasses.svg";
import type { ItemCode } from "../model/types";

export interface ItemArt {
  href: string;
  /** 보살 프레임(88×139) 안의 자리예요. */
  x: number;
  y: number;
  width: number;
  height: number;
  /** 자리 가운데를 기준으로 돌리는 각도예요. */
  rotate?: number;
}

/** 시안 `item/착용샷`은 보살이 119px이에요. 보살 프레임(139px)에 맞게 키워요. */
const DESIGN_SCALE = 139 / 119;

const fromDesign = (href: string, x: number, y: number, width: number, height: number) => ({
  href,
  x: x * DESIGN_SCALE,
  y: y * DESIGN_SCALE,
  width: width * DESIGN_SCALE,
  height: height * DESIGN_SCALE,
});

/**
 * 아이템마다 보살 위에 겹칠 그림과 자리예요. 시안 `item/착용샷`(2717:81073)에서 보살 기준 좌표를 옮겼어요.
 * 옥반지와 산타 수염 그림은 배경이 섞이지 않은 기획 '코스튬 가격표'의 SVG를 써요. 산타 수염 자리는 가격표 착용샷에서 계산했어요.
 * 갸루 머리핀과 호피 안경은 무늬가 사진이라, 가격표 SVG에서 캔버스 배경을 빼고 무늬 사진만 그리는 크기에 맞게 줄였어요.
 * 모양은 벡터라 모양 밖은 투명해요.
 */
export const ITEM_ART: Record<ItemCode, ItemArt> = {
  // 시안 레이어(17.54, -13, 52.57×30.95)는 모자 그림(49.96×25.32)을 6.67° 돌린 상자예요. 가운데에 원래 크기로 놓고 돌려요.
  SANTA_HAT: {
    ...fromDesign(santaHat, 43.82 - 49.96 / 2, 2.48 - 25.32 / 2, 49.96, 25.32),
    rotate: 6.67,
  },
  HEADSET: fromDesign(headset, 0, 4, 77, 67),
  RUDOLPH_HEADBAND: fromDesign(rudolphHeadband, 1, -8, 72.58, 77),
  GYARU_HAIRPIN: fromDesign(gyaruHairpin, 49, 17, 19.04, 15.87),
  SUNGLASSES: fromDesign(sunglasses, 18, 55, 40, 5),
  EYEBROW_PIERCING: fromDesign(eyebrowPiercing, 53, 44, 2, 8),
  LEOPARD_GLASSES: fromDesign(leopardGlasses, 18, 54, 41, 7),
  SANTA_BEARD: fromDesign(santaBeard, 16, 60.4, 43.7, 38),
  RUDOLPH_NOSE: { href: rudolphNose, x: 38.25, y: 61.91, width: 12.88, height: 12.88 },
  DUCK_LIPS: fromDesign(duckLips, 30, 62, 17, 8),
  BEAD_EARRING: fromDesign(beadEarring, 1, 57, 75, 5),
  JADE_RING: fromDesign(jadeRing, 12.31, 75, 46, 8),
  ENERGY_WAVE: fromDesign(energyWave, 19, 66, 40, 40),
};

/** 자리 가운데를 기준으로 돌리는 SVG `transform`이에요. 돌리지 않으면 없어요. */
export const getItemTransform = ({ x, y, width, height, rotate }: ItemArt) =>
  rotate ? `rotate(${rotate} ${x + width / 2} ${y + height / 2})` : undefined;

/** 서버가 새 아이템을 더해도 그림이 없는 코드는 그리지 않아요. */
export const isItemCode = (code: string): code is ItemCode => code in ITEM_ART;
