import { ConfirmDialog } from "@toss/tds-mobile";

interface KickMemberDialogProps {
  open: boolean;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

/** 내보내기 전에 한 번 더 묻는 다이얼로그예요(시안 3-4 내보내기). */
const KickMemberDialog = ({ open, isPending, onClose, onConfirm }: KickMemberDialogProps) => (
  <ConfirmDialog
    open={open}
    description={
      <ConfirmDialog.Description>내보내면 이 방에 다시 들어올 수 없어요.</ConfirmDialog.Description>
    }
    cancelButton={<ConfirmDialog.CancelButton onClick={onClose}>닫기</ConfirmDialog.CancelButton>}
    confirmButton={
      <ConfirmDialog.ConfirmButton
        color="danger"
        variant="weak"
        loading={isPending}
        onClick={onConfirm}
      >
        내보내기
      </ConfirmDialog.ConfirmButton>
    }
    onClose={onClose}
  />
);

export default KickMemberDialog;
