import { useState } from "react";

import { FixedBottomCTA, NumericSpinner, Paragraph, TextField, Top } from "@toss/tds-mobile";

import { MAX_MEMBERS, MIN_RICE_MEMBERS, type RoomGoal } from "@/entities/room";
import { MIN_VOTERS } from "@/entities/vote";
import { limitLength } from "@/shared/lib";

import {
  DEFAULT_POT_GOAL,
  RICE_MEMBERS_HINT,
  ROOM_NAME_MAX_LENGTH,
  VOTERS_HINT,
} from "../config/form";
import { isSubmittableRoomName, sanitizeRoomName } from "../lib/roomName";
import type { RoomDraft } from "../model/types";
import GoalSelector from "./GoalSelector";
import PotGoalSlider from "./PotGoalSlider";

interface CreateRoomFormProps {
  /** 방을 만드는 요청을 보내는 중이에요. */
  isPending: boolean;
  onSubmit: (draft: RoomDraft) => void;
}

/** 방 만들기 첫 화면이에요. 목표, 방 이름, 인원, 목표 공양미를 정해요. */
const CreateRoomForm = ({ isPending, onSubmit }: CreateRoomFormProps) => {
  const [goal, setGoal] = useState<RoomGoal>("DELIVERY");
  const [name, setName] = useState("");
  const [memberLimit, setMemberLimit] = useState(MIN_RICE_MEMBERS);
  const [potGoalAmount, setPotGoalAmount] = useState(DEFAULT_POT_GOAL);

  return (
    <main className="flex flex-col gap-4 pb-6">
      <Top
        title={
          <Top.TitleParagraph size={28} color="var(--adaptiveGrey900)">
            어떤 유혹을
            <br />
            같이 참아볼까요?
          </Top.TitleParagraph>
        }
      />
      <GoalSelector value={goal} onChange={setGoal} />
      {/* TDS 입력칸 라벨(13px) 대신 다른 항목 제목과 같은 15px로 그려요. */}
      <section className="flex flex-col gap-1.5 pt-3">
        <Paragraph
          id="room-name-label"
          className="px-5!"
          typography="t6"
          fontWeight="semibold"
          color="var(--adaptiveGrey800)"
        >
          방 이름
        </Paragraph>
        {/* TDS 입력칸은 라벨이 없어도 위 여백(16)을 둬서, 라벨과 붙도록 그만큼 끌어올려요. */}
        <div className="-mt-4">
          <TextField
            variant="box"
            aria-labelledby="room-name-label"
            value={name}
            help={`${name.length}/${ROOM_NAME_MAX_LENGTH}`}
            onChange={event =>
              setName(
                limitLength(sanitizeRoomName(event.target.value), ROOM_NAME_MAX_LENGTH, event),
              )
            }
            onCompositionEnd={() => setName(prev => prev.slice(0, ROOM_NAME_MAX_LENGTH))}
          />
        </div>
      </section>
      <section className="flex flex-col px-5 pt-4 pb-2">
        <Paragraph typography="t6" fontWeight="semibold" color="var(--adaptiveGrey800)">
          함께할 인원
        </Paragraph>
        <Paragraph className="mt-1.5!" typography="t7" color="var(--adaptiveGrey600)">
          {`공양미 목표 설정을 돕기 위한 정보로, 최대 ${MAX_MEMBERS}명까지 함께할 수 있어요. 인원이 많아질 수록 새로운 기능이 열려요.`}
        </Paragraph>
        <NumericSpinner
          className="mt-4 self-start"
          size="medium"
          number={memberLimit}
          minNumber={MIN_RICE_MEMBERS}
          maxNumber={MAX_MEMBERS}
          onNumberChange={setMemberLimit}
          a11yProps={{ minusButtonAriaLabel: "인원 줄이기", plusButtonAriaLabel: "인원 늘리기" }}
        />
        <Paragraph
          className="mt-1.5!"
          typography="t7"
          fontWeight="bold"
          color="var(--adaptiveBlue500)"
        >
          {memberLimit < MIN_VOTERS ? RICE_MEMBERS_HINT : VOTERS_HINT}
        </Paragraph>
      </section>
      <PotGoalSlider value={potGoalAmount} memberLimit={memberLimit} onChange={setPotGoalAmount} />
      {/* 슬라이더 아래 툴팁이 버튼에 가리지 않도록 아래 여백을 둬요. */}
      <div aria-hidden className="h-16" />
      <FixedBottomCTA
        disabled={!isSubmittableRoomName(name)}
        loading={isPending}
        onClick={() => onSubmit({ goal, name: name.trim(), memberLimit, potGoalAmount })}
      >
        방 만들기
      </FixedBottomCTA>
    </main>
  );
};

export default CreateRoomForm;
