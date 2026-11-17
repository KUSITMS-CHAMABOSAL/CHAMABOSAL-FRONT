import { Navigate, Outlet, useLocation } from "react-router";

import { useHasSeenServiceTour } from "@/features/onboarding/takeServiceTour";
import { paths } from "@/shared/config";

/**
 * 서비스에 처음 들어오면 어느 경로로 들어와도(초대 링크, 푸시 포함) 온보딩부터 보여줘요.
 * 원래 가려던 경로는 `state.from`으로 넘겨, 온보딩을 마치면 그 화면으로 돌아가요(`OnboardingPage`).
 */
const OnboardingGuard = () => {
  const seen = useHasSeenServiceTour();
  const { pathname, search, hash } = useLocation();

  if (seen === undefined) return null;
  if (!seen) {
    return <Navigate to={paths.onboarding} replace state={{ from: pathname + search + hash }} />;
  }
  return <Outlet />;
};

export default OnboardingGuard;
