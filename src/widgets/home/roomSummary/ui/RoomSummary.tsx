import { Button, Paragraph, Tab, Top } from "@toss/tds-mobile";

import { MIN_RICE_MEMBERS, RicePotGauge, type TodayResponse } from "@/entities/room";
import type { MyRoom } from "@/entities/session";
import { MIN_VOTERS } from "@/entities/vote";
import { useCopyInviteLink } from "@/features/room/shareInvite";
import { useTabBarToast } from "@/shared/lib";

interface RoomSummaryProps {
  /** 참여 중인 방이에요. GET /api/users/me 의 rooms */
  rooms: MyRoom[];
  today: TodayResponse;
  onSelectRoom: (roomId: number) => void;
  onRoomInfo: () => void;
}

/** 홈 위쪽이에요. 참여 중인 방 탭, 방 제목, 친구 초대 안내(혼자일 때), 공양미 한 솥 진행 바를 보여줘요. */
const RoomSummary = ({ rooms, today, onSelectRoom, onRoomInfo }: RoomSummaryProps) => {
  const { room, pot } = today;
  const openToast = useTabBarToast();
  const { mutate: copyInviteLink, isPending: isCopying } = useCopyInviteLink(
    room.roomId,
    "home_card",
    openToast,
  );

  return (
    <section>
      {/* 방이 하나면 탭을 그리지 않아요(시안 "한팀일때"). */}
      {rooms.length > 1 && (
        <Tab
          size="small"
          onChange={index => onSelectRoom(rooms[index].roomId)}
          ariaLabel="참여 중인 방"
        >
          {rooms.map(item => (
            <Tab.Item
              key={item.roomId}
              selected={item.roomId === room.roomId}
              // 안 본 결과나 한 솥 축하가 있으면 빨간 점을 보여줘요.
              redBean={item.hasUnseen}
            >
              {item.name}
            </Tab.Item>
          ))}
        </Tab>
      )}
      <Top
        // 시안은 제목 아래 16px 뒤에 진행 바가 와요. TDS 기본 아래 여백(24px)을 줄여 맞춰요.
        lowerGap={16}
        title={<Top.TitleParagraph size={28}>{room.name}</Top.TitleParagraph>}
        subtitleTop={
          <Top.SubtitleParagraph typography="t7" color="var(--adaptiveGreyOpacity700)">
            오늘도 함께 참는 중
          </Top.SubtitleParagraph>
        }
        right={
          <Top.RightButton size="small" color="dark" variant="weak" onClick={onRoomInfo}>
            방 정보
          </Top.RightButton>
        }
      />
      {room.memberCount < MIN_RICE_MEMBERS && (
        <div className="flex flex-col gap-[22px] px-5 pt-[11px] pb-[18px]">
          <div className="flex flex-col gap-[11px] px-5 text-center">
            <Paragraph typography="t6" fontWeight="semibold" color="var(--adaptiveGreyOpacity800)">
              친구가 들어오면 공양미가 쌓여요.
            </Paragraph>
            <Paragraph typography="t7" fontWeight="semibold" color="var(--adaptiveGrey400)">
              {`${MIN_RICE_MEMBERS}명부터 인증·투표 공양미가 쌓이고, ${MIN_VOTERS}명부터 투표가 열려요.`}
            </Paragraph>
          </div>
          {/* 방을 만든 뒤 초대 화면과 같이 초대링크를 복사해요. */}
          <Button
            size="xlarge"
            color="dark"
            variant="weak"
            display="block"
            loading={isCopying}
            onClick={() => copyInviteLink()}
          >
            친구 초대하기
          </Button>
        </div>
      )}
      <RicePotGauge
        rice={pot.amount}
        capacity={pot.goalAmount}
        reward={pot.rewardAmount}
        days={room.daysTogether}
      />
    </section>
  );
};

export default RoomSummary;
