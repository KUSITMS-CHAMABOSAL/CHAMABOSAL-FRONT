import { useRef, useState } from "react";

import { Button, IconButton, Paragraph } from "@toss/tds-mobile";

import { BosalCard, BosalStatusBadge, InviteBosalCard } from "@/entities/bosal";
import { CertificationCard } from "@/entities/certification";
import { MAX_MEMBERS, type TodayMember, type TodayResponse } from "@/entities/room";
import { EditCertificationActions } from "@/features/certification/editCertification";
import {
  ReactionButtons,
  useReactCertification,
} from "@/features/certification/reactCertification";
import { PokeButton, usePokeMember } from "@/features/member/pokeMember";
import { useCopyInviteLink } from "@/features/room/shareInvite";
import { formatTime, formatWon, useTabBarToast } from "@/shared/lib";

import { getBosalCardView, getBosalName, getBosalStatus } from "../lib/getBosalCardView";
import type { BosalCardView } from "../model/types";
import UnverifiedCard from "./UnverifiedCard";

interface TodayBosalsProps {
  today: TodayResponse;
  onCertify: () => void;
  onEditCertification: () => void;
}

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * 오늘의 보살들이에요. 첫 장은 격자이고, 옆으로 넘기면 보살마다 카드가 캐러셀로 이어져요.
 * 격자의 보살을 누르거나 넘기면 그 보살의 카드를 봐요. 격자의 빈 칸은 친구 초대 칸이고, 캐러셀에는 들어온 보살만 있어요.
 * 끝에는 격자로 돌아가는 버튼이 있어요.
 *
 * 넘기기는 브라우저 기본 가로 스크롤과 scroll-snap이에요. 드래그, 관성, 멈출 자리 맞추기를 WebView가
 * 합성 스레드에서 처리해서 자바스크립트 없이 부드럽고, 드래그 라이브러리가 필요 없어요.
 */
