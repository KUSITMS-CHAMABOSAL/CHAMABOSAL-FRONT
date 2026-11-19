import { useNavigate } from "react-router";

import { POT_GOAL_MIN } from "@/entities/room";
import { paths } from "@/shared/config";
import { PotFullResult } from "@/widgets/certification/potFull";

/**
 * 공양미 가득 인터랙션을 바로 확인하는 임시 화면이에요.
 * 🔖 인증 결과 화면에 붙이면 이 경로는 지워요. 목표 석수와 순위는 API가 나올 때까지 시안 값이에요.
 */
const PotFullPreviewPage = () => {
  const navigate = useNavigate();

  return (
    <PotFullResult
      goal={POT_GOAL_MIN}
      onShop={() => navigate(paths.storehouse)}
      onClose={() => navigate(paths.root)}
    />
  );
};

export default PotFullPreviewPage;
