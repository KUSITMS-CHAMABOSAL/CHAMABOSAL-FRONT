import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router";

import { useToast } from "@toss/tds-mobile";

import { useTodayQuery } from "@/entities/room";
import { paths } from "@/shared/config";
import { minutesUntil } from "@/shared/lib";
import { CertifyForm } from "@/widgets/certification/certifyForm";

/** 내 인증 수정이에요. 홈의 [수정하기]로 들어와요. 오늘 인증을 채운 작성 폼에서 고쳐요. */
const CertifyEditPage = () => {
  const roomId = Number(useParams().roomId);
  const today = useTodayQuery(roomId);
  const navigate = useNavigate();
  const { openToast } = useToast();
  // 처음 받은 내 인증으로 폼을 채워요. 저장 뒤 다시 받은 오늘 탭으로 폼이 바뀌지 않게 해요.
  const [certification] = useState(
    () => today.data?.members.find(member => member.isMe)?.certification ?? null,
  );
  const [result, setResult] = useState(certification?.result);
  const toHome = () => navigate(paths.room.home(roomId), { replace: true });

  if (!today.data) {
    if (today.error) throw today.error;
    return null;
  }
  // 홈에서 들어오면 오늘 탭이 이미 있어요. 바로 열었거나 고칠 수 없는 인증이면 홈으로 가요.
  if (
    !certification ||
    !result ||
    certification.lockReason ||
    minutesUntil(certification.editableUntil) <= 0
  )
    return <Navigate to={paths.room.home(roomId)} replace />;

  return (
    <CertifyForm
      roomId={roomId}
      today={today.data}
      result={result}
      onChangeResult={setResult}
      edit={certification}
      onEdited={() => {
        openToast("인증을 수정했어요");
        toHome();
      }}
      onUnavailable={toHome}
    />
  );
};

export default CertifyEditPage;
