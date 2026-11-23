import { Border, Tab, Top } from "@toss/tds-mobile";

import type { MyRoom } from "@/entities/session";
import { LeaveRoomButton } from "@/features/room/leaveRoom";
import { RenameNicknameButton } from "@/features/room/renameNickname";

import { SettingIcon } from "../assets";
import BosalProfile from "./BosalProfile";

interface MyRoomPanelProps {
  /** 참여 중인 방이에요. GET /api/users/me 의 rooms */
  rooms: MyRoom[];
  /** 지금 보고 있는 방이에요. */
  room: MyRoom;
  /** 빠진 나발 번호예요. GET /api/users/me 의 nabal.fallenNumbers */
  fallenHairs: readonly number[];
  /** 참여 중인 방이 2개 미만이면 "+ 새 방" 탭을 보여줘요. */
  canCreateRoom: boolean;
  onSelectRoom: (roomId: number) => void;
  onCreateRoom: () => void;
  onOpenSettings: () => void;
}

/** 내 보살 위쪽이에요. 방 탭, 이 방의 내 보살, 닉네임 수정과 나가기 버튼을 보여줘요. */
const MyRoomPanel = ({
  rooms,
  room,
  fallenHairs,
  canCreateRoom,
  onSelectRoom,
  onCreateRoom,
  onOpenSettings,
}: MyRoomPanelProps) => (
  <section>
    {/* 시안은 탭이 Top 시작에서 112.5px 아래에 있어요. TDS 부제목 줄(25.5px)이 시안(23.5px)보다 높아서 기본 아래 여백 24px에서 2px를 줄여요. */}
    <Top
      lowerGap={22}
      title={
        <Top.TitleParagraph size={28} color="var(--adaptiveGrey900)">
          내 보살
        </Top.TitleParagraph>
      }
      subtitleBottom={
        <Top.SubtitleParagraph typography="t5" fontWeight="regular">
          내 캐릭터와 기록을 확인해요.
        </Top.SubtitleParagraph>
      }
      right={
        // 아이콘은 24px이고 누르는 영역은 44px이에요. Top의 right는 오른쪽 여백이 없고 제목·부제목 가운데에
        // 놓여서, 위로 붙인 뒤 시안처럼 아이콘을 오른쪽 24px, 제목 줄 가운데에 맞춰요.
        <button
          type="button"
          aria-label="설정"
          className="-mt-0.75! mr-3.5! flex cursor-pointer appearance-none self-start border-0 bg-transparent p-2.5"
          onClick={onOpenSettings}
        >
          <SettingIcon aria-hidden className="size-6 text-(color:--adaptiveGrey400)" />
        </button>
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
    {/* 시안처럼 탭 아래에 화면 너비만큼 선이 있어요. */}
    <Border variant="full" />
    {/* 시안은 카드가 Top 시작에서 167px 아래예요. TDS 탭 높이가 시안(38px)과 달라 측정값으로 맞추고, 탭 아래 선(1px)만큼 줄여요. */}
    <div className="px-5 pt-4.25">
      <BosalProfile nickname={room.nickname} color={room.color} fallenHairs={fallenHairs} />
    </div>
    <div className="flex gap-2.5 px-5 py-4">
      <RenameNicknameButton roomId={room.roomId} roomName={room.name} nickname={room.nickname} />
      <LeaveRoomButton roomId={room.roomId} roomName={room.name} />
    </div>
  </section>
);

export default MyRoomPanel;
