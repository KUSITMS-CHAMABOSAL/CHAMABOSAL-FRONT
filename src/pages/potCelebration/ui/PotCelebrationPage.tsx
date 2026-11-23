import { FullScreenLoader } from "@toss/tds-mobile";
import { useNavigate, useParams } from "react-router";

import { usePotCelebrationQuery } from "@/entities/room";
import { paths } from "@/shared/config";
import { PotCelebration } from "@/widgets/room/potCelebration";

/** 한 솥 축하예요. 방 홈에 들어올 때 안 본 축하가 있으면 먼저 떠요. */
const PotCelebrationPage = () => {
  const params = useParams();
  const roomId = Number(params.roomId);
  const seq = Number(params.seq);
  const pot = usePotCelebrationQuery(roomId, seq);
  const navigate = useNavigate();

  if (!pot.data) {
    if (pot.error) throw pot.error;
    return <FullScreenLoader />;
  }

  return (
    <PotCelebration
      roomId={roomId}
      pot={pot.data}
      onClose={() => navigate(paths.room.home(roomId), { replace: true })}
      onShop={() => navigate(paths.storehouse, { replace: true })}
    />
  );
};

export default PotCelebrationPage;
