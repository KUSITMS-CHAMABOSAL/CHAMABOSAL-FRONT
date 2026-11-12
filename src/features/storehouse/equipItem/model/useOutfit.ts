import { useState } from "react";

import type { BosalExpression, BosalFaceItem, BosalHat } from "@/entities/bosal";

export interface Outfit {
  hat: BosalHat | null;
  faceItem: BosalFaceItem | null;
  expression: BosalExpression;
}

const INITIAL_OUTFIT: Outfit = { hat: "santaHat", faceItem: null, expression: "default" };

/** 착용 상태예요. 이미 착용한 아이템을 다시 누르면 벗어요. 서버 스펙이 없어 화면 상태로만 둬요. */
export const useOutfit = () => {
  const [outfit, setOutfit] = useState<Outfit>(INITIAL_OUTFIT);

  const toggleHat = (hat: BosalHat) =>
    setOutfit(prev => ({ ...prev, hat: prev.hat === hat ? null : hat }));
  const toggleFaceItem = (faceItem: BosalFaceItem) =>
    setOutfit(prev => ({ ...prev, faceItem: prev.faceItem === faceItem ? null : faceItem }));
  const toggleExpression = (expression: BosalExpression) =>
    setOutfit(prev => ({
      ...prev,
      expression: prev.expression === expression ? "default" : expression,
    }));

  return { outfit, toggleHat, toggleFaceItem, toggleExpression };
};
