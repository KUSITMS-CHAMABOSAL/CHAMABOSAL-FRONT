import { useMutation } from "@tanstack/react-query";

import { deepLinks } from "@/shared/config";
import {
  copyToClipboard,
  createShareLink,
  isClipboardPermissionError,
} from "@/shared/lib/appsInToss";

import { issueInviteToken } from "../api/inviteTokenApi";

/** 디자인 문구예요(1-6 초대링크 공유). */
const COPIED_MESSAGE = "초대링크를 복사했어요.";
// 🔖 실패 문구는 시안에 없어요. 디자이너 확인이 필요해요.
const PERMISSION_DENIED_MESSAGE = "클립보드 접근을 허용하면 초대링크를 복사할 수 있어요.";
const FAILED_MESSAGE = "초대링크를 복사하지 못했어요. 잠시 후 다시 시도해 주세요.";

/**
 * 초대 토큰으로 토스 공유 링크를 만들어 클립보드에 복사해요.
 * 결과는 화면마다 다른 토스트(탭바 위, 화면 아래)로 알리도록 `notify`로 넘겨요.
 */
export const useCopyInviteLink = (
  roomId: number,
  notify: (message: string, succeeded: boolean) => void,
) =>
  useMutation({
    mutationFn: async () => {
      const { inviteToken } = await issueInviteToken(roomId);
      const link = await createShareLink(deepLinks.invite(inviteToken));
      await copyToClipboard(link);
    },
    onSuccess: () => notify(COPIED_MESSAGE, true),
    onError: error =>
      notify(isClipboardPermissionError(error) ? PERMISSION_DENIED_MESSAGE : FAILED_MESSAGE, false),
  });
