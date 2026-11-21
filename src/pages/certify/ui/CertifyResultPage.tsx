import { Navigate, useLocation, useNavigate, useParams } from "react-router";

import { paths } from "@/shared/config";
import { CertifyResult } from "@/widgets/certification/certifyResult";

import type { CertifyResultState } from "../model/types";

/** 인증 완료예요. 등록 결과는 작성 화면이 넘겨줘요. */
const CertifyResultPage = () => {
  const roomId = Number(useParams().roomId);
  const state = useLocation().state as CertifyResultState | null;
  const navigate = useNavigate();

  if (!state) return <Navigate to={paths.room.home(roomId)} replace />;

  return (
    <CertifyResult
      result={state.result}
      isVoteStarted={state.isVoteStarted}
      onVote={() => navigate(paths.room.vote(roomId), { replace: true })}
      onBackToRoom={() => navigate(paths.room.home(roomId), { replace: true })}
    />
  );
};

export default CertifyResultPage;
