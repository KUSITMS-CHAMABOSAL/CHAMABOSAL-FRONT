import { Skeleton } from "@toss/tds-mobile";
import { Navigate, useNavigate, useParams } from "react-router";

import { useMeQuery } from "@/entities/session";
import { paths } from "@/shared/config";
import { useTabBarToast } from "@/shared/lib";
import { CertificationCalendar } from "@/widgets/myBosal/certificationCalendar";
import { MyRoomPanel } from "@/widgets/myBosal/myRoomPanel";

/** 내 보살 탭이에요. 고른 방의 내 보살과 인증 캘린더를 보여주고, 설정 화면으로 가는 버튼을 둬요. */
const MyBosalPage = () => {
  const me = useMeQuery();
  const roomId = Number(useParams().roomId);
  const navigate = useNavigate();
  const openToast = useTabBarToast();

  if (!me.data) {
    // 진입 분기처럼 내 정보를 못 받으면 라우트 오류 화면으로 보내요.
    if (me.error) throw me.error;
    return (
      <main className="min-h-svh bg-(--adaptiveBackground)">
        {/* 제목, 내 보살, 인증 캘린더 순서예요. */}
        <Skeleton
          custom={["title", "subtitle", "card", "spacer(24)", "title", "card"]}
          repeatLastItemCount={1}
        />
      </main>
    );
  }

  const room = me.data.rooms.find(item => item.roomId === roomId);
  // 나갔거나 없는 방이면 진입 분기로 보내요.
  if (!room) return <Navigate to={paths.root} replace />;

  return (
    <main className="min-h-svh bg-(--adaptiveBackground)">
      <MyRoomPanel
        rooms={me.data.rooms}
        room={room}
        fallenHairs={me.data.nabal.fallenNumbers}
        equippedItems={me.data.equippedItemCodes}
        canCreateRoom={me.data.canCreateRoom}
        onSelectRoom={id => navigate(paths.my(id), { replace: true })}
        // 🔖 방 만들기(/rooms/new)는 각 이슈에서 연결해요.
        onCreateRoom={() => openToast("방 만들기는 준비 중이에요")}
        onOpenSettings={() => navigate(paths.settings)}
      />
      {/* 방을 바꾸면 보던 달을 이번 달로 되돌려요. */}
      <CertificationCalendar key={roomId} roomId={roomId} />
    </main>
  );
};

export default MyBosalPage;
