import { Outlet, useNavigate } from "react-router";

import { paths } from "@/shared/config";
import { BosalCloset } from "@/widgets/storehouse/bosalCloset";

const StorehousePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <BosalCloset
        onPlantHair={() => navigate(paths.hairPlanting)}
        onHairGuide={() => navigate(paths.hairGuide)}
      />
      {/* 나발 빠짐 설명(/storehouse/hair/guide)과 나발 심기(/storehouse/hair)를 곳간 위에 겹쳐 띄워요. */}
      <Outlet />
    </>
  );
};

export default StorehousePage;
