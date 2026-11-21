import { BottomSheet, Button, Paragraph } from "@toss/tds-mobile";

import { isApiError } from "@/shared/api";
import { useTabBarToast } from "@/shared/lib";

import { BallotBoxColorIcon } from "../assets";
import type { VoteSubmitRequest } from "../model/types";
import { useCastVote } from "../model/useCastVote";

interface VoteConfirmSheetProps {
  open: boolean;
  roomId: number;
  roundId: number;
  /** 고른 대상이에요. 후보면 닉네임으로 묻고, "오늘은 모두 보살"이면 그대로 물어요. */
  target: VoteSubmitRequest;
  nickname?: string;
  onClose: () => void;
}

// 🔖 실패 문구는 시안에 없어 임시 문구예요.
const CLOSED_MESSAGE = "투표가 마감됐어요";
const FAILED_MESSAGE = "투표하지 못했어요. 잠시 후 다시 시도해 주세요";

/**
 * 투표 확인 시트예요(시안 투표-08). [투표하기]를 눌렀을 때만 열려요.
 * 투표하면 투표 탭을 다시 받아 투표 완료 화면으로 바뀌어요.
 */
const VoteConfirmSheet = ({
  open,
  roomId,
  roundId,
  target,
  nickname,
  onClose,
}: VoteConfirmSheetProps) => {
  const { mutate: vote, isPending } = useCastVote(roomId, roundId);
  const openToast = useTabBarToast();
  const title =
    target.targetType === "ALL_BOSAL"
      ? "오늘은 모두 보살로 투표할까요?"
      : `${nickname} 보살에게 투표할까요?`;

  const submit = () =>
    vote(target, {
      onError: error => {
        onClose();
        // 이미 투표했으면 다시 받은 투표 탭이 투표 완료로 바뀌어서 따로 알리지 않아요.
        if (isApiError(error, "VOTE_004")) return;
        // 시트를 띄운 사이 마감됐으면 투표를 막고 알려요(화면설계서 21).
        openToast(isApiError(error, "VOTE_001") ? CLOSED_MESSAGE : FAILED_MESSAGE);
      },
    });

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      // 버튼을 누르다 시트가 끌려 내려가지 않게 손잡이로만 끌어요.
      disableChildrenDragging
      ctaContentGap={20}
      header={<BottomSheet.Header>{title}</BottomSheet.Header>}
      headerDescription={
        <BottomSheet.HeaderDescription>누가 골랐는지는 비밀이에요</BottomSheet.HeaderDescription>
      }
      cta={
        <BottomSheet.DoubleCTA
          leftButton={
            <Button color="dark" variant="weak" disabled={isPending} onClick={onClose}>
              다시 고르기
            </Button>
          }
          rightButton={
            <Button loading={isPending} onClick={submit}>
              투표하기
            </Button>
          }
        />
      }
    >
      <div className="flex items-center gap-2.5 bg-(--adaptiveGreen50) p-6">
        <span className="flex size-10 shrink-0 items-center justify-center">
          <BallotBoxColorIcon aria-hidden />
        </span>
        <Paragraph typography="t6" fontWeight="bold" color="var(--adaptiveTeal600)">
          투표는 한 번 하면 수정이 불가해요.
        </Paragraph>
      </div>
    </BottomSheet>
  );
};

export default VoteConfirmSheet;
