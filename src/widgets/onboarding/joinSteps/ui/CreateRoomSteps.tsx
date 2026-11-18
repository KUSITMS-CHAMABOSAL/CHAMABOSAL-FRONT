import { startTransition, useState } from "react";

import { useToast } from "@toss/tds-mobile";
import { Navigate, useLocation, useNavigate } from "react-router";

import { MAX_JOINED_ROOMS, ROOM_GOALS, type RoomGoal, useNewColorQuery } from "@/entities/room";
import { NicknameForm } from "@/features/onboarding/nicknameForm";
import { CreateRoomForm, useCreateRoom } from "@/features/room/createRoom";
import { isApiError } from "@/shared/api";
import { paths } from "@/shared/config";

import ReceiveBosal from "./ReceiveBosal";
import RoomCreated from "./RoomCreated";

type Step =
  | { kind: "nickname" }
  | { kind: "bosal" }
  | { kind: "form" }
  | { kind: "created"; roomId: number; goal: RoomGoal };

const isGoal = (value: unknown): value is RoomGoal =>
  typeof value === "string" && (ROOM_GOALS as readonly string[]).includes(value);

/** 단계는 기록(location.state)에 둬요. 만든 방은 새로고침해도 초대 화면을 다시 그릴 수 있게 함께 둬요. */
const getStep = (state: unknown): Step => {
  if (typeof state !== "object" || state === null || !("step" in state))
    return { kind: "nickname" };
  if (state.step === "bosal" || state.step === "form") return { kind: state.step };
  if (
    state.step === "created" &&
    "roomId" in state &&
    typeof state.roomId === "number" &&
    "goal" in state &&
    isGoal(state.goal)
  )
    return { kind: "created", roomId: state.roomId, goal: state.goal };
  return { kind: "nickname" };
};

/**
 * 닉네임 → 내 보살 받기 → 방 만들기 → 초대 공유 단계예요. 단계를 기록에 남겨 토스 뒤로가기로 이전 단계에 돌아가요.
 * 보살 색은 들어오자마자 뽑아 두고, 보살 받기에서 보여준 색을 방을 만들 때 그대로 보내요.
 * 방을 만든 뒤에는 뒤로가기로 만들기 단계에 돌아가지 않고 그 방 홈으로 가요.
 */
const CreateRoomSteps = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [nickname, setNickname] = useState<string>();
  /** 이 화면에서 만든 방이에요. 초대 화면에서 뒤로가면 만들기 단계 대신 이 방으로 보내요. */
  const [createdRoomId, setCreatedRoomId] = useState<number>();
  // 실패한 뒤 다시 뽑는 동안에도 버튼이 로딩으로 기다리도록 isFetching을 봐요.
  const { data: drawn, isFetching: isDrawing, refetch: drawAgain } = useNewColorQuery();
  const { mutate: create, isPending } = useCreateRoom();
  const { openToast } = useToast();

  const step = getStep(state);

  if (step.kind === "created") {
    return (
      <RoomCreated
        roomId={step.roomId}
        goal={step.goal}
        onGoToRoom={() => navigate(paths.room.home(step.roomId), { replace: true })}
      />
    );
  }

  if (createdRoomId !== undefined) {
    return <Navigate to={paths.room.home(createdRoomId)} replace />;
  }

  // 새로고침으로 닉네임을 잃었거나 색을 아직 못 받았으면 닉네임부터 다시 해요.
  if (step.kind === "nickname" || nickname === undefined || drawn === undefined) {
    return (
      <NicknameForm
        initialNickname={nickname}
        // 색을 받기 전에는 버튼이 로딩으로 기다려요.
        isPending={isDrawing}
        onSubmit={next => {
          setNickname(next);
          if (drawn === undefined) {
            openToast("보살을 데려오지 못했어요. 잠시 후 다시 시도해 주세요.");
            void drawAgain();
            return;
          }
          navigate(paths.createRoom, { state: { step: "bosal" } });
        }}
      />
    );
  }

  if (step.kind === "bosal") {
    return (
      <ReceiveBosal
        nickname={nickname}
        color={drawn.color}
        onReceive={() => navigate(paths.createRoom, { state: { step: "form" } })}
      />
    );
  }

  return (
    <CreateRoomForm
      isPending={isPending}
      onSubmit={draft =>
        create(
          { ...draft, nickname, color: drawn.color },
          {
            onSuccess: ({ roomId }) => {
              // 라우터 이동은 전환으로 반영돼요. 만든 방 기록도 같은 전환에 넣어야
              // 초대 화면으로 바뀌기 전에 홈으로 보내는 분기가 먼저 그려지지 않아요.
              startTransition(() => {
                setCreatedRoomId(roomId);
                // 폼 기록을 초대 화면으로 바꿔서, 앞으로 가기로 폼에 다시 오지 않게 해요.
                void navigate(paths.createRoom, {
                  replace: true,
                  state: { step: "created", roomId, goal: draft.goal },
                });
              });
            },
            onError: error =>
              openToast(
                isApiError(error, "ROOM_001")
                  ? `참여 중인 방이 ${MAX_JOINED_ROOMS}개라 방을 더 만들 수 없어요.`
                  : "방을 만들지 못했어요. 잠시 후 다시 시도해 주세요.",
              ),
          },
        )
      }
    />
  );
};

export default CreateRoomSteps;
