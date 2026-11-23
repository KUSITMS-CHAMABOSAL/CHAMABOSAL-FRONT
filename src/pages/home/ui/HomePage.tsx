import { useLocation, useNavigate, useParams } from "react-router";

import { isRoomGoneError, RoomGoneDialog, useTodayQuery } from "@/entities/room";
import { useMeQuery } from "@/entities/session";
import { paths, type RoomHomeState } from "@/shared/config";
import { useTabBarToast } from "@/shared/lib";
import { EntryPopups } from "@/widgets/home/entryPopups";
import { RoomSummary } from "@/widgets/home/roomSummary";
import { TodayBosals } from "@/widgets/home/todayBosals";

/** 방 홈이에요. 내 방 목록과 고른 방의 오늘 탭을 받아 위젯에 넘겨요. */
const HomePage = () => {
  const me = useMeQuery();
  const roomId = Number(useParams().roomId);
  const today = useTodayQuery(roomId);
  const navigate = useNavigate();
  const location = useLocation();
  const isBackFromPotCelebration =
    (location.state as RoomHomeState | null)?.fromPotCelebration ?? false;
  const openToast = useTabBarToast();
  const selectRoom = (id: number) => navigate(paths.room.home(id), { replace: true });

  // 나갔거나 사라진 방이에요. 닫으면 방 목록을 다시 받아 진입 분기로 가요.
  const isRoomGone = isRoomGoneError(today.error);
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
            onRoomInfo={() => navigate(paths.room.info(roomId))}
          />
          {/* 방을 바꾸면 새로 그려요. 모아 둔 콕이 이전 방 ID로 전송되고, 캐러셀 위치와 찌른 횟수도 초기화돼요. */}
          <TodayBosals
            key={roomId}
            today={today.data}
            onCertify={() => navigate(paths.room.certify(roomId))}
            onEditCertification={() => navigate(paths.room.certifyEdit(roomId))}
          />
          <EntryPopups
            key={`popups-${roomId}`}
            today={today.data}
            isBackFromPotCelebration={isBackFromPotCelebration}
            // 상태를 지워 새로고침이나 뒤로가기로 다시 뜨지 않게 해요.
            onPotNoticeClose={() => navigate(location.pathname, { replace: true })}
            onCertify={() => navigate(paths.room.certify(roomId))}
            onRoomClosed={() => navigate(paths.root, { replace: true })}
            onError={openToast}
          />
        </>
      )}
      <RoomGoneDialog open={isRoomGone} onClose={leaveGoneRoom} />
    </main>
  );
};

export default HomePage;
