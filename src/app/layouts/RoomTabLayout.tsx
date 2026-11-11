import { Outlet } from "react-router";

import RoomTabBar from "./RoomTabBar";

// 선택 탭, 탭 이동, 빨간 점은 탭 화면의 라우트가 생기면 연결합니다.
const RoomTabLayout = () => {
  return (
    <>
      <Outlet />
      <RoomTabBar />
    </>
  );
};

export default RoomTabLayout;
