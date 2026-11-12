import type { ReactNode } from "react";

import { Paragraph } from "@toss/tds-mobile";

interface CertificationCardProps {
  name: string;
  /** 이름 앞 상태 뱃지예요. */
  badge: ReactNode;
  memo: string;
  /** 표시용 시각이에요(예: "오후 7:24"). */
  time: string;
  /** 표시용 금액이에요(예: "-0원"). */
  spent: string;
  /** 못 참은 날은 쓴 금액을 빨간색으로 보여줘요. */
  failed: boolean;
  /** 사진이 없거나 지워졌으면 null이에요. */
  imageUrl: string | null;
}

/** 인증 카드예요. 시안의 VoteCarousel.item 모양이에요. */
const CertificationCard = ({
  name,
  badge,
  memo,
  time,
  spent,
  failed,
  imageUrl,
}: CertificationCardProps) => (
  <article className="flex min-h-[406px] flex-col gap-3 overflow-hidden rounded-[14px] border border-solid border-(--adaptiveGreyOpacity200) bg-(--adaptiveGreyOpacity100) p-3.5">
    <div className="flex min-w-0 items-center gap-1.5">
      {badge}
      <Paragraph
        typography="t6"
        fontWeight="bold"
        color="var(--adaptiveGrey900)"
        className="truncate"
      >
        {name}
      </Paragraph>
    </div>
    <Paragraph
      typography="t6"
      color="var(--adaptiveGrey900)"
      className="line-clamp-2 shrink-0 whitespace-pre-line"
    >
      {memo}
    </Paragraph>
    <div className="flex items-center justify-between">
      <Paragraph typography="t7" fontWeight="semibold" color="var(--adaptiveGreyOpacity500)">
        {time}
      </Paragraph>
      <Paragraph
        typography="t7"
        fontWeight="medium"
        color={failed ? "var(--adaptiveRed500)" : "var(--adaptiveBlue600)"}
      >
        {spent}
      </Paragraph>
    </div>
    {/* 🔖 사진 없는 인증의 시안이 없어 사진 자리를 비워 둬요. */}
    {imageUrl && (
      <img
        src={imageUrl}
        alt={`${name}의 인증 사진`}
        className="aspect-square w-full rounded-[14px] object-cover"
        loading="lazy"
        draggable={false}
      />
    )}
  </article>
);

export default CertificationCard;
