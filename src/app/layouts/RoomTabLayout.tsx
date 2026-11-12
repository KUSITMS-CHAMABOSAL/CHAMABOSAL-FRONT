import { Outlet, useLocation, useNavigate, useParams } from "react-router";

import { paths } from "@/shared/config";

import RoomTabBar, { type RoomTab } from "./RoomTabBar";

const SUB_TABS = ["vote", "storehouse", "my"] as const;

/** 지금 경로에 맞는 탭이에요. 인증 결과처럼 탭에 속하지 않는 화면은 선택 없이 그려요. */
const getActiveTab = (pathname: string, roomId: number): RoomTab | undefined => {
  if (pathname === paths.room.home(roomId)) return "home";
  return SUB_TABS.find(tab => pathname.startsWith(paths.room[tab](roomId)));
};

// 🔖 빨간 점(updatedTabs)은 탭 화면의 데이터가 생기면 연결합니다.
const RoomTabLayout = () => {
  const roomId = Number(useParams().roomId);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const activeTab = getActiveTab(pathname, roomId);

  return (
    <>
      <Outlet />
      <RoomTabBar
        activeTab={activeTab}
        onTabClick={tab => tab !== activeTab && navigate(paths.room[tab](roomId))}
      />
    </>
  );
};

export default RoomTabLayout;
