import { BottomSheet, Button, Paragraph, useToast } from "@toss/tds-mobile";

import { EDIT_WINDOW_MINUTES } from "@/entities/certification";
import { isApiError } from "@/shared/api";

import { BallotBoxColorIcon } from "../assets";
import type { CertificationCreateRequest, CertificationCreateResponse } from "../model/types";
import { useSubmitCertification } from "../model/useSubmitCertification";

interface CertifyConfirmSheetProps {
  open: boolean;
  onClose: () => void;
  roomId: number;
  roomName: string;
  memberCount: number;
  /** 나를 빼고 지금까지 인증한 사람 수예요. */
  certifiedCount: number;
  /** 내가 등록하면 바로 투표가 시작돼요. 오늘 탭의 `me.isLastCertifier`예요. */
  isLastCertifier: boolean;
  request: CertificationCreateRequest;
  onSubmitted: (response: CertificationCreateResponse) => void;
  /** 이미 인증했거나 인증 시간이 아니에요. */
  onUnavailable: () => void;
  /** 사진 키가 만료됐어요. 사진을 지우고 다시 고르게 해요. */
  onPhotoExpired: () => void;
}

/**
 * 등록 전에 한 번 더 확인하는 시트예요.
 * 마지막 인증이면 바로 투표가 시작돼 수정할 수 없다고, 아니면 10분 안에만 고칠 수 있다고 알려요.
 */
const CertifyConfirmSheet = ({
  open,
  onClose,
  roomId,
  roomName,
  memberCount,
  certifiedCount,
  isLastCertifier,
  request,
  onSubmitted,
  onUnavailable,
  onPhotoExpired,
}: CertifyConfirmSheetProps) => {
  const { mutate: submit, isPending } = useSubmitCertification(roomId);
  const { openToast } = useToast();

  const register = () =>
    submit(request, {
      onSuccess: onSubmitted,
      // 🔖 실패 문구는 시안에 없어 임시 문구예요.
      onError: error => {
        if (isApiError(error, "CERT_001", "CERT_006")) {
          openToast("지금은 인증할 수 없어요");
          onUnavailable();
        } else if (isApiError(error, "COMMON_002") && error.field === "imageKey") {
          openToast("사진을 다시 올려 주세요");
          onPhotoExpired();
          onClose();
        } else {
          openToast("인증을 남기지 못했어요. 잠시 후 다시 시도해 주세요");
        }
      },
    });

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      // 버튼을 누르다 시트가 끌려 내려가지 않게 손잡이로만 끌어요.
      disableChildrenDragging
      // 시안은 안내 박스와 버튼 사이가 20px이에요.
      ctaContentGap={20}
      header={
        <BottomSheet.Header>
          {isLastCertifier ? "마지막 인증이에요" : "이대로 등록할까요?"}
        </BottomSheet.Header>
      }
      headerDescription={
        <BottomSheet.HeaderDescription>
          {`${roomName} · ${memberCount}명 중 `}
          <span className="text-(color:--adaptiveBlue600)">{certifiedCount}</span>명 인증
        </BottomSheet.HeaderDescription>
      }
      cta={
        <BottomSheet.DoubleCTA
          leftButton={
            <Button color="dark" variant="weak" disabled={isPending} onClick={onClose}>
              다시 확인
            </Button>
          }
          rightButton={
            <Button loading={isPending} onClick={register}>
              등록하기
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
          {isLastCertifier
            ? "등록하면 바로 투표가 시작되고,\n인증내역 수정은 불가능해요"
            : `수정 및 삭제는 ${EDIT_WINDOW_MINUTES}분이내로만 가능해요\n이후에는 상태를 변경할 수 없어요`}
        </Paragraph>
      </div>
    </BottomSheet>
  );
};

export default CertifyConfirmSheet;
