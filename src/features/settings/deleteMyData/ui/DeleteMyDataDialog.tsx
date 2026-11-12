import { ConfirmDialog } from "@toss/tds-mobile";

interface DeleteMyDataDialogProps {
  open: boolean;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

// 시안의 확인 버튼은 [나가기]인데 방 나가기 시안을 복사한 것으로 보여 [삭제하기]로 바꿨어요. 🔖 디자이너 확인
const DeleteMyDataDialog = ({ open, isPending, onClose, onConfirm }: DeleteMyDataDialogProps) => (
  <ConfirmDialog
    open={open}
    title={<ConfirmDialog.Title>내 데이터를 삭제할까요?</ConfirmDialog.Title>}
    description={
      <ConfirmDialog.Description>
        사진은 바로 삭제되고, 기록은 떠난 보살로 남았다가 6개월 뒤 삭제돼요. 닉네임 등 개인 데이터와
        공양미는 사라져요.
      </ConfirmDialog.Description>
    }
    cancelButton={<ConfirmDialog.CancelButton onClick={onClose}>닫기</ConfirmDialog.CancelButton>}
    confirmButton={
      <ConfirmDialog.ConfirmButton
        color="danger"
        variant="weak"
        loading={isPending}
        onClick={onConfirm}
      >
        삭제하기
      </ConfirmDialog.ConfirmButton>
    }
    onClose={onClose}
  />
);

export default DeleteMyDataDialog;
