import type { ReactNode } from "react";

import { Badge, Paragraph } from "@toss/tds-mobile";

import { cn } from "@/shared/lib";

interface ItemCardProps {
  name: string;
  /** 공양미 가격. 표정처럼 가격이 정해지지 않은 아이템은 비워 둬요. */
  price?: number;
  status: ReactNode;
  thumbnail: ReactNode;
  action: ReactNode;
  className?: string;
}

const ItemCard = ({ name, price, status, thumbnail, action, className }: ItemCardProps) => (
  <div
    className={cn(
      "flex flex-col items-center gap-2 rounded-[10px] bg-(--adaptiveGreyOpacity50) p-3",
      className,
    )}
  >
    <div className="flex h-[95px] w-full justify-center overflow-hidden">{thumbnail}</div>
    <div className="flex flex-col items-center gap-0.5">
      <div className="flex items-center gap-1">
        {price !== undefined && (
          <Badge size="xsmall" variant="fill" color="elephant">
            {`${price}석`}
          </Badge>
        )}
        <Paragraph typography="t6" fontWeight="bold" color="var(--adaptiveGrey900)">
          {name}
        </Paragraph>
      </div>
      <Paragraph typography="t7" fontWeight="semibold" color="var(--adaptiveGrey600)">
        {status}
      </Paragraph>
    </div>
    {action}
  </div>
);

export default ItemCard;
