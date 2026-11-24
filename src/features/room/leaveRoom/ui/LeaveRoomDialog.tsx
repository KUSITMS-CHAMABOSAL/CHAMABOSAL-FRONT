import { ConfirmDialog } from "@toss/tds-mobile";

interface LeaveRoomDialogProps {
  open: boolean;
  roomName: string;
  /** 지금 나가면 사라질 공양미예요. 받지 못했으면 없어요. */
  riceToLose: number | undefined;
  isPending: boolean;
  isPreviewLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LEFT_NOTICE = "사진은 바로 삭제되고, 기록은 '떠난 보살'로 남아요.";

/** 사라질 공양미가 없거나(이미 솥을 채웠거나 0석) 받지 못했으면 공양미 문장 없이 보여줘요. */
const getDescription = (riceToLose: number | undefined) =>
  riceToLose === undefined || riceToLose <= 0
    ? LEFT_NOTICE
    : `${LEFT_NOTICE} 이 방에서 모은 공양미는 ${riceToLose}석 사라져요.`;

const LeaveRoomDialog = ({
  open,
  roomName,
  riceToLose,
  isPending,
  isPreviewLoading,
  onClose,
  onConfirm,
}: LeaveRoomDialogProps) => (
  <ConfirmDialog
    open={open}
    title={<ConfirmDialog.Title>{`${roomName}에서 나갈까요?`}</ConfirmDialog.Title>}
    description={
      <ConfirmDialog.Description>{getDescription(riceToLose)}</ConfirmDialog.Description>
    }
    cancelButton={<ConfirmDialog.CancelButton onClick={onClose}>닫기</ConfirmDialog.CancelButton>}
    confirmButton={
      <ConfirmDialog.ConfirmButton
        color="danger"
        variant="weak"
        disabled={isPreviewLoading}
        loading={isPending}
        onClick={onConfirm}
      >
        나가기
      </ConfirmDialog.ConfirmButton>
    }
    onClose={onClose}
  />
);

export default LeaveRoomDialog;
