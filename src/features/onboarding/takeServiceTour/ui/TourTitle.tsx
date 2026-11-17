import { Paragraph } from "@toss/tds-mobile";

import { cn } from "@/shared/lib";

import { MATCHED_LAYER } from "../config/stage";

interface TourTitleProps {
  title: string;
  description: string;
  /** 앞뒤 화면의 제목과 제자리에서 이어지는지예요. */
  matched?: boolean;
  className?: string;
}

/** 화면 제목과 설명이에요. 시안의 줄바꿈 그대로 그려요. */
const TourTitle = ({ title, description, matched = false, className }: TourTitleProps) => (
  <div
    data-match={matched ? MATCHED_LAYER.title : undefined}
    className={cn(
      "absolute inset-x-0 mx-auto flex w-fit origin-top-left flex-col items-center gap-2 text-center whitespace-pre",
      className,
    )}
  >
    <Paragraph typography="st5" fontWeight="bold" color="var(--adaptiveGrey900)">
      {title}
    </Paragraph>
    <Paragraph typography="t6" fontWeight="medium" color="var(--adaptiveGreyOpacity600)">
      {description}
    </Paragraph>
  </div>
);

export default TourTitle;
