import { Outlet } from "react-router";

const RoomTabLayout = () => {
  return (
    <>
      <Outlet />
      {/* 하단 탭바는 탭바 이슈에서 추가합니다. */}
    </>
  );
};

export default RoomTabLayout;
