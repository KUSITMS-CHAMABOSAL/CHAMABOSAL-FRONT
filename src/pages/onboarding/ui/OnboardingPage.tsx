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
  return <ServiceTour onFinish={() => navigate(getReturnPath(state), { replace: true })} />;
};

export default OnboardingPage;
