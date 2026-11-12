import { Navigate, useNavigate, useParams } from "react-router";

import { Border } from "@toss/tds-mobile";

import { useMeQuery } from "@/entities/session";
import { paths } from "@/shared/config";
import { useTabBarToast } from "@/shared/lib";
import { CertificationCalendar } from "@/widgets/myBosal/certificationCalendar";
import { MyRoomPanel } from "@/widgets/myBosal/myRoomPanel";
import { SettingsList } from "@/widgets/myBosal/settingsList";

/** 내 보살 탭이에요. 고른 방의 내 보살과 인증 캘린더, 사용자 설정을 보여줘요. */
const MyBosalPage = () => {
  const me = useMeQuery();
  const roomId = Number(useParams().roomId);
  const navigate = useNavigate();
  const openToast = useTabBarToast();

  // 🔖 로딩·에러 시안이 없어 아직 아무것도 그리지 않아요.
  if (!me.data) return null;

  const room = me.data.rooms.find(item => item.roomId === roomId);
  // 나갔거나 없는 방이면 진입 분기로 보내요.
  if (!room) return <Navigate to={paths.root} replace />;

  return (
    <main className="min-h-svh bg-(--adaptiveBackground)">
      <MyRoomPanel
        rooms={me.data.rooms}
        room={room}
        canCreateRoom={me.data.canCreateRoom}
        onSelectRoom={id => navigate(paths.room.my(id), { replace: true })}
        // 🔖 방 만들기(/rooms/new)와 약관 화면은 각 이슈에서 연결해요.
        onCreateRoom={() => openToast("방 만들기는 준비 중이에요")}
      />
      {/* 방을 바꾸면 보던 달을 이번 달로 되돌려요. */}
      <CertificationCalendar key={roomId} roomId={roomId} />
      <Border variant="height16" height="12px" />
      <SettingsList
        me={me.data}
        onOpenTerms={() => openToast("이용약관은 준비 중이에요")}
        onOpenPrivacy={() => openToast("개인정보처리방침은 준비 중이에요")}
      />
    </main>
  );
};

export default MyBosalPage;
