import { useLocation, useNavigate } from "react-router";

import { paths } from "@/shared/config";
import { HairPlanting } from "@/widgets/storehouse/hairPlanting";

const HairPlantingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 곳간에서 들어왔으면 뒤로 돌아가고, 이 화면으로 바로 열렸으면 곳간으로 바꿔요.
  const close = () =>
    location.key === "default" ? navigate(paths.storehouse, { replace: true }) : navigate(-1);

  // 나발 빠짐 설명에서 넘어오면 내용만 나타나게 해요(HairGuidePage가 state로 알려줘요).
  const fadeIn = (location.state as { fadeIn?: boolean } | null)?.fadeIn === true;

  return <HairPlanting onClose={close} fadeIn={fadeIn} />;
};

export default HairPlantingPage;
