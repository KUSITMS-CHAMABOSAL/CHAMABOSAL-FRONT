import { useEffect, useState } from "react";
import { Button, FixedBottomCTA, TextArea, Top } from "@toss/tds-mobile";

import {
  type CertificationCreateResponse,
  CertifyConfirmSheet,
  PhotoField,
  usePhotoUpload,
} from "@/features/certification/submitCertification";
import {
  isValidMemo,
  SPENT_AMOUNT_MAX,
  SPENT_AMOUNT_MIN,
  sliceMemo,
} from "@/entities/certification";
import type { TodayResponse } from "@/entities/room";
import { cn } from "@/shared/lib";
import type { CertificationResult } from "@/shared/types";

import endureBosal from "../assets/illustration_endure_bosal.svg";
import giveUpBosal from "../assets/illustration_give_up_bosal.svg";
import AmountField from "./AmountField";

interface CertifyFormProps {
  roomId: number;
  today: TodayResponse;
  result: CertificationResult;
  onChangeResult: (result: CertificationResult) => void;
  onSubmitted: (response: CertificationCreateResponse) => void;
  /** 이미 인증했거나 인증 시간이 아니에요. */
  onUnavailable: () => void;
}

/** 시안 메모: 800ms 지연 후 다음 화면으로 디졸브 */
const INTRO_DELAY_MS = 800;

const RESULT_OPTIONS = [
  { value: "FAILED", label: "못 참았어요", color: "danger" },
  { value: "ENDURED", label: "참았어요", color: "primary" },
] as const;

const isValidAmount = (amount: number | null) =>
  amount !== null && amount >= SPENT_AMOUNT_MIN && amount <= SPENT_AMOUNT_MAX;

/**
 * 인증 작성 폼이에요. 고른 결과의 보살을 잠깐 보여준 뒤 제목과 폼으로 디졸브해요.
 * 사진은 선택이고, 한 줄 기록과 (못 참았으면) 쓴 금액을 채우면 [인증하기]가 켜져요.
 */
const CertifyForm = ({
  roomId,
  today,
  result,
  onChangeResult,
  onSubmitted,
  onUnavailable,
}: CertifyFormProps) => {
  const [isIntro, setIsIntro] = useState(true);
  const [memo, setMemo] = useState("");
  const [amount, setAmount] = useState<number | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { photo, pick, remove } = usePhotoUpload();
  const isFailed = result === "FAILED";

  useEffect(() => {
    const timer = setTimeout(() => setIsIntro(false), INTRO_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const canSubmit =
    isValidMemo(memo) &&
    (!isFailed || isValidAmount(amount)) &&
    photo.status !== "uploading" &&
    photo.status !== "failed";

  return (
    <main className="min-h-svh bg-(--adaptiveBackground)">
      {/* 보살과 제목을 한 칸에 겹쳐요. 보살 칸이 줄어들며 사라지면 제목이 나타나고 폼이 따라 올라와요. */}
      <div className="grid">
        <Top
          className={cn(
            "transition-opacity duration-500 [grid-area:1/1] motion-reduce:transition-none",
            isIntro && "opacity-0",
          )}
          subtitleTop={<Top.SubtitleParagraph size={13}>오늘의 번뇌 기록</Top.SubtitleParagraph>}
          title={<Top.TitleParagraph size={28}>번뇌 떠올리기</Top.TitleParagraph>}
          subtitleBottom={<Top.SubtitleParagraph>오늘의 번뇌는 어땠나요?</Top.SubtitleParagraph>}
        />
        <div
          aria-hidden
          className={cn(
            "overflow-hidden transition-[height,opacity] duration-500 [grid-area:1/1] motion-reduce:transition-none",
            isIntro ? "h-[342px]" : "h-0 opacity-0",
          )}
        >
          <img
            src={isFailed ? giveUpBosal : endureBosal}
            alt=""
            width={375}
            height={322}
            className="block h-auto w-full"
          />
        </div>
      </div>
      {/* 🔖 시안마다 제목과 버튼 사이가 9px(못 참았어요)과 16px(참았어요)로 달라 9px로 맞췄어요. */}
      <div role="radiogroup" aria-label="오늘의 결과" className="flex gap-2.5 px-5 pt-2.25">
        {RESULT_OPTIONS.map(option => {
          const isSelected = option.value === result;
          return (
            <Button
              key={option.value}
              role="radio"
              aria-checked={isSelected}
              size="xlarge"
              display="block"
              variant="weak"
              color={isSelected ? option.color : "dark"}
              // 고르지 않은 쪽은 글자만 흐려요(시안 opacity 0.3). TDS 스타일을 이기려고 !를 붙여요.
              className={cn(!isSelected && "[&_span]:opacity-30!")}
              onClick={() => !isSelected && onChangeResult(option.value)}
            >
              {option.label}
            </Button>
          );
        })}
      </div>
      <PhotoField photo={photo} onPick={pick} onRemove={remove} />
      <TextArea
        variant="box"
        label="한 줄 기록 *"
        labelOption="sustain"
        placeholder="오늘 참은 것을 한 줄로 기록해봐요"
        minHeight={105}
        value={memo}
        onChange={event => setMemo(sliceMemo(event.target.value))}
        // 시안 메모: 텍스트필드 영역 선택 시 스크롤 위치 이동
        onFocus={event =>
          event.currentTarget.scrollIntoView({ block: "center", behavior: "smooth" })
        }
      />
      {isFailed && <AmountField value={amount} onChange={setAmount} />}
      <FixedBottomCTA disabled={!canSubmit} onClick={() => setIsConfirmOpen(true)}>
        인증하기
      </FixedBottomCTA>
      <CertifyConfirmSheet
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        roomId={roomId}
        roomName={today.room.name}
        memberCount={today.room.memberCount}
        certifiedCount={today.round.certifiedCount}
        isLastCertifier={today.me.isLastCertifier}
        request={{
          result,
          memo: memo.trim(),
          spentAmount: isFailed && amount !== null ? amount : undefined,
          imageKey: photo.status === "uploaded" ? photo.imageKey : undefined,
        }}
        onSubmitted={onSubmitted}
        onUnavailable={onUnavailable}
        onPhotoExpired={remove}
      />
    </main>
  );
};

export default CertifyForm;
