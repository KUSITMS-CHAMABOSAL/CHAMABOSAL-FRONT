import { Tab } from "@toss/tds-mobile";

import type { MyRoom } from "@/entities/session";

interface RoomTabsProps {
  rooms: MyRoom[];
  roomId: number;
  onSelectRoom: (roomId: number) => void;
}

/** 참여 중인 방 탭이에요. 홈 위쪽 방 탭과 같아요. 방이 하나면 그리지 않아요. */
const RoomTabs = ({ rooms, roomId, onSelectRoom }: RoomTabsProps) => {
  if (rooms.length < 2) return null;
  return (
    <Tab
      size="small"
      onChange={index => onSelectRoom(rooms[index].roomId)}
      ariaLabel="참여 중인 방"
    >
      {rooms.map(item => (
        <Tab.Item
          key={item.roomId}
          selected={item.roomId === roomId}
          // 안 본 결과나 한 솥 축하가 있으면 빨간 점을 보여줘요.
          redBean={item.hasUnseen}
        >
          {item.name}
        </Tab.Item>
      ))}
    </Tab>
  );
};

export default RoomTabs;
