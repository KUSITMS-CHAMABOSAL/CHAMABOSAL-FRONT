import { BottomCTA, Paragraph, useToast } from "@toss/tds-mobile";

import { ROOM_GOAL_TITLE, type RoomGoal } from "@/entities/room";
import { CopyInviteLinkButton, useCopyInviteLink } from "@/features/room/shareInvite";

import cloud from "../assets/cloud.svg";
import temple from "../assets/temple.svg";

interface RoomCreatedProps {
  roomId: number;
  goal: RoomGoal;
  onGoToRoom: () => void;
}

/** 방을 만든 뒤 보는 화면이에요. 초대링크를 복사해 친구를 부르고 방으로 가요. */
const RoomCreated = ({ roomId, goal, onGoToRoom }: RoomCreatedProps) => {
  const { openToast } = useToast();
  const { mutate: copy, isPending } = useCopyInviteLink(roomId, (message, succeeded) =>
    // 시안처럼 [내 방으로 가기] 위에 띄워요.
    openToast(
      message,
      succeeded
        ? // 시안 아이콘과 같은 토스 아이콘이에요(초록 원 + 흰 체크).
          { icon: "icon-check-circle-green", higherThanCTA: true }
        : { higherThanCTA: true },
    ),
  );

  return (
    <main className="flex min-h-svh flex-col bg-linear-to-b from-(--adaptiveBackground) to-(--adaptiveGrey100) px-5 pt-6">
      {/* 그림 조각은 가운데를 기준으로 시안 위치에 둬요. 넓은 화면에서도 하늘만 늘어나요. */}
      <div className="relative h-[257px] shrink-0 overflow-hidden rounded-xl bg-[linear-gradient(to_bottom,var(--color-temple-sky-top),var(--color-temple-sky-mid)_83.65%,var(--color-temple-sky-bottom))]">
        <img
          src={cloud}
          alt=""
          width={199}
          height={134}
          className="pointer-events-none absolute top-12 left-[calc(50%-167.5px)] max-w-none"
        />
        <img
          src={cloud}
          alt=""
          width={199}
          height={134}
          className="pointer-events-none absolute -top-5.25 left-[calc(50%+2.5px)] max-w-none"
        />
        <img
          src={temple}
          alt=""
          width={247}
          height={184}
          className="pointer-events-none absolute top-18.25 left-[calc(50%-119.5px)] max-w-none"
        />
        <div className="absolute inset-x-0 top-37 flex justify-center">
          <Paragraph
            className="rounded-xl bg-(--adaptiveGrey800) px-1.75 py-1.5 shadow-[0_0_10px_rgb(0_0_0/0.25)]"
            typography="t7"
            fontWeight="semibold"
            color="var(--color-on-fill)"
          >
            {ROOM_GOAL_TITLE[goal]}
          </Paragraph>
        </div>
      </div>
      <div className="mt-5.5 flex flex-col items-center gap-4.5 text-center">
        <Paragraph typography="st5" fontWeight="bold" color="var(--adaptiveBlue600)">
          방이 만들어졌어요!
        </Paragraph>
        <Paragraph typography="t6" fontWeight="semibold" color="var(--adaptiveGrey600)">
          친구들을 초대하면 챌린지가 시작돼요.
        </Paragraph>
      </div>
      <div className="mt-5.5">
        <CopyInviteLinkButton isPending={isPending} onCopy={() => copy()} />
      </div>
      {/* 375×573에서도 스크롤이 생기지 않는 최소 여백이에요. */}
      <div aria-hidden className="min-h-7 grow" />
      {/* 작은 화면에서 버튼이 줄을 가리지 않도록 화면 흐름 안의 맨 아래에 둬요. */}
      <BottomCTA className="-mx-5 w-auto" background="none" onClick={onGoToRoom}>
        내 방으로 가기
      </BottomCTA>
    </main>
  );
};

export default RoomCreated;
