import { Navigate } from "react-router";

import { useMeQuery } from "@/entities/session";
import { paths } from "@/shared/config";

// 진입 분기예요. 🔖 방이 없을 때 /intro, 마지막으로 본 방(Storage)은 해당 화면 이슈에서 붙여요.
const EntryRedirect = () => {
  const me = useMeQuery();
  if (me.error) throw me.error;
  const roomId = me.data?.rooms[0]?.roomId;
  if (roomId === undefined) return null;
  return <Navigate to={paths.room.home(roomId)} replace />;
};

export default EntryRedirect;
