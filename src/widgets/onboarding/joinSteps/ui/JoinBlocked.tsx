import { BottomCTA, Paragraph } from "@toss/tds-mobile";

import { MAX_JOINED_ROOMS, type RoomSummary } from "@/entities/room";

import TempleCard from "./TempleCard";

/** 초대 링크로 들어갈 수 없는 이유예요. 미리보기의 `status`나 참여 요청의 오류에서 정해요. */
export type JoinBlockedReason = "ROOM_LIMIT" | "ROOM_FULL" | "UNAVAILABLE";

interface JoinBlockedProps {
  reason: JoinBlockedReason;
  /** `UNAVAILABLE`이면 서버가 방 정보를 주지 않아 이름표를 그리지 않아요. */
  room: RoomSummary | null;
  /** 방 2개면 첫 번째 방 홈, 나머지는 진입 분기로 가요. */
  onAction: () => void;
}

/** 초대 링크로 들어갈 수 없을 때 보는 화면이에요. 시안 1-6.1 방 2개, 1-6.2 들어갈 수 없는 방, 1-6.3 가득 참 */
const JoinBlocked = ({ reason, room, onAction }: JoinBlockedProps) => (
  <main className="flex min-h-svh flex-col bg-linear-to-b from-(--adaptiveBackground) to-(--adaptiveGrey100) px-5 pt-6">
    <TempleCard variant="closed" label={room?.goalTitle} />
    <div className="mt-5.75 flex flex-col items-center gap-4.5 text-center whitespace-pre-line">
      <Paragraph typography="st5" fontWeight="bold" color="var(--adaptiveGrey900)">
        {reason === "ROOM_LIMIT" ? (
          // 강조 색은 Paragraph.Text로 나눠 칠해요. span과 br을 섞으면 줄이 겹쳐요.
          <>
            <Paragraph.Text>참여중인 방이 </Paragraph.Text>
            <Paragraph.Text color="var(--adaptiveBlue600)">{`${MAX_JOINED_ROOMS}개`}</Paragraph.Text>
            <Paragraph.Text>{"예요.\n하나를 나가야 들어갈 수 있어요."}</Paragraph.Text>
          </>
        ) : reason === "ROOM_FULL" ? (
          "방이 가득 찼어요."
        ) : (
          "들어갈 수 없는 방이에요."
        )}
      </Paragraph>
      <Paragraph typography="t6" fontWeight="semibold" color="var(--adaptiveGrey600)">
        {reason === "ROOM_LIMIT"
          ? "내 보살에서 참여중인 방을 확인하고 정리해주세요.\n방을 정리한 뒤 받은 링크로 다시 들어와 주세요."
          : reason === "ROOM_FULL"
            ? `이 방은 ${room?.memberCount ?? ""}명이 모두 모였어요.\n새 방을 만들어 친구를 초대해보세요.`
            : "이 방에는 다시 참여할 수 없어요."}
      </Paragraph>
    </div>
    <div aria-hidden className="min-h-7 grow" />
    <BottomCTA className="-mx-5 w-auto" background="none" onClick={onAction}>
      {reason === "ROOM_LIMIT" ? "참여중인 방 관리하기" : "처음으로"}
    </BottomCTA>
  </main>
);

export default JoinBlocked;
