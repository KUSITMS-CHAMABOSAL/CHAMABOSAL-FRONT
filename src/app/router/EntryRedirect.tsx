import { FullScreenLoader } from "@toss/tds-mobile";
import { Navigate, useLocation } from "react-router";

import { useMeQuery } from "@/entities/session";
import { paths } from "@/shared/config";

/** 방 없이 방 탭을 눌러 진입 분기로 왔을 때, 방을 고른 뒤 그 탭으로 보내려고 받아요. */
export interface EntryState {
  tab?: "home" | "vote" | "my";
}

const getRoomPath = (roomId: number, tab: EntryState["tab"]) => {
  if (tab === "my") return paths.my(roomId);
  if (tab === "vote") return paths.room.vote(roomId);
  return paths.room.home(roomId);
};

// 진입 분기예요. 참여 중인 방이 없으면 인트로로 가요. 🔖 마지막으로 본 방(Storage)은 해당 화면 이슈에서 붙여요.
const EntryRedirect = () => {
  const me = useMeQuery();
  const state = useLocation().state as EntryState | null;
  if (me.error) throw me.error;
  if (!me.data) return <FullScreenLoader />;
  const roomId = me.data.rooms[0]?.roomId;
  if (roomId === undefined) return <Navigate to={paths.intro} replace />;
  return <Navigate to={getRoomPath(roomId, state?.tab)} replace />;
};

export default EntryRedirect;
