import { Paragraph } from "@toss/tds-mobile";

import { CopyIcon, LinkIcon } from "../assets";

interface CopyInviteLinkButtonProps {
  isPending: boolean;
  onCopy: () => void;
}

/** 방을 만든 뒤 보는 [친구 초대하기] 줄이에요. 어디를 눌러도 초대링크를 복사해요. */
const CopyInviteLinkButton = ({ isPending, onCopy }: CopyInviteLinkButtonProps) => (
  <button
    type="button"
    disabled={isPending}
    onClick={onCopy}
    // TDS 전역 button 스타일이 모서리를 덮어써서 !를 붙여요.
    className="flex h-14 w-full appearance-none items-center rounded-xl! border-0 bg-(--adaptiveBackground) pr-6 pl-4.75 text-left"
  >
    <LinkIcon aria-hidden className="shrink-0" />
    <Paragraph className="ml-5.75! grow" typography="t5" color="var(--adaptiveGrey900)">
      친구 초대하기
    </Paragraph>
    <CopyIcon aria-hidden className="shrink-0" />
  </button>
);

export default CopyInviteLinkButton;
