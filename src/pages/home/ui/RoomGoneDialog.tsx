import { ConfirmDialog } from "@toss/tds-mobile";

interface RoomGoneDialogProps {
  open: boolean;
  onClose: () => void;
}

/** 나갔거나 사라진 방에 들어왔을 때 알려요. 닫으면 처음으로 이동해요. */
const RoomGoneDialog = ({ open, onClose }: RoomGoneDialogProps) => (
  <ConfirmDialog
    open={open}
    title={<ConfirmDialog.Title>더이상 참여하지 않는 방이에요</ConfirmDialog.Title>}
    description={
      <ConfirmDialog.Description>
        {"방에서 나왔거나 방이 사라졌어요.\n처음으로 이동할게요."}
      </ConfirmDialog.Description>
    }
    cancelButton={<ConfirmDialog.CancelButton onClick={onClose}>닫기</ConfirmDialog.CancelButton>}
    closeOnDimmerClick={false}
    onClose={onClose}
  />
);

export default RoomGoneDialog;
