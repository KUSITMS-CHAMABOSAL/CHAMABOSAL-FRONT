import { useLocation, useNavigate } from "react-router";

import { paths } from "@/shared/config";
import { HairGuide } from "@/widgets/storehouse/hairPlanting";

const HairGuidePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 이전 화면이 있으면 돌아가고, 이 화면으로 바로 열렸으면 곳간으로 바꿔요.
  const openedDirectly = location.key === "default";
  const close = () =>
    openedDirectly ? navigate(paths.storehouse, { replace: true }) : navigate(-1);

  // 설명은 한 번 보고 지나가는 화면이라, 심기 화면에서 닫으면 설명 전 화면으로 돌아가게 바꿔요.
  // 바꾸면 key가 새로 생겨서, 돌아갈 화면이 없다는 걸 state로 넘겨요.
  return (
    <HairGuide
      onPlant={() =>
        navigate(paths.hairPlanting, { replace: true, state: { fadeIn: true, openedDirectly } })
      }
      onBuy={() => navigate(paths.storehouse, { replace: true })}
      onClose={close}
    />
  );
};

export default HairGuidePage;
