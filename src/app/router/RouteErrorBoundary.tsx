import { Result } from "@toss/tds-mobile";
import { useNavigate } from "react-router";

import { paths } from "@/shared/config";

// 🔖 시안에 없는 화면이라 문구와 모양은 디자이너 확인이 필요합니다.
const RouteErrorBoundary = () => {
  const navigate = useNavigate();

  return (
    <Result
      title="문제가 생겼어요"
      description="화면을 불러오지 못했어요."
      button={
        <Result.Button onClick={() => navigate(paths.root, { replace: true })}>
          처음으로
        </Result.Button>
      }
    />
  );
};

export default RouteErrorBoundary;
