import { useNavigate, useParams } from "react-router";

import { paths } from "@/shared/config";
import { BosalCloset } from "@/widgets/storehouse/bosalCloset";

const StorehousePage = () => {
  const roomId = Number(useParams().roomId);
  const navigate = useNavigate();

  return <BosalCloset onPlantHair={() => navigate(paths.room.hairPlanting(roomId))} />;
};

export default StorehousePage;
