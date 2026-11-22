import { startTransition, useState } from "react";

import { useToast } from "@toss/tds-mobile";
import { Navigate, useLocation, useNavigate } from "react-router";

import { BOSAL_COLOR_NAME } from "@/entities/bosal";
import { useInvitePreviewQuery } from "@/entities/room";
import { useMeQuery } from "@/entities/session";
import { NicknameForm } from "@/features/onboarding/nicknameForm";
import { ServiceTour } from "@/features/onboarding/takeServiceTour";
import { useJoinRoom } from "@/features/room/joinRoom";
import { isApiError } from "@/shared/api";
import { paths } from "@/shared/config";
import type { BosalColor } from "@/shared/types";

import { useNeedsServiceTour } from "../model/useNeedsServiceTour";
import JoinBlocked, { type JoinBlockedReason } from "./JoinBlocked";
import InvitePreview from "./InvitePreview";
import ReceiveBosal from "./ReceiveBosal";

const isBosalColor = (value: unknown): value is BosalColor =>
  typeof value === "string" && Object.hasOwn(BOSAL_COLOR_NAME, value);

type Step =
  | { kind: "preview" }
  | { kind: "nickname" }
  | { kind: "bosal"; roomId: number; nickname: string; color: BosalColor }
  | { kind: "tour"; roomId: number };

/** 단계는 기록(location.state)에 둬요. 참여한 뒤 보살 받기는 새로고침해도 다시 그릴 수 있게 값을 함께 둬요. */
const getStep = (state: unknown): Step => {
  if (typeof state !== "object" || state === null || !("step" in state)) return { kind: "preview" };
  if (state.step === "nickname") return { kind: "nickname" };
  if (state.step === "tour" && "roomId" in state && typeof state.roomId === "number")
    return { kind: "tour", roomId: state.roomId };
  if (
    state.step === "bosal" &&
    "roomId" in state &&
    typeof state.roomId === "number" &&
    "nickname" in state &&
    typeof state.nickname === "string" &&
    "color" in state &&
    isBosalColor(state.color)
  )
    return {
      kind: "bosal",
      roomId: state.roomId,
      nickname: state.nickname,
      color: state.color,
    };
  return { kind: "preview" };
};

/** 참여 요청이 막히면 미리보기와 같은 참여 불가 화면을 보여줘요. */
const getBlockedReason = (error: unknown): JoinBlockedReason | null => {
  if (isApiError(error, "ROOM_001")) return "ROOM_LIMIT";
  if (isApiError(error, "ROOM_003")) return "ROOM_FULL";
  if (isApiError(error, "ROOM_006")) return "UNAVAILABLE";
  return null;
};

interface JoinRoomStepsProps {
  /** 초대 링크의 `code`예요. */
  token: string;
}

/**
 * 초대 미리보기 → 닉네임 → 내 보살 받기 → (처음이면 온보딩) 단계예요. 막히면 참여 불가 화면, 이미 멤버면 그 방 홈으로 가요.
 * 참여한 뒤에는 뒤로가기로 미리보기나 닉네임에 돌아가지 않고 그 방 홈으로 가요.
 */
