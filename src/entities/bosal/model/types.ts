export type { BosalColor } from "@/shared/types";

/** 시안 `부처` 컴포넌트의 표정이에요. 기본·참았음·못참았음·찔림 */
export type BosalExpression = "default" | "patient" | "failed" | "poked";

/** 오늘 인증 상태예요. 상태 뱃지와 표정을 정해요. */
export type BosalStatus = "unverified" | "patient" | "failed";
