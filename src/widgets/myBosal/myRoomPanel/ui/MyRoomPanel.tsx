import { Tab, Top } from "@toss/tds-mobile";

import type { MyRoom } from "@/entities/session";
import { LeaveRoomButton } from "@/features/room/leaveRoom";
import { RenameNicknameButton } from "@/features/room/renameNickname";

import BosalProfile from "./BosalProfile";

interface MyRoomPanelProps {
  /** 참여 중인 방이에요. GET /api/users/me 의 rooms */
  rooms: MyRoom[];
  /** 지금 보고 있는 방이에요. */
  room: MyRoom;
  /** 참여 중인 방이 2개 미만이면 "+ 새 방" 탭을 보여줘요. */
  canCreateRoom: boolean;
  onSelectRoom: (roomId: number) => void;
  onCreateRoom: () => void;
}

/** 내 보살 위쪽이에요. 방 탭, 이 방의 내 보살, 닉네임 수정과 나가기 버튼을 보여줘요. */
const MyRoomPanel = ({
  rooms,
  room,
  canCreateRoom,
  onSelectRoom,
  onCreateRoom,
}: MyRoomPanelProps) => (
  <section>
    {/* 시안은 탭이 Top 시작에서 94px 아래에 있어요. TDS 부제목 줄 높이(25.5px)를 빼고 남는 간격이에요. */}
    <Top
      lowerGap={3.5}
      title={<Top.TitleParagraph size={28}>내 보살</Top.TitleParagraph>}
      subtitleBottom={
        <Top.SubtitleParagraph typography="t5">내 캐릭터와 기록을 확인해요.</Top.SubtitleParagraph>
      }
    />
    <Tab
      size="small"
      ariaLabel="참여 중인 방"
      onChange={index =>
        index < rooms.length ? onSelectRoom(rooms[index].roomId) : onCreateRoom()
      }
    >
      {/* Tab은 Tab.Item 배열만 받아서 "+ 새 방"도 같은 배열에 넣어요. */}
      {[
        ...rooms.map(item => (
          <Tab.Item key={item.roomId} selected={item.roomId === room.roomId}>
            {item.name}
          </Tab.Item>
        )),
        ...(canCreateRoom
          ? [
              <Tab.Item key="new" selected={false}>
                + 새 방
              </Tab.Item>,
            ]
          : []),
      ]}
    </Tab>
    <div className="px-5 pt-8.75">
      <BosalProfile nickname={room.nickname} color={room.color} />
    </div>
    <div className="flex gap-2.5 px-5 py-4">
      <RenameNicknameButton roomId={room.roomId} roomName={room.name} nickname={room.nickname} />
      <LeaveRoomButton roomId={room.roomId} roomName={room.name} />
    </div>
  </section>
);

export default MyRoomPanel;