const JoinRoomSteps = ({ token }: JoinRoomStepsProps) => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const preview = useInvitePreviewQuery(token);
  const me = useMeQuery();
  const { mutate: join, isPending } = useJoinRoom();
  const { openToast } = useToast();
  /** 이 화면에서 들어간 방이에요. */
  const [joinedRoomId, setJoinedRoomId] = useState<number>();
  /** 참여 요청이 막힌 이유예요. 미리보기 뒤에 상황이 바뀐 경우예요. */
  const [blockedBy, setBlockedBy] = useState<JoinBlockedReason>();
  /** 서버가 이미 쓰는 닉네임이라고 답한 값이에요. */
  const [takenNickname, setTakenNickname] = useState<string | null>(null);

  const step = getStep(state);
  const needsTour = useNeedsServiceTour(step.kind === "bosal" ? step.roomId : undefined);

  if (step.kind === "bosal") {
    return (
      <ReceiveBosal
        nickname={step.nickname}
        color={step.color}
        // 온보딩을 넣을지 알기 전에는 기다려요.
        isPending={needsTour === undefined}
        // 참여한 뒤라 보살 받기 기록은 온보딩이나 방 홈으로 바꿔, 뒤로가기로 다시 오지 않게 해요.
        onReceive={() =>
          needsTour
            ? navigate(paths.invite(token), {
                replace: true,
                state: { step: "tour", roomId: step.roomId },
              })
            : navigate(paths.room.home(step.roomId), { replace: true })
        }
      />
    );
  }

  // 참여한 뒤라 아래 '들어간 방' 분기보다 먼저 그려요.
  if (step.kind === "tour") {
    return (
      <ServiceTour onFinish={() => navigate(paths.room.home(step.roomId), { replace: true })} />
    );
  }

  if (joinedRoomId !== undefined) {
    return <Navigate to={paths.room.home(joinedRoomId)} replace />;
  }

  const goToEntry = () => navigate(paths.root, { replace: true });

  // 링크에 초대 코드가 없으면 물어볼 것도 없이 들어갈 수 없는 방이에요.
  if (token === "") return <JoinBlocked reason="UNAVAILABLE" room={null} onAction={goToEntry} />;

  if (preview.error) throw preview.error;
  // 🔖 로딩 시안이 없어 아직 아무것도 그리지 않아요.
  if (!preview.data) return null;

  const { status, room, previousNickname } = preview.data;

  if (status === "ALREADY_MEMBER" && room) {
    return <Navigate to={paths.room.home(room.roomId)} replace />;
  }

  const reason = blockedBy ?? (status === "JOINABLE" ? null : status);
  if (reason !== null && reason !== "ALREADY_MEMBER") {
    const firstRoomId = me.data?.rooms[0]?.roomId;
    return (
      <JoinBlocked
        reason={reason}
        // 참여 요청에서 들어갈 수 없다고 하면 미리보기 때 받은 방 정보도 보여주지 않아요.
        room={reason === "UNAVAILABLE" ? null : room}
        onAction={() =>
          navigate(
            reason === "ROOM_LIMIT" && firstRoomId !== undefined
              ? paths.room.home(firstRoomId)
              : paths.root,
            { replace: true },
          )
        }
      />
    );
  }

  // JOINABLE이면 room이 있어요. 없으면 들어갈 수 없는 방으로 봐요.
  if (!room) {
    return <JoinBlocked reason="UNAVAILABLE" room={null} onAction={goToEntry} />;
  }

  if (step.kind === "preview") {
    return (
      <InvitePreview
        room={room}
        inviterNickname={preview.data.inviterNickname}
        onJoin={() => navigate(paths.invite(token), { state: { step: "nickname" } })}
      />
    );
  }

  return (
    <NicknameForm
      // 나간 지 6개월이 안 된 방이면 예전 닉네임을 채워 둬요.
      initialNickname={previousNickname ?? undefined}
      takenNickname={takenNickname}
      isPending={isPending}
      onSubmit={nickname =>
        join(
          { token, nickname },
          {
            onSuccess: joined =>
              // 라우터 이동은 전환으로 반영돼요. 들어간 방 기록도 같은 전환에 넣어야
              // 보살 받기로 바뀌기 전에 홈으로 보내는 분기가 먼저 그려지지 않아요.
              startTransition(() => {
                setJoinedRoomId(joined.roomId);
                // 닉네임 기록을 보살 받기로 바꿔서, 앞으로 가기로 닉네임에 다시 오지 않게 해요.
                void navigate(paths.invite(token), {
                  replace: true,
                  state: {
                    step: "bosal",
                    roomId: joined.roomId,
                    nickname: joined.nickname,
                    color: joined.color,
                  },
                });
              }),
            onError: error => {
              if (isApiError(error, "ROOM_004")) return setTakenNickname(nickname);
              const blocked = getBlockedReason(error);
              if (blocked) return setBlockedBy(blocked);
              openToast("방에 들어가지 못했어요. 잠시 후 다시 시도해 주세요.");
            },
          },
        )
      }
    />
  );
};

export default JoinRoomSteps;
