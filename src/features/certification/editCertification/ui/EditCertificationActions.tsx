import { useEffect, useState } from "react";

import { Paragraph } from "@toss/tds-mobile";

import { isApiError } from "@/shared/api";
import { minutesUntil, useTabBarToast } from "@/shared/lib";
import type { LockReason } from "@/shared/types";

import { useDeleteCertification } from "../model/useDeleteCertification";
import DeleteCertificationDialog from "./DeleteCertificationDialog";

interface EditCertificationActionsProps {
  roomId: number;
  certificationId: number;
  /** 수정·삭제 마감 시각이에요. */
  editableUntil: string;
  lockReason: LockReason | null;
  onEdit: () => void;
}

const ACTION =
  "flex h-[46px] flex-1 touch-manipulation appearance-none items-center justify-center rounded-sm! border-0 bg-(--adaptiveGrey50) p-0 [-webkit-tap-highlight-color:transparent]";
/** 남은 분을 다시 계산하는 간격이에요. */
const TICK_MS = 15_000;

// 🔖 서버 시간 보정(Environment.getServerTime)이 들어오면 기기 시각 대신 써요.
/** 내 인증 아래 수정·삭제 버튼이에요. 마감이 지나거나 투표가 시작되면 안내 문구만 보여줘요. */
const EditCertificationActions = ({
  roomId,
  certificationId,
  editableUntil,
  lockReason,
  onEdit,
}: EditCertificationActionsProps) => {
  const [now, setNow] = useState(Date.now);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { mutate: remove, isPending } = useDeleteCertification(roomId);
  const openToast = useTabBarToast();
  const minutesLeft = lockReason ? 0 : minutesUntil(editableUntil, now);

  useEffect(() => {
    if (minutesLeft <= 0) return;
    const timer = window.setInterval(() => setNow(Date.now()), TICK_MS);
    return () => window.clearInterval(timer);
  }, [minutesLeft]);

  if (minutesLeft <= 0)
    return (
      <Paragraph
        typography="t7"
        fontWeight="semibold"
        color="var(--adaptiveGrey400)"
        className="px-2"
      >
        수정기한이 지나 수정할 수 없어요.
      </Paragraph>
    );

  const confirmDelete = () => {
    setIsConfirmOpen(false);
    remove(certificationId, {
      onSuccess: () => openToast("인증을 지웠어요"),
      onError: error =>
        openToast(
          isApiError(error, "CERT_004", "CERT_005")
            ? "수정기한이 지나 지울 수 없어요"
            : "인증을 지우지 못했어요. 잠시 후 다시 시도해 주세요",
        ),
    });
  };

  return (
    <div className="flex flex-col gap-2.5">
      <Paragraph
        typography="t7"
        fontWeight="semibold"
        color="var(--adaptiveGrey400)"
        className="px-2"
      >
        {`${minutesLeft}분동안 수정 및 삭제를 할 수 있어요.`}
      </Paragraph>
      <div className="flex gap-[13px]">
        <button type="button" onClick={onEdit} className={ACTION}>
          <Paragraph typography="t7" color="var(--adaptiveGrey600)">
            수정하기
          </Paragraph>
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => setIsConfirmOpen(true)}
          className={ACTION}
        >
          <Paragraph typography="t7" color="var(--adaptiveRed500)">
            삭제하기
          </Paragraph>
        </button>
      </div>
      <DeleteCertificationDialog
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default EditCertificationActions;
