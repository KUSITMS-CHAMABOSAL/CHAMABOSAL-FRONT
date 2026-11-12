import { ConfirmDialog } from "@toss/tds-mobile";

interface DeleteCertificationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

// 🔖 시안에 없는 확인 단계예요. 지우면 공양미가 회수되고 사진이 바로 지워져서 실수로 누르는 걸 막아요.
const DeleteCertificationDialog = ({
  open,
  onClose,
  onConfirm,
}: DeleteCertificationDialogProps) => (
  <ConfirmDialog
    open={open}
    title={<ConfirmDialog.Title>오늘의 인증을 지울까요?</ConfirmDialog.Title>}
    description={
      <ConfirmDialog.Description>받은 공양미도 함께 돌려놓아요.</ConfirmDialog.Description>
    }
    cancelButton={<ConfirmDialog.CancelButton onClick={onClose}>닫기</ConfirmDialog.CancelButton>}
    confirmButton={
      <ConfirmDialog.ConfirmButton color="danger" onClick={onConfirm}>
        삭제하기
      </ConfirmDialog.ConfirmButton>
    }
    onClose={onClose}
  />
);

export default DeleteCertificationDialog;
