import { Navigate, useLocation } from "react-router";

import { useMeQuery } from "@/entities/session";
import { type HairGuideState, paths } from "@/shared/config";

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
  if (!me.data) return null;
  const roomId = me.data.rooms[0]?.roomId;
  const target = roomId === undefined ? paths.intro : getRoomPath(roomId, state?.tab);

  // 처음 나발이 빠졌으면 곳간의 나발 설명부터 보여주고, 닫으면 원래 가려던 화면으로 가요.
  // 🔖 두 번째부터 빠지는 연출은 시안이 없어 띄우지 않고 '안 봄'으로 남겨요.
  const { isFirstLoss, unseenFallenNumbers, lastNabalLossId } = me.data.nabal;
  if (isFirstLoss && unseenFallenNumbers.length > 0 && lastNabalLossId !== null)
    return (
      <Navigate
        to={paths.hairGuide}
        replace
        state={{ nabalLossId: lastNabalLossId, returnTo: target } satisfies HairGuideState}
      />
    );

  return <Navigate to={target} replace />;
};

export default EntryRedirect;
