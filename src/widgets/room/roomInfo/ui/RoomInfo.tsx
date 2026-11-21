import { useState } from "react";

import { Paragraph, useToast } from "@toss/tds-mobile";

import { BosalHead } from "@/entities/bosal";
import type { TodayMember, TodayResponse } from "@/entities/room";
import { KickMemberDialog, useKickMember } from "@/features/room/kickMember";
import { LeaveRoomButton } from "@/features/room/leaveRoom";
import { CopyInviteLinkButton, useCopyInviteLink } from "@/features/room/shareInvite";
import { isApiError } from "@/shared/api";
import { cn } from "@/shared/lib";

import { ArrowLeftIcon } from "../assets";
import MemberSheet from "./MemberSheet";

interface RoomInfoProps {
  today: TodayResponse;
}

/**
 * 방 정보예요(시안 3-2). 함께하는 보살의 이번 달 기록, 친구 초대, 방 나가기를 보여줘요.
 * 방장은 다른 멤버를 눌러 시트에서 내보낼 수 있어요.
 */
const RoomInfo = ({ today }: RoomInfoProps) => {
  const { roomId, name, isOwner } = today.room;
  const { openToast } = useToast();
  const { mutate: copyInviteLink, isPending: isCopying } = useCopyInviteLink(roomId, message =>
    openToast(message),
  );
  const { mutate: kick, isPending: isKicking } = useKickMember(roomId);
  /** 시트가 닫히는 동안에도 내용이 남도록 마지막으로 고른 멤버를 들고 있어요. */
  const [selected, setSelected] = useState<TodayMember | null>(null);
  const [step, setStep] = useState<"closed" | "sheet" | "confirm">("closed");

  const confirmKick = () => {
    if (!selected) return;
    kick(selected.memberId, {
      onSuccess: () => setStep("closed"),
      onError: error => {
        setStep("closed");
        // 🔖 실패 문구 시안이 없어요. 투표 중(ROOM_008)만 이유를 알려요.
        openToast(
          isApiError(error, "ROOM_008")
            ? "투표 중에는 내보낼 수 없어요"
            : "내보내지 못했어요. 잠시 후 다시 시도해 주세요",
        );
      },
    });
  };

  return (
    <main className="flex min-h-svh flex-col bg-(--adaptiveBackground) pb-10">
      {/* 뒤로 가기는 토스 내비게이션 바의 버튼을 써요. */}
      <header className="flex h-11 items-center px-5">
        <Paragraph typography="t5" fontWeight="bold" color="var(--adaptiveGrey900)">
          {name}
        </Paragraph>
      </header>

      <Paragraph
        typography="t6"
        fontWeight="semibold"
        color="var(--adaptiveGreyOpacity800)"
        className="mt-4.5 px-5"
      >
        함께하는 보살
      </Paragraph>
      <ul role="list" className="m-0! mt-5! p-0!">
        {today.members.map(member => {
          // 방장만 다른 멤버를 내보낼 수 있어요. 나는 누르지 않아요.
          const canKick = isOwner && !member.isMe;
          return (
            <li
              key={member.memberId}
              className="list-none border-0 border-b border-solid border-(--adaptiveGreyOpacity200)"
            >
              <button
                type="button"
                disabled={!canKick}
                onClick={() => {
                  setSelected(member);
                  setStep("sheet");
                }}
                className={cn(
                  "flex h-[85px] w-full appearance-none items-center gap-4.75 rounded-none! border-0! bg-transparent! p-0 pl-5.75 text-left [-webkit-tap-highlight-color:transparent]",
                  canKick ? "cursor-pointer" : "cursor-default",
                )}
              >
                <BosalHead color={member.color} className="size-15 shrink-0" />
                <div className="flex min-w-0 items-center gap-[11px]">
                  <Paragraph
                    typography="t5"
                    fontWeight="bold"
                    color="var(--adaptiveGrey900)"
                    className="w-[67px] shrink-0 truncate"
                  >
                    {member.nickname}
                  </Paragraph>
                  <Stat value={`${member.monthlyEnduredCount}회`} label="이번달 참은 횟수" />
                  <Stat value={`${member.monthlyPickedCount}번`} label="이번달 지목" />
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-16 flex flex-col gap-3 px-5">
        <CopyInviteLinkButton
          isPending={isCopying}
          onCopy={() => copyInviteLink()}
          className="bg-(--adaptiveGrey50)"
        />
        <LeaveRoomButton roomId={roomId} roomName={name}>
          {open => (
            <button
              type="button"
              onClick={open}
              className="flex h-14 w-full appearance-none items-center gap-5.75 rounded-xl! border-0 bg-(--adaptiveRed50) pl-4.75 text-left"
            >
              <ArrowLeftIcon aria-hidden className="shrink-0" />
              <Paragraph typography="t5" color="var(--adaptiveRed600)">
                방 나가기
              </Paragraph>
            </button>
          )}
        </LeaveRoomButton>
      </div>

      <MemberSheet
        member={selected}
        open={step === "sheet"}
        roomName={name}
        onClose={() => setStep("closed")}
        onKick={() => setStep("confirm")}
      />
      <KickMemberDialog
        open={step === "confirm"}
        isPending={isKicking}
        onClose={() => setStep("closed")}
        onConfirm={confirmKick}
      />
    </main>
  );
};

const Stat = ({ value, label }: { value: string; label: string }) => (
  <div className="flex w-[91px] shrink-0 flex-col gap-3 last:w-16">
    <Paragraph typography="t6" fontWeight="semibold" color="var(--adaptiveGreyOpacity700)">
      {value}
    </Paragraph>
    <Paragraph typography="st12" color="var(--adaptiveGreyOpacity500)">
      {label}
    </Paragraph>
  </div>
);

export default RoomInfo;
