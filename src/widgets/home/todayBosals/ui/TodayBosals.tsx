import { useRef, useState } from "react";

import { Button, IconButton, Paragraph, useToast } from "@toss/tds-mobile";

import { BosalCard, BosalStatusBadge, EmptyBosalCard } from "@/entities/bosal";
import { CertificationCard } from "@/entities/certification";
import type { TodayMember, TodayResponse } from "@/entities/room";
import { EditCertificationActions } from "@/features/certification/editCertification";
import {
  ReactionButtons,
  useReactCertification,
} from "@/features/certification/reactCertification";
import { PokeButton, usePokeMember } from "@/features/member/pokeMember";
import { formatTime, formatWon } from "@/shared/lib";

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
 * 오늘의 보살들이에요. 첫 장은 격자이고, 옆으로 넘기면 자리마다 카드가 캐러셀로 이어져요.
 * 격자는 누르지 않고 넘겨서 봐요. 빈자리는 친구 입장 전 카드예요. 끝에는 격자로 돌아가는 버튼이 있어요.
 *
 * 넘기기는 브라우저 기본 가로 스크롤과 scroll-snap이에요. 드래그, 관성, 멈출 자리 맞추기를 WebView가
 * 합성 스레드에서 처리해서 자바스크립트 없이 부드럽고, 드래그 라이브러리가 필요 없어요.
 */
const TodayBosals = ({ today, onCertify, onEditCertification }: TodayBosalsProps) => {
  const { roomId, memberLimit } = today.room;
  const scrollerRef = useRef<HTMLDivElement>(null);
  /** 이 화면에서 찌른 횟수예요. 서버는 내가 받은 콕만 알려줘서 움찔 연출에만 써요. */
  const [sentPokes, setSentPokes] = useState<Record<number, number>>({});
  const { openToast } = useToast();
  const poke = usePokeMember(roomId, () =>
    openToast("콕 찌르지 못했어요. 잠시 후 다시 시도해 주세요"),
  );
  const { mutate: react, isPending: isReacting } = useReactCertification(roomId);
  const slots = Array.from({ length: memberLimit }, (_, index) => today.members[index] ?? null);

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
      case "waiting":
        return null;
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
            disabled={isReacting}
            onChange={reaction =>
              react(
                { certificationId: view.certification.certificationId, reaction },
                { onError: () => openToast("리액션을 남기지 못했어요") },
              )
            }
          />
        );
      case "unverified":
        return view.member.isMe ? (
          <Button size="xlarge" color="dark" variant="weak" display="block" onClick={onCertify}>
            오늘의 인증 남기기
          </Button>
        ) : (
          <div className="flex justify-center">
            <PokeButton onPoke={() => pokeMember(view.member)} />
          </div>
        );
    }
  };

  const renderCard = (view: BosalCardView) => {
    switch (view.kind) {
      case "waiting":
        return <UnverifiedCard />;
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
            {slots.map((member, index) =>
              member ? (
                <BosalCard
                  key={member.memberId}
                  name={getBosalName(member)}
                  color={member.color}
                  status={getBosalStatus(member)}
                  // 🔖 서버는 내가 받은 콕 수만 줘요. 다른 보살의 콕 뱃지는 표시하지 않아요.
                  pokes={member.isMe ? today.me.receivedPokeCount : 0}
                />
              ) : (
                <EmptyBosalCard key={`empty-${index}`} />
              ),
            )}
          </div>
        </div>
        {slots.map((member, index) => {
          const view = getBosalCardView(member);
          return (
            <div
              key={member?.memberId ?? `empty-${index}`}
              data-page={index + 1}
              className="flex w-[294px] shrink-0 snap-center flex-col gap-3.5"
            >
              {renderCard(view)}
              {renderAction(view)}
            </div>
          );
        })}
        <div className="flex h-[406px] w-[120px] shrink-0 snap-center items-center justify-center">
          <IconButton
            name="icon-arrow-left-small-mono"
            variant="fill"
            color="var(--adaptiveGrey700)"
            iconSize={24}
            aria-label="처음으로"
            onClick={() => goToPage(0)}
          />
        </div>
        {/* 끝 버튼도 가운데에 멈추도록 여백을 둬요. 버튼 칸 절반 60px + 간격 18px */}
        <div aria-hidden className="w-[calc(50%-78px)] shrink-0" />
      </div>
    </section>
  );
};

export default TodayBosals;
