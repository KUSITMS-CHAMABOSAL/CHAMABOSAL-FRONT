import { Border, BottomCTA, Paragraph, TableRow } from "@toss/tds-mobile";

import { ROOM_GOAL_LABEL, type RoomSummary } from "@/entities/room";

const RowTitle = ({ children }: { children: string }) => (
  <Paragraph typography="st10" fontWeight="bold" color="var(--adaptiveGrey900)">
    {children}
  </Paragraph>
);

const RowValue = ({ children }: { children: string }) => (
  <Paragraph typography="st10" color="var(--adaptiveGreyOpacity700)">
    {children}
  </Paragraph>
);

interface InvitePreviewProps {
  room: RoomSummary;
  onJoin: () => void;
}

/**
 * 초대 링크로 들어온 사람이 보는 방 소개예요. 시안 1-1의 봉투가 열린 뒤 모습이에요.
 * 🔖 봉투가 열리는 애니메이션(덮개, "○○님의 초대" 배지)은 다음 작업에서 붙여요.
 */
const InvitePreview = ({ room, onJoin }: InvitePreviewProps) => (
  <main className="flex min-h-svh flex-col bg-white bg-[linear-gradient(to_bottom,var(--adaptiveBlue100),var(--color-invite-mint)_44.23%,var(--color-invite-mint-light))]">
    <div className="flex grow items-center justify-center px-5 py-6">
      <div className="flex h-[174px] w-[299px] flex-col items-center justify-center gap-4.5 rounded-2xl bg-(--adaptiveBackground) px-5 text-center whitespace-pre-line shadow-[0_0_12px_rgb(167_167_167/0.25)]">
        <Paragraph typography="st5" fontWeight="bold" color="var(--adaptiveGreen700)">
          {room.goalTitle}
        </Paragraph>
        <Paragraph typography="t6" fontWeight="semibold" color="var(--adaptiveGrey600)">
          {room.goalDescription}
        </Paragraph>
      </div>
    </div>
    <section className="flex shrink-0 flex-col rounded-t-3xl bg-(--adaptiveBackground) pt-13 shadow-[0_-1px_3px_rgb(0_27_55/0.1)]">
      {/* TableRow는 기본이 li라 목록 밖에서는 div로 그려요. */}
      <TableRow
        as="div"
        align="space-between"
        left={<RowTitle>참여 목표</RowTitle>}
        right={<RowValue>{ROOM_GOAL_LABEL[room.goal]}</RowValue>}
      />
      {/* Border는 flex 안에서 너비가 0으로 줄어서 블록으로 감싸요. */}
      <div className="my-1.5">
        <Border variant="full" />
      </div>
      <TableRow
        as="div"
        align="space-between"
        left={<RowTitle>함께 하는 보살</RowTitle>}
        right={<RowValue>{`${room.memberCount}명`}</RowValue>}
      />
      {/* 시안은 표와 버튼 사이가 101px이에요. 작은 화면에서는 줄어들어요. */}
      <div aria-hidden className="min-h-6 shrink basis-[101px]" />
      <BottomCTA background="none" onClick={onJoin}>
        참여하기
      </BottomCTA>
    </section>
  </main>
);

export default InvitePreview;
