import { useLocation, useNavigate } from "react-router";

import { ServiceTour } from "@/features/onboarding/takeServiceTour";
import { paths } from "@/shared/config";

/** 온보딩 가드(`app/router/guards/OnboardingGuard`)가 넘긴, 원래 가려던 경로예요. 없으면 진입 분기(/)로 가요. */
const getReturnPath = (state: unknown) =>
  typeof state === "object" && state !== null && "from" in state && typeof state.from === "string"
    ? state.from
    : paths.root;

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  // 온보딩으로 돌아오지 않도록 기록을 바꿔요.
  // 🔖 인트로(/intro) 화면이 생기면 진입 분기에서 방이 없는 사용자를 인트로로 보내요. 방 참여 이슈에서 처리해요.
  return <ServiceTour onFinish={() => navigate(getReturnPath(state), { replace: true })} />;
};

export default OnboardingPage;
