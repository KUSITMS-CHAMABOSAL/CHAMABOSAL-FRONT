import mintDefault from "../assets/bosal_mint_default.svg";
import mintFailed from "../assets/bosal_mint_failed.svg";
import mintPatient from "../assets/bosal_mint_patient.svg";
import mintPoked from "../assets/bosal_mint_poked.svg";
import pinkDefault from "../assets/bosal_pink_default.svg";
import pinkFailed from "../assets/bosal_pink_failed.svg";
import pinkPatient from "../assets/bosal_pink_patient.svg";
import pinkPoked from "../assets/bosal_pink_poked.svg";
import purpleDefault from "../assets/bosal_purple_default.svg";
import purpleFailed from "../assets/bosal_purple_failed.svg";
import purplePatient from "../assets/bosal_purple_patient.svg";
import purplePoked from "../assets/bosal_purple_poked.svg";
import yellowDefault from "../assets/bosal_yellow_default.svg";
import yellowFailed from "../assets/bosal_yellow_failed.svg";
import yellowPatient from "../assets/bosal_yellow_patient.svg";
import yellowPoked from "../assets/bosal_yellow_poked.svg";
import type { BosalColor, BosalExpression, BosalStatus } from "../model/types";

/** 인증 상태별 기본 표정이에요. 찔림은 콕 찔렸을 때만 잠깐 보여줘요. */
export const STATUS_EXPRESSION: Record<BosalStatus, BosalExpression> = {
  unverified: "default",
  patient: "patient",
  failed: "failed",
};

export const BOSAL_ART: Record<BosalColor, Record<BosalExpression, string>> = {
  PINK: { default: pinkDefault, patient: pinkPatient, failed: pinkFailed, poked: pinkPoked },
  YELLOW: {
    default: yellowDefault,
    patient: yellowPatient,
    failed: yellowFailed,
    poked: yellowPoked,
  },
  PURPLE: {
    default: purpleDefault,
    patient: purplePatient,
    failed: purpleFailed,
    poked: purplePoked,
  },
  MINT: { default: mintDefault, patient: mintPatient, failed: mintFailed, poked: mintPoked },
};

/** 그림 원본 크기예요. 높이는 모두 139이고, 못 참은 표정은 땀방울이 오른쪽으로 삐져나와 폭이 넓어요. */
export const BOSAL_ART_HEIGHT = 139;
export const BOSAL_ART_WIDTH: Record<BosalExpression, number> = {
  default: 88,
  patient: 89,
  failed: 107,
  poked: 88,
};
