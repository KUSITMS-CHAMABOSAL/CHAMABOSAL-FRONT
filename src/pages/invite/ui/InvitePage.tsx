import { Navigate, useLocation, useSearchParams } from "react-router";

import { type InviteState, paths } from "@/shared/config";
import { JoinRoomSteps } from "@/widgets/onboarding/joinSteps";

const getInviteToken = (state: unknown) =>
  typeof state === "object" && state !== null && "token" in state && typeof state.token === "string"
    ? state.token
    : "";

/**
 * 초대 링크(`/invite?code=`)로 들어오는 화면이에요. 코드가 없으면 들어갈 수 없는 방으로 보여줘요.
 * 분석 로그가 주소의 쿼리를 함께 보내서, 코드는 읽자마자 기록(state)으로 옮기고 주소에서 지워요.
 */
const InvitePage = () => {
  const code = useSearchParams()[0].get("code");
  const { state } = useLocation();
  if (code !== null)
    return <Navigate to={paths.invite()} replace state={{ token: code } satisfies InviteState} />;
  const token = getInviteToken(state);
  return <JoinRoomSteps key={token} token={token} />;
};

export default InvitePage;
