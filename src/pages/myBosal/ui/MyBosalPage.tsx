import { Navigate, useNavigate, useParams } from "react-router";

import { useMeQuery } from "@/entities/session";
import { paths } from "@/shared/config";
import { CertificationCalendar } from "@/widgets/myBosal/certificationCalendar";
import { MyRoomPanel, MyRoomPanelSkeleton } from "@/widgets/myBosal/myRoomPanel";

/** 내 보살 탭이에요. 고른 방의 내 보살과 인증 캘린더를 보여주고, 설정 화면으로 가는 버튼을 둬요. */
const MyBosalPage = () => {
  const me = useMeQuery();
  const roomId = Number(useParams().roomId);
  const navigate = useNavigate();

  // 진입 분기처럼 내 정보를 못 받으면 라우트 오류 화면으로 보내요.
  if (!me.data && me.error) throw me.error;
  const room = me.data?.rooms.find(item => item.roomId === roomId);
  // 나갔거나 없는 방이면 진입 분기로 보내요.
  if (me.data && !room) return <Navigate to={paths.root} replace />;

  return (
    <main className="min-h-svh bg-(--adaptiveBackground)">
      {me.data && room ? (
        <MyRoomPanel
          rooms={me.data.rooms}
          room={room}
          fallenHairs={me.data.nabal.fallenNumbers}
          equippedItems={me.data.equippedItemCodes}
          canCreateRoom={me.data.canCreateRoom}
          onSelectRoom={id => navigate(paths.my(id), { replace: true })}
          onCreateRoom={() => navigate(paths.createRoom)}
          onOpenSettings={() => navigate(paths.settings)}
        />
      ) : (
        <MyRoomPanelSkeleton />
      )}
      {/* 캘린더는 주소의 방 번호만 있으면 돼서 내 정보를 기다리지 않고 같이 받아요.
          방을 바꾸면 보던 달을 이번 달로 되돌려요. */}
      <CertificationCalendar key={roomId} roomId={roomId} />
    </main>
  );
};

export default MyBosalPage;