const TodayBosals = ({ today, onCertify, onEditCertification }: TodayBosalsProps) => {
  const { roomId } = today.room;
  const scrollerRef = useRef<HTMLDivElement>(null);
  /** 이 화면에서 찌른 횟수예요. 서버는 내가 받은 콕만 알려줘서 움찔 연출에만 써요. */
  const [sentPokes, setSentPokes] = useState<Record<number, number>>({});
  const openToast = useTabBarToast();
  const poke = usePokeMember(roomId, openToast);
  const { mutate: react, isPending: isReacting } = useReactCertification(roomId, openToast);
  /** 리액션은 인증이 속한 회차가 인증 중일 때만 받아요. 투표가 시작되면 남긴 리액션만 보여줘요. */
  const canReact = today.round.status === "CERTIFYING";
  const { mutate: copyInviteLink, isPending: isCopying } = useCopyInviteLink(roomId, openToast);

  const goToPage = (page: number) => {
    scrollerRef.current?.querySelector(`[data-page="${page}"]`)?.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  const pokeMember = (member: TodayMember) => {
    poke(member.memberId);
    setSentPokes(prev => ({ ...prev, [member.memberId]: (prev[member.memberId] ?? 0) + 1 }));
    openToast(`${getBosalName(member)}을 콕 찔렀어요`);
  };

  const renderAction = (view: BosalCardView) => {
    switch (view.kind) {
      case "certified":
        return view.member.isMe ? (
          <EditCertificationActions
            roomId={roomId}
            certificationId={view.certification.certificationId}
            editableUntil={view.certification.editableUntil}
            lockReason={view.certification.lockReason}
            onEdit={onEditCertification}
          />
        ) : (
          <ReactionButtons
            value={view.certification.myReaction}
            counts={{ GOOD: view.certification.goodCount, BAD: view.certification.badCount }}
            disabled={!canReact || isReacting}
            onChange={reaction =>
              react({ certificationId: view.certification.certificationId, reaction })
            }
          />
        );
      case "unverified":
        return view.member.isMe ? (
          <Button size="xlarge" color="dark" variant="weak" display="block" onClick={onCertify}>
            오늘의 인증 남기기
          </Button>
        ) : (
          <PokeButton
            disabled={!today.round.isCertificationOpen}
            onPoke={() => pokeMember(view.member)}
          />
        );
    }
  };

  const renderCard = (view: BosalCardView) => {
    switch (view.kind) {
      case "certified": {
        const { result, spentAmount, memo, certifiedAt, imageUrl } = view.certification;
        return (
          <CertificationCard
            name={getBosalName(view.member)}
            badge={<BosalStatusBadge status={getBosalStatus(view.member)} />}
            memo={memo}
            time={formatTime(certifiedAt)}
            spent={`-${formatWon(spentAmount ?? 0)}`}
            failed={result === "FAILED"}
            imageUrl={imageUrl}
          />
        );
      }
      case "unverified":
        return (
          <UnverifiedCard
            member={{ ...view.member, name: getBosalName(view.member) }}
            pokes={sentPokes[view.member.memberId]}
          />
        );
    }
  };

  return (
    <section className="flex flex-col gap-1.5 pb-9">
      <div className="flex flex-col gap-2.5 px-5 py-5">
        <Paragraph typography="t6" fontWeight="semibold" color="var(--adaptiveGreyOpacity800)">
          오늘의 보살들
        </Paragraph>
        <Paragraph typography="t7" fontWeight="semibold" color="var(--adaptiveGrey400)">
          화면을 넘겨 인증을 확인해요.
        </Paragraph>
      </div>

      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory [scrollbar-width:none] items-start gap-[18px] overflow-x-auto overscroll-x-contain [&::-webkit-scrollbar]:hidden"
      >
        <div data-page={0} className="flex w-full shrink-0 snap-center justify-center">
          <div className="grid w-[296px] grid-cols-2 gap-2.5">
            {Array.from({ length: MAX_MEMBERS }, (_, index) => today.members[index] ?? null).map(
              (member, index) =>
                // 격자는 늘 네 칸이에요. 빈 칸은 정원 안팎 모두 친구 초대 칸이에요.
                member ? (
                  // 누르면 캐러셀에서 그 보살의 카드로 넘어가요. 캐러셀은 격자와 같은 순서예요.
                  <button
                    key={member.memberId}
                    type="button"
                    aria-label={`${getBosalName(member)}의 인증 보기`}
                    onClick={() => goToPage(index + 1)}
                    className="touch-manipulation appearance-none border-0 bg-transparent p-0 text-left [-webkit-tap-highlight-color:transparent]"
                  >
                    <BosalCard
                      name={getBosalName(member)}
                      color={member.color}
                      status={getBosalStatus(member)}
                      // 🔖 서버는 내가 받은 콕 수만 줘요. 다른 보살의 콕 뱃지는 표시하지 않아요.
                      pokes={member.isMe ? today.me.receivedPokeCount : 0}
                      fallenHairs={member.fallenNabalNumbers}
                      items={member.equippedItemCodes}
                    />
                  </button>
                ) : (
                  <InviteBosalCard
                    key={`invite-${index}`}
                    disabled={isCopying}
                    onClick={() => copyInviteLink()}
                  />
                ),
            )}
          </div>
        </div>
        {today.members.map((member, index) => {
          const view = getBosalCardView(member);
          return (
            <div
              key={member.memberId}
              data-page={index + 1}
              className="flex w-[294px] shrink-0 snap-center flex-col gap-3.5"
            >
              {renderCard(view)}
              {renderAction(view)}
            </div>
          );
        })}
        <div className="flex h-[406px] shrink-0 snap-end items-center pr-5">
          <IconButton
            name="icon-arrow-left-small-mono"
            variant="fill"
            color="var(--adaptiveGrey700)"
            iconSize={24}
            aria-label="처음으로"
            onClick={() => goToPage(0)}
          />
        </div>
      </div>
    </section>
  );
};

export default TodayBosals;
