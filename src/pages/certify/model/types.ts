import type { CertificationResult } from "@/shared/types";

/** 작성 화면이 완료 화면에 넘기는 등록 결과예요. 새로고침하면 사라져서 없으면 방 홈으로 가요. */
export interface CertifyResultState {
  result: CertificationResult;
  isVoteStarted: boolean;
}
