import { useState } from "react";
import { Navigate, useNavigate, useParams, useSearchParams } from "react-router";

import { canCertify, useTodayQuery } from "@/entities/room";
import { paths } from "@/shared/config";
import type { CertificationResult } from "@/shared/types";
import { CertifyForm } from "@/widgets/certification/certifyForm";

import type { CertifyResultState } from "../model/types";

const isResult = (value: string | null): value is CertificationResult =>
  value === "ENDURED" || value === "FAILED";

/** 인증 작성이에요. 고른 결과는 주소(`?result=`)에 두어 새로고침해도 남아요. */
const CertifyWritePage = () => {
  const roomId = Number(useParams().roomId);
  const [params, setParams] = useSearchParams();
  const result = params.get("result");
  const today = useTodayQuery(roomId);
  const navigate = useNavigate();
  // 오늘 탭을 처음 받았을 때만 인증할 수 있는지 봐요. 등록 뒤 다시 받은 오늘 탭으로 홈에 튕기지 않게 해요.
  const [isBlocked, setIsBlocked] = useState<boolean | null>(null);
  if (isBlocked === null && today.data) setIsBlocked(!canCertify(today.data));
  const toHome = () => navigate(paths.room.home(roomId), { replace: true });

  if (!isResult(result)) return <Navigate to={paths.room.certify(roomId)} replace />;
  if (!today.data) {
    if (today.error) throw today.error;
    return null;
  }
  if (isBlocked) return <Navigate to={paths.room.home(roomId)} replace />;

  return (
    <CertifyForm
      roomId={roomId}
      today={today.data}
      result={result}
      // 결과를 바꿔도 기록을 쌓지 않아 뒤로가기 한 번에 고르기 화면으로 가요.
      onChangeResult={next => setParams({ result: next }, { replace: true })}
      onSubmitted={({ isVoteStarted }) =>
        navigate(paths.room.certifyResult(roomId), {
          replace: true,
          state: { result, isVoteStarted } satisfies CertifyResultState,
        })
      }
      onUnavailable={toHome}
    />
  );
};

export default CertifyWritePage;
