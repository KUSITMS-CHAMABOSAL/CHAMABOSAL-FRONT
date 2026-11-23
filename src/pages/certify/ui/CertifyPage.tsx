import { FullScreenLoader } from "@toss/tds-mobile";
import { Navigate, useNavigate, useParams } from "react-router";

import { canCertify, useTodayQuery } from "@/entities/room";
import { paths } from "@/shared/config";
import { CertifyChoice } from "@/widgets/certification/certifyChoice";

/** 번뇌 떠올리기예요. 홈의 인증 버튼으로 들어와 참았어요·못 참았어요를 골라요. */
const CertifyPage = () => {
  const roomId = Number(useParams().roomId);
  const today = useTodayQuery(roomId);
  const navigate = useNavigate();

  if (!today.data) {
    if (today.error) throw today.error;
    return <FullScreenLoader />;
  }
  // 이미 인증했거나 인증 시간이 아니면 홈으로 가요. 완료 화면에서 뒤로 와도 여기서 막혀요.
  if (!canCertify(today.data)) return <Navigate to={paths.room.home(roomId)} replace />;

  return <CertifyChoice onSelect={result => navigate(paths.room.certifyWrite(roomId, result))} />;
};

export default CertifyPage;
