import { useSearchParams } from "react-router";

import { JoinRoomSteps } from "@/widgets/onboarding/joinSteps";

/** 초대 링크(`/invite?code=`)로 들어오는 화면이에요. 코드가 없으면 들어갈 수 없는 방으로 보여줘요. */
const InvitePage = () => {
  const code = useSearchParams()[0].get("code") ?? "";
  return <JoinRoomSteps key={code} token={code} />;
};

export default InvitePage;
