import { useNavigate } from "react-router";

import { paths } from "@/shared/config";
import { BosalCloset } from "@/widgets/storehouse/bosalCloset";

const StorehousePage = () => {
  const navigate = useNavigate();

  return (
    <BosalCloset
      onPlantHair={() => navigate(paths.hairPlanting)}
      onHairGuide={() => navigate(paths.hairGuide)}
    />
  );
};

export default StorehousePage;
