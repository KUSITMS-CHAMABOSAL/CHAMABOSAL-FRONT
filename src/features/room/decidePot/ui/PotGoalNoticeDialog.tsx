import { AlertDialog } from "@toss/tds-mobile";

interface PotGoalNoticeDialogProps {
  open: boolean;
  onClose: () => void;
}

/** 솥을 채운 뒤 방장이 아닌 멤버에게 방장의 선택을 기다린다고 알려요(설계서 09-1 [2]). */
const PotGoalNoticeDialog = ({ open, onClose }: PotGoalNoticeDialogProps) => (
  <AlertDialog
    open={open}
    title={<AlertDialog.Title>목표가 달성됐어요</AlertDialog.Title>}
    description={
      <AlertDialog.Description>
        {"공양미 목표치를 달성했어요\n방장의 선택에 따라 방이 연장되거나 종료돼요"}
      </AlertDialog.Description>
    }
    alertButton={<AlertDialog.AlertButton onClick={onClose}>확인</AlertDialog.AlertButton>}
    onClose={onClose}
  />
);

export default PotGoalNoticeDialog;
