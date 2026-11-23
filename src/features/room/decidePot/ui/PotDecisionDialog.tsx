import { useState } from "react";

import { ConfirmDialog } from "@toss/tds-mobile";

import { useCloseRoom } from "../model/useCloseRoom";
import { useContinuePot } from "../model/useContinuePot";

interface PotDecisionDialogProps {
  roomId: number;
  open: boolean;
  /** 고르지 않고 닫았어요. 선택 전이라 다음에 들어오면 다시 떠요. */
  onDismiss: () => void;
  /** 방을 닫았어요. */
  onRoomClosed: () => void;
  onError: (message: string) => void;
}

/**
 * 솥을 채운 뒤 방장이 방을 이어갈지 닫을지 고르는 팝업이에요(설계서 09 [1], [2]).
 * 고르기 전에는 바깥을 눌러도 닫히지 않아요. [방 닫기]는 한 번 더 확인해요.
 */
const PotDecisionDialog = ({
  roomId,
  open,
  onDismiss,
  onRoomClosed,
  onError,
}: PotDecisionDialogProps) => {
  const [isConfirmingClose, setIsConfirmingClose] = useState(false);
  const { mutate: continueRoom, isPending: isContinuing } = useContinuePot(roomId);
  const { mutate: close, isPending: isClosing } = useCloseRoom(roomId);

  const dismiss = () => {
    setIsConfirmingClose(false);
    onDismiss();
  };

  const confirmContinue = () =>
    continueRoom(undefined, {
      onSuccess: onDismiss,
      onError: () => onError("선택을 저장하지 못했어요. 잠시 후 다시 시도해 주세요"),
    });

  const confirmClose = () =>
    close(undefined, {
      onSuccess: onRoomClosed,
      onError: () => {
        setIsConfirmingClose(false);
        onError("방을 닫지 못했어요. 잠시 후 다시 시도해 주세요");
      },
    });

  return (
    <>
      <ConfirmDialog
        open={open && !isConfirmingClose}
        title={<ConfirmDialog.Title>목표를 달성했어요</ConfirmDialog.Title>}
        description={
          <ConfirmDialog.Description>
            {"공양미 목표치를 달성했어요\n방을 연장하거나 종료할 수 있어요"}
          </ConfirmDialog.Description>
        }
        cancelButton={
          <ConfirmDialog.CancelButton onClick={() => setIsConfirmingClose(true)}>
            방 닫기
          </ConfirmDialog.CancelButton>
        }
        confirmButton={
          <ConfirmDialog.ConfirmButton loading={isContinuing} onClick={confirmContinue}>
            더 수행하기
          </ConfirmDialog.ConfirmButton>
        }
        closeOnDimmerClick={false}
        closeOnBackEvent={false}
      />
      <ConfirmDialog
        open={open && isConfirmingClose}
        title={<ConfirmDialog.Title>정말 방을 종료할까요?</ConfirmDialog.Title>}
        description={
          <ConfirmDialog.Description>지금 종료하면 취소할 수 없어요</ConfirmDialog.Description>
        }
        cancelButton={
          <ConfirmDialog.CancelButton onClick={dismiss}>다시 생각하기</ConfirmDialog.CancelButton>
        }
        confirmButton={
          <ConfirmDialog.ConfirmButton
            color="danger"
            variant="weak"
            loading={isClosing}
            onClick={confirmClose}
          >
            종료할게요
          </ConfirmDialog.ConfirmButton>
        }
        onClose={dismiss}
      />
    </>
  );
};

export default PotDecisionDialog;
