import { useMutation } from "@tanstack/react-query";

import { deepLinks } from "@/shared/config";
import {
  copyToClipboard,
  createShareLink,
  type InviteEntryPoint,
  isClipboardPermissionError,
  logEvent,
} from "@/shared/lib/appsInToss";

import { issueInviteToken } from "../api/inviteTokenApi";
import { INVITE_OG_IMAGE_URL } from "../config/ogImage";

/** 디자인 문구예요(1-6 초대링크 공유). */
const COPIED_MESSAGE = "초대링크를 복사했어요.";
// 🔖 실패 문구는 시안에 없어요. 디자이너 확인이 필요해요.
const PERMISSION_DENIED_MESSAGE = "클립보드 접근을 허용하면 초대링크를 복사할 수 있어요.";
const FAILED_MESSAGE = "초대링크를 복사하지 못했어요. 잠시 후 다시 시도해 주세요.";

/**
 * 마지막으로 누른 복사 요청 번호예요. 화면이 바뀌어도 남도록 모듈에 둬요.
 * 홈에서 방 탭을 바꿔 다른 방 링크를 복사하면, 늦게 끝난 앞 요청이 클립보드를 덮어쓰지 않게 해요.
 */
let latestRequest = 0;

/**
 * 초대 토큰으로 토스 공유 링크를 만들어 클립보드에 복사해요. 메신저 미리보기에는 참아보살 이미지가 보여요.
 * 결과는 화면마다 다른 토스트(탭바 위, 화면 아래)로 알리도록 `notify`로 넘겨요.
 * 더 새 요청이 있으면 쓰기와 토스트를 건너뛰어요.
 * 복사에 성공하면 어디서 복사했는지(`entryPoint`)를 분석 이벤트로 보내요.
 */
export const useCopyInviteLink = (
  roomId: number,
  entryPoint: InviteEntryPoint,
  notify: (message: string, succeeded: boolean) => void,
) =>
  useMutation({
    mutationFn: async () => {
      const request = ++latestRequest;
      try {
        const { inviteToken } = await issueInviteToken(roomId);
        const link = await createShareLink(deepLinks.invite(inviteToken), INVITE_OG_IMAGE_URL);
        if (request !== latestRequest) return false;
        await copyToClipboard(link);
        return true;
      } catch (error) {
        if (request !== latestRequest) return false;
        throw error;
      }
    },
    onSuccess: copied => {
      if (!copied) return;
      logEvent("invite_link_copy", { entry_point: entryPoint });
      notify(COPIED_MESSAGE, true);
    },
    onError: error =>
      notify(isClipboardPermissionError(error) ? PERMISSION_DENIED_MESSAGE : FAILED_MESSAGE, false),
  });
