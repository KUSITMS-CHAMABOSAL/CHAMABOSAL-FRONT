import { useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate, useParams } from "react-router";

import { useTodayQuery } from "@/entities/room";
import { NotFoundPage } from "@/pages/notFound";
import { paths } from "@/shared/config";

import type { EntryState } from "../router/EntryRedirect";
import RoomTabBar, { type RoomTab } from "./RoomTabBar";

/** 탭 레이아웃 안에 있지만 하단 바를 그리지 않는 화면이에요. */
const NO_TAB_BAR_PATHS: readonly string[] = [paths.hairPlanting];

/** 방 화면 중 하단 바를 그리지 않는 화면이에요. 인증 작성은 시안에 하단 바가 없어요. */
const hidesTabBar = (pathname: string, roomId?: number) =>
  roomId !== undefined && pathname === paths.room.certifyWrite(roomId);

/** 지금 경로에 맞는 탭이에요. 인증 결과처럼 탭에 속하지 않는 화면은 선택 없이 그려요. */
const getActiveTab = (pathname: string, roomId?: number): RoomTab | undefined => {
  if (pathname.startsWith(paths.storehouse)) return "storehouse";
  if (roomId === undefined) return undefined;
  if (pathname === paths.my(roomId)) return "my";
  // 인증은 홈의 인증 버튼으로 들어와서 홈 탭에 속해요.
  if (pathname === paths.room.home(roomId) || pathname.startsWith(paths.room.certify(roomId)))
    return "home";
  if (pathname.startsWith(paths.room.vote(roomId))) return "vote";
};

// 🔖 빨간 점(updatedTabs)은 탭 화면의 데이터가 생기면 연결합니다.
const RoomTabLayout = () => {
  const { roomId: param, roundId } = useParams();
  const id = Number(param);
  // 주소의 방 번호가 정수가 아니면(`/my/abc`) 방이 없는 것으로 봐요. NaN을 그대로 두면 아래 기억 비교가 끝나지 않아요.
  const roomId = Number.isInteger(id) ? id : undefined;
  // 라우터는 끝의 `/`도 같은 화면으로 보여줘요(`/storehouse/hair/`). 탭 판단도 같게 하려고 떼어 내요.
  const pathname = useLocation().pathname.replace(/\/+$/, "");
  const navigate = useNavigate();
  const activeTab = getActiveTab(pathname, roomId);
  const isRoomHome = roomId !== undefined && pathname === paths.room.home(roomId);
  // 홈과 같은 쿼리라 따로 요청하지 않아요. 홈 화면에서만 받아요.
  const today = useTodayQuery(isRoomHome ? roomId : undefined);

  // 곳간 주소에는 방이 없어요. 곳간에서 방 탭으로 돌아갈 때 쓰려고 마지막으로 본 방을 기억해요.
  // 내 보살에서 고른 방도 같은 `roomId`라 홈과 투표로 이어져요.
  // 나발 심기도 이 레이아웃 안에 있어서 다녀와도 기억이 남아요.
  const [lastRoomId, setLastRoomId] = useState(roomId);
  if (roomId !== undefined && roomId !== lastRoomId) setLastRoomId(roomId);

  const goToTab = (tab: RoomTab) => {
    if (tab === "storehouse") return navigate(paths.storehouse);
    const id = roomId ?? lastRoomId;
    // 곳간으로 바로 들어와 본 방이 없으면 진입 분기가 방을 고른 뒤 누른 탭으로 보내요.
    if (id === undefined) return navigate(paths.root, { state: { tab } satisfies EntryState });
    navigate(tab === "my" ? paths.my(id) : paths.room[tab](id));
  };

  if (param !== undefined && roomId === undefined) return <NotFoundPage />;

  // 솥을 다 채웠는데 축하를 안 봤으면 방 홈보다 먼저 띄워요. 투표·톡톡으로 채워도 방 홈에 오면 떠요.
  // 🔖 결과(entry.unseenResultRoundId) 진입을 붙이면 이 앞에 둬요.
  if (isRoomHome && today.data?.entry.hasUnseenPotCelebration)
    return <Navigate to={paths.room.pot(roomId, today.data.room.potCompletedCount)} replace />;

  return (
    <>
      <Outlet />
      {/* 회차가 붙은 화면(목탁 수행)도 하단 바를 그리지 않아요. */}
      {!NO_TAB_BAR_PATHS.includes(pathname) &&
        !hidesTabBar(pathname, roomId) &&
        roundId === undefined && (
          <RoomTabBar activeTab={activeTab} onTabClick={tab => tab !== activeTab && goToTab(tab)} />
        )}
    </>
  );
};

export default RoomTabLayout;
