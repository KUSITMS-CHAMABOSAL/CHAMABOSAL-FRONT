import { useEffect } from "react";

import { Badge, Border, BottomCTA, Paragraph, TableRow } from "@toss/tds-mobile";
import { Link } from "react-router";

import { ROOM_GOAL_LABEL, type RoomSummary } from "@/entities/room";
import { paths } from "@/shared/config";
import { logEvent } from "@/shared/lib/appsInToss";

import envelopeFlap from "../assets/envelope_flap.svg";
import envelopeFlower from "../assets/envelope_flower.svg";

const RowTitle = ({ children }: { children: string }) => (
  <Paragraph typography="st10" fontWeight="bold" color="var(--adaptiveGrey900)">
    {children}
  </Paragraph>
);

const RowValue = ({ children }: { children: string }) => (
  <Paragraph typography="st10" color="var(--adaptiveGreyOpacity700)">
    {children}
  </Paragraph>
);

/**
 * 이번 실행에서 초대 미리보기를 봤다고 이미 보냈는지예요. 가입 완료율의 분모라서,
 * 닉네임에서 뒤로 돌아와 미리보기가 다시 그려져도 한 번만 세요.
 */
let hasLoggedView = false;

interface InvitePreviewProps {
  room: RoomSummary;
  /** 초대한 사람이 나갔으면 null이라 배지를 그리지 않아요. */
  inviterNickname: string | null;
  onJoin: () => void;
}

/**
 * 초대 링크로 들어온 사람이 보는 방 소개예요. 시안 1-1의 세 프레임처럼 봉투가 열리며 방 소개가 나타나요.
 * 화면에 들어올 때 한 번 재생해서 CSS 키프레임으로 충분해요. 모션 감소 설정이면 바로 열린 봉투(끝 화면)예요.
 */
const InvitePreview = ({ room, inviterNickname, onJoin }: InvitePreviewProps) => {
  useEffect(() => {
    if (hasLoggedView) return;
    hasLoggedView = true;
    logEvent("invite_preview_view", { inviter_shown: inviterNickname !== null });
  }, [inviterNickname]);

  return (
    <main className="flex min-h-svh flex-col bg-white bg-[linear-gradient(to_bottom,var(--adaptiveBlue100),var(--color-invite-mint)_44.23%,var(--color-invite-mint-light))]">
      <div className="flex grow items-center justify-center px-5 py-6">
        <div className="relative flex h-[174px] w-[299px] items-center justify-center overflow-hidden rounded-2xl bg-(--adaptiveBackground) px-5 shadow-[0_0_12px_rgb(167_167_167/0.25)]">
          <div className="motion-safe:animate-envelope-text-in flex flex-col items-center gap-4.5 text-center whitespace-pre-line">
            <Paragraph typography="st5" fontWeight="bold" color="var(--adaptiveGreen700)">
              {room.goalTitle}
            </Paragraph>
            <Paragraph typography="t6" fontWeight="semibold" color="var(--adaptiveGreyOpacity700)">
              {room.goalDescription}
            </Paragraph>
          </div>
          {/*
          봉투 조각은 끝 화면에서 사라져서 원래 스타일을 투명으로 두고 애니메이션 동안만 보여요.
          덮개는 띠(위 30px) 아래 삼각형만 납작해지도록 띠 아래 선(26px)을 기준으로 세로로 줄여요.
        */}
          <img
            src={envelopeFlap}
            alt=""
            width={299}
            height={140}
            className="motion-safe:animate-envelope-flap pointer-events-none absolute top-0 left-0 max-w-none origin-[50%_26px] opacity-0"
          />
          <img
            src={envelopeFlower}
            alt=""
            width={32}
            height={32}
            className="motion-safe:animate-envelope-fade-out pointer-events-none absolute top-24.25 left-33 opacity-0"
          />
          {inviterNickname && (
            <div
              aria-hidden
              className="motion-safe:animate-envelope-fade-out pointer-events-none absolute inset-x-0 top-5.5 flex justify-center opacity-0"
            >
              <Badge size="large" color="green" variant="fill">
                {`${inviterNickname}님의 초대`}
              </Badge>
            </div>
          )}
        </div>
      </div>
      <section className="flex shrink-0 flex-col rounded-t-3xl bg-(--adaptiveBackground) pt-13 shadow-[0_-1px_3px_rgb(0_27_55/0.1)]">
        {/* TableRow는 기본이 li라 목록 밖에서는 div로 그려요. */}
        <TableRow
          as="div"
          align="space-between"
          left={<RowTitle>참여 목표</RowTitle>}
          right={<RowValue>{ROOM_GOAL_LABEL[room.goal]}</RowValue>}
        />
        {/* Border는 flex 안에서 너비가 0으로 줄어서 블록으로 감싸요. */}
        <div className="my-1.5">
          <Border variant="full" />
        </div>
        <TableRow
          as="div"
          align="space-between"
          left={<RowTitle>함께 하는 보살</RowTitle>}
          right={<RowValue>{`${room.memberCount}명`}</RowValue>}
        />
        {/* 시안은 표와 버튼 사이가 101px이에요. 작은 화면에서는 줄어들어요. */}
        <div aria-hidden className="min-h-6 shrink basis-[101px]" />
        <BottomCTA
          background="none"
          onClick={onJoin}
          bottomAccessory={
            // 시안처럼 버튼 아래 12px에 놓여요. 인트로처럼 약관 이름에 밑줄을 그어 누를 수 있게 해요.
            <Paragraph
              className="-mt-3.5! text-center"
              typography="t7"
              fontWeight="semibold"
              color="var(--adaptiveGreyOpacity600)"
            >
              {/* 링크는 문단의 글자 스타일을 물려받지 않아서 같은 값을 넘기고, 둘레 글자도 Text로 감싸요. */}
              <Paragraph.Text>시작하면 </Paragraph.Text>
              <Paragraph.Link
                as={Link}
                to={paths.terms}
                type="underline"
                typography="t7"
                fontWeight="semibold"
                color="var(--adaptiveGreyOpacity600)"
              >
                <Paragraph.Text>이용약관</Paragraph.Text>
              </Paragraph.Link>
              <Paragraph.Text>과 </Paragraph.Text>
              <Paragraph.Link
                as={Link}
                to={paths.privacy}
                type="underline"
                typography="t7"
                fontWeight="semibold"
                color="var(--adaptiveGreyOpacity600)"
              >
                <Paragraph.Text>개인정보처리방침</Paragraph.Text>
              </Paragraph.Link>
              <Paragraph.Text>에 동의하게 돼요</Paragraph.Text>
            </Paragraph>
          }
        >
          참여하기
        </BottomCTA>
      </section>
    </main>
  );
};

export default InvitePreview;
