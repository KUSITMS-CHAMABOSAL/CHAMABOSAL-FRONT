import { useState } from "react";

import { useToast } from "@toss/tds-mobile";
import { useLocation, useNavigate } from "react-router";

import { useNewColorQuery } from "@/entities/room";
import { NicknameForm } from "@/features/onboarding/nicknameForm";
import { CreateRoomForm, useCreateRoom } from "@/features/room/createRoom";
import { isApiError } from "@/shared/api";
import { paths } from "@/shared/config";

type Step = "nickname" | "form";

const getStep = (state: unknown): Step =>
  typeof state === "object" && state !== null && "step" in state && state.step === "form"
    ? "form"
    : "nickname";

/**
 * 닉네임 → 방 만들기 단계예요. 단계를 기록에 남겨 토스 뒤로가기로 이전 단계에 돌아가요.
 * 보살 색은 들어오자마자 뽑아 두고 방을 만들 때 함께 보내요.
 * 🔖 닉네임과 폼 사이의 보살 받기, 방을 만든 뒤의 초대 공유는 다음 작업에서 붙여요.
 * 지금은 방을 만들면 그 방 홈으로 가요.
 */
const CreateRoomSteps = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [nickname, setNickname] = useState<string>();
  const { data: drawn } = useNewColorQuery();
  const { mutate: create, isPending } = useCreateRoom();
  const { openToast } = useToast();

  if (getStep(state) === "nickname" || nickname === undefined) {
    return (
      <NicknameForm
        initialNickname={nickname}
        isPending={false}
        onSubmit={next => {
          setNickname(next);
          navigate(paths.createRoom, { state: { step: "form" } });
        }}
      />
    );
  }

  return (
    <CreateRoomForm
      // 색을 아직 못 받았으면 받을 때까지 버튼이 로딩으로 기다려요.
      isPending={isPending || drawn === undefined}
      onSubmit={draft =>
        drawn &&
        create(
          { ...draft, nickname, color: drawn.color },
          {
            onSuccess: ({ roomId }) => navigate(paths.room.home(roomId), { replace: true }),
            onError: error =>
              openToast(
                isApiError(error, "ROOM_001")
                  ? "참여 중인 방이 2개라 방을 더 만들 수 없어요."
                  : "방을 만들지 못했어요. 잠시 후 다시 시도해 주세요.",
              ),
          },
        )
      }
    />
  );
};

export default CreateRoomSteps;
