import { Paragraph } from "@toss/tds-mobile";

import { BosalStatusBadge } from "@/entities/bosal";
import { cn, formatTime, formatWon } from "@/shared/lib";
import type { BosalColor } from "@/shared/types";

import allBosalIllustration from "../assets/illustration_all_bosal.svg";
import noPhotoMintIllustration from "../assets/illustration_no_photo_mint.svg";
import noPhotoPinkIllustration from "../assets/illustration_no_photo_pink.svg";
import noPhotoPurpleIllustration from "../assets/illustration_no_photo_purple.svg";
import noPhotoYellowIllustration from "../assets/illustration_no_photo_yellow.svg";
import placeholderIllustration from "../assets/illustration_photo_placeholder.svg";
import { CheckIcon } from "../assets";
import { getCandidateStatus } from "../lib/candidateStatus";
import type { CandidateChoice } from "../model/types";

interface CandidateCardProps {
  choice: CandidateChoice;
  selected: boolean;
  onSelect: () => void;
}

/** 사진 자리예요. 시안 264px 정사각형이에요. */
const PHOTO = "block aspect-square w-full rounded-[14px] object-cover";

/** 사진 없이 인증한 후보의 사진 자리 그림이에요. 후보의 보살 색을 따라가요. */
const NO_PHOTO_ILLUSTRATION: Record<BosalColor, string> = {
  PINK: noPhotoPinkIllustration,
  PURPLE: noPhotoPurpleIllustration,
  MINT: noPhotoMintIllustration,
  YELLOW: noPhotoYellowIllustration,
};

/**
 * 후보 고르기 카드예요(시안 VoteCarousel.item). 인증 상태 태그, 닉네임, 한 줄 기록, 인증 시각, 번뇌비, 사진을 보여줘요.
 * 참았어요·미인증 후보는 번뇌비 자리에 -0원을 보여줘요. 누르면 이 카드를 골라요.
 */
const CandidateCard = ({ choice, selected, onSelect }: CandidateCardProps) => {
  const isAllBosal = choice.kind === "allBosal";
  const certification = isAllBosal ? null : choice.candidate.certification;
  const name = isAllBosal ? "오늘은 모두 보살" : `${choice.candidate.nickname} 보살`;
  // 미인증은 회색 자리 그림, 사진 없이 인증했으면 그 후보의 보살 색 그림이에요.
  const photo = isAllBosal
    ? allBosalIllustration
    : !certification
      ? placeholderIllustration
      : (certification.imageUrl ?? NO_PHOTO_ILLUSTRATION[choice.candidate.color]);

  return (
    // TDS 전역 CSS가 button 모서리를 지워서 rounded에 !를 붙여요.
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        "relative flex w-[294px] shrink-0 cursor-pointer snap-center appearance-none flex-col gap-3 rounded-[14px]! border border-solid p-3.5 text-left",
        selected
          ? "border-(--adaptiveBlue500) bg-(--adaptiveBlue50)"
          : "border-(--adaptiveGreyOpacity200) bg-(--adaptiveGreyOpacity100)",
      )}
    >
      <span className="flex items-center gap-1.5">
        <BosalStatusBadge status={isAllBosal ? "patient" : getCandidateStatus(choice.candidate)} />
        <Paragraph typography="t6" fontWeight="bold" color="var(--adaptiveGrey900)">
          {name}
        </Paragraph>
      </span>
      {selected && <CheckIcon aria-hidden className="absolute top-[15px] right-[15px] size-6" />}
      <Paragraph
        typography="t6"
        color="var(--adaptiveGrey900)"
        className="line-clamp-2 h-10 whitespace-pre-line"
      >
        {isAllBosal
          ? "오늘은 모두 잘 참았어요"
          : (certification?.memo ?? "오늘은 인증하지 않았어요")}
      </Paragraph>
      {/* "오늘은 모두 보살"은 시각과 번뇌비 없이 자리만 비워요. */}
      <span className="flex h-4 items-center justify-between">
        {certification && (
          <Paragraph typography="t7" fontWeight="semibold" color="var(--adaptiveGreyOpacity500)">
            {formatTime(certification.certifiedAt)}
          </Paragraph>
        )}
        {!isAllBosal && (
          <Paragraph
            typography="t7"
            fontWeight="medium"
            color={
              !certification
                ? "var(--adaptiveGreyOpacity500)"
                : certification.result === "FAILED"
                  ? "var(--adaptiveRed600)"
                  : "var(--adaptiveBlue600)"
            }
            className="ml-auto!"
          >
            {`-${formatWon(certification?.spentAmount ?? 0)}`}
          </Paragraph>
        )}
      </span>
      <img src={photo} alt="" className={PHOTO} />
    </button>
  );
};

export default CandidateCard;
