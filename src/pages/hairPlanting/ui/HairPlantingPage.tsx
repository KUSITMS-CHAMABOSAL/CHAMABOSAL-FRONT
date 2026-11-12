import { useLocation, useNavigate, useParams } from "react-router";

import { paths } from "@/shared/config";
import { HairPlanting } from "@/widgets/storehouse/hairPlanting";

const HairPlantingPage = () => {
  const roomId = Number(useParams().roomId);
  const navigate = useNavigate();
  const location = useLocation();

  // 곳간에서 들어왔으면 뒤로 돌아가고, 이 화면으로 바로 열렸으면 곳간으로 바꿔요.
  const close = () =>
    location.key === "default"
      ? navigate(paths.room.storehouse(roomId), { replace: true })
      : navigate(-1);

  return <HairPlanting onClose={close} />;
};

export default HairPlantingPage;
