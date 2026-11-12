import { useNavigate, useParams } from "react-router";

import { useTodayQuery } from "@/entities/room";
import { useMeQuery } from "@/entities/session";
import { isApiError } from "@/shared/api";
import { paths } from "@/shared/config";
import { useTabBarToast } from "@/shared/lib";
import { RoomSummary } from "@/widgets/home/roomSummary";
import { TodayBosals } from "@/widgets/home/todayBosals";

import RoomGoneDialog from "./RoomGoneDialog";

/** 방 홈이에요. 내 방 목록과 고른 방의 오늘 탭을 받아 위젯에 넘겨요. */
const HomePage = () => {
  const me = useMeQuery();
  const roomId = Number(useParams().roomId);
  const today = useTodayQuery(roomId);
  const navigate = useNavigate();
  const openToast = useTabBarToast();
  const notReady = (label: string) => () => openToast(`${label}은 준비 중이에요`);
  const selectRoom = (id: number) => navigate(paths.room.home(id), { replace: true });

  // 나갔거나 사라진 방이에요. 닫으면 방 목록을 다시 받아 진입 분기로 가요.
  const isRoomGone = isApiError(today.error, "ROOM_005", "ROOM_002");
  const leaveGoneRoom = () => void me.refetch().then(() => navigate(paths.root, { replace: true }));

  // 🔖 로딩·에러·방 없음(첫 화면) 시안이 없어 아직 아무것도 그리지 않아요.
  if (!me.data || (!today.data && !isRoomGone)) return null;

  return (
    <main className="min-h-svh bg-(--adaptiveBackground)">
      {today.data && (
        <>
          <RoomSummary
            rooms={me.data.rooms}
            today={today.data}
            onSelectRoom={selectRoom}
            onRoomInfo={notReady("방 정보")}
            onInvite={notReady("친구 초대")}
          />
          {/* 방을 바꾸면 새로 그려요. 모아 둔 콕이 이전 방 ID로 전송되고, 캐러셀 위치와 찌른 횟수도 초기화돼요. */}
          <TodayBosals
            key={roomId}
            today={today.data}
            onCertify={notReady("인증")}
            onEditCertification={notReady("인증 수정")}
          />
        </>
      )}
      <RoomGoneDialog open={isRoomGone} onClose={leaveGoneRoom} />
    </main>
  );
};

export default HomePage;
