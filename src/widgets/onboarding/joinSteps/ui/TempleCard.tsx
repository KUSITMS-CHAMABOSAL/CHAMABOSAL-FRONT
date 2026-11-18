import { Paragraph } from "@toss/tds-mobile";

import { cn } from "@/shared/lib";

import cloudGloomy from "../assets/cloud_gloomy.svg";
import cloud from "../assets/cloud.svg";
import rainLongFade from "../assets/rain_long_fade.svg";
import rainShortFade from "../assets/rain_short_fade.svg";
import rainShort from "../assets/rain_short.svg";
import templeBase from "../assets/temple_base.svg";
import templeClosed from "../assets/temple_closed.svg";
import temple from "../assets/temple.svg";

interface TempleCardProps {
  /** `open`은 방을 만든 뒤(맑은 하늘), `closed`는 들어갈 수 없을 때(흐린 하늘, 비, 막힌 문)예요. */
  variant: "open" | "closed";
  /** 사원 위 이름표예요. 없으면 그리지 않아요. */
  label?: string;
}

/** 그림 조각은 가운데를 기준으로 시안 위치에 둬요. 넓은 화면에서도 하늘만 늘어나요. */
const piece = "pointer-events-none absolute max-w-none";

/** 사원 그림 카드예요. 시안 1-6(방을 만든 뒤)과 1-6.1~1-6.3(참여 불가)의 그림이에요. */
const TempleCard = ({ variant, label }: TempleCardProps) => (
  <div
    className={cn(
      "relative h-[257px] shrink-0 overflow-hidden rounded-xl",
      variant === "open"
        ? "bg-[linear-gradient(to_bottom,var(--color-temple-sky-top),var(--color-temple-sky-mid)_83.65%,var(--color-temple-sky-bottom))]"
        : "bg-[linear-gradient(to_bottom,var(--color-temple-sky-top),var(--color-temple-gloom)_83.65%)]",
    )}
  >
    {variant === "open" ? (
      <>
        <img
          src={cloud}
          alt=""
          width={199}
          height={134}
          className={cn(piece, "top-12 left-[calc(50%-167.5px)]")}
        />
        <img
          src={cloud}
          alt=""
          width={199}
          height={134}
          className={cn(piece, "-top-5.25 left-[calc(50%+2.5px)]")}
        />
        <img
          src={temple}
          alt=""
          width={247}
          height={184}
          className={cn(piece, "top-18.25 left-[calc(50%-119.5px)]")}
        />
      </>
    ) : (
      <>
        <img
          src={cloudGloomy}
          alt=""
          width={195}
          height={134}
          className={cn(piece, "top-11.5 left-[calc(50%-167.5px)]")}
        />
        <img
          src={cloudGloomy}
          alt=""
          width={195}
          height={134}
          className={cn(piece, "-top-5.25 left-[calc(50%-0.5px)]")}
        />
        <img
          src={templeClosed}
          alt=""
          width={247}
          height={184}
          className={cn(piece, "top-18.25 left-[calc(50%-123.5px)]")}
        />
        <img
          src={templeBase}
          alt=""
          width={222}
          height={15}
          className={cn(piece, "top-60.5 left-[calc(50%-108.5px)]")}
        />
        <img
          src={rainShortFade}
          alt=""
          width={15}
          height={35}
          className={cn(piece, "top-32.5 left-[calc(50%-122.5px)]")}
        />
        <img
          src={rainShort}
          alt=""
          width={15}
          height={35}
          className={cn(piece, "top-19.75 left-[calc(50%+115px)]")}
        />
        <img
          src={rainLongFade}
          alt=""
          width={15}
          height={67}
          className={cn(piece, "top-37.5 left-[calc(50%-103px)]")}
        />
      </>
    )}
    {label && (
      <div className="absolute inset-x-0 top-37 flex justify-center">
        <Paragraph
          className="rounded-xl bg-(--adaptiveGrey800) px-1.75 py-1.5 shadow-[0_0_10px_rgb(0_0_0/0.25)]"
          typography="t7"
          fontWeight="semibold"
          color="var(--color-on-fill)"
        >
          {label}
        </Paragraph>
      </div>
    )}
  </div>
);

export default TempleCard;
