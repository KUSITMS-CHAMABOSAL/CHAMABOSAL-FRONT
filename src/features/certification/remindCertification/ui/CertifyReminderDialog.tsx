import { ConfirmDialog } from "@toss/tds-mobile";

interface CertifyReminderDialogProps {
  open: boolean;
  onClose: () => void;
  onCertify: () => void;
}

/** 아직 인증하지 않은 사람에게 방 홈에 들어올 때 인증을 안내해요(설계서 09-1 [1]). */
const CertifyReminderDialog = ({ open, onClose, onCertify }: CertifyReminderDialogProps) => (
  <ConfirmDialog
    open={open}
    title={<ConfirmDialog.Title>오늘의 번뇌 인증 전이에요</ConfirmDialog.Title>}
    description={
      <ConfirmDialog.Description>
        {"오늘의 번뇌를 인증해야\n투표 참여가 가능해요"}
      </ConfirmDialog.Description>
    }
    cancelButton={<ConfirmDialog.CancelButton onClick={onClose}>닫기</ConfirmDialog.CancelButton>}
    confirmButton={
      <ConfirmDialog.ConfirmButton onClick={onCertify}>인증하러 가기</ConfirmDialog.ConfirmButton>
    }
    onClose={onClose}
  />
);

export default CertifyReminderDialog;
