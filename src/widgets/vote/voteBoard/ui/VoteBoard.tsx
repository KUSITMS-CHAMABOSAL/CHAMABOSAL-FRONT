import type { CSSProperties } from "react";
import { Navigate, useNavigate } from "react-router";
import { Result } from "@toss/tds-mobile";

import type { MyRoom } from "@/entities/session";
import type { VoteView } from "@/entities/vote";
import { useCopyInviteLink } from "@/features/room/shareInvite";
import { paths } from "@/shared/config";
import { useTabBarToast } from "@/shared/lib";

import { VOTE_EMOJI } from "../config/emoji";
import EmojiFigure from "./EmojiFigure";
import NoVote from "./NoVote";
import RoomTabs from "./RoomTabs";
import VoteHeader from "./VoteHeader";
import VoteResult from "./VoteResult";
import Voting from "./Voting";

interface VoteBoardProps {
  roomId: number;
  /** 참여 중인 방이에요. 둘이면 위에 방 탭을 그려요. */
  rooms: MyRoom[];
  view: VoteView;
  onSelectRoom: (roomId: number) => void;
  /** 투표 마감 시각이 지나면 불러요. 투표 탭 상태를 다시 받아요. */
  onVoteClosed: () => void;
}

// 안내는 시안처럼 화면 높이의 20.6%(812 시안에서 상단 바 아래 148px)부터 놓여요.
// 방 탭이 있어도 시안은 안내 자리를 그대로 둬서, 탭 높이만큼 빼요.
const NOTICE_TOP = "pt-[calc(20.6svh-var(--room-tabs-height,0px))]";
/** TDS Tab(small) 높이예요. 브라우저에서 잰 값이에요(시안은 38px). */
const ROOM_TABS_HEIGHT = "37px";

/** 투표 탭이에요. 위에 방 탭을 두고, 상태마다 안내, 투표, 결과 화면을 골라 보여줘요. */
const VoteBoard = ({ roomId, rooms, view, onSelectRoom, onVoteClosed }: VoteBoardProps) => {
  const roomTabs = <RoomTabs rooms={rooms} roomId={roomId} onSelectRoom={onSelectRoom} />;

  // 후보 고르기 단계는 시안에 방 탭이 없어서 Voting이 미리보기에서만 그려요.
  if (view.kind === "voting")
    return (
      <Voting
        roomId={roomId}
        roundId={view.roundId}
        roomTabs={roomTabs}
        closesAt={view.closesAt}
        candidates={view.candidates}
        canVote={view.canVote}
        onVoteClosed={onVoteClosed}
      />
    );

  return (
    <div
      style={{ "--room-tabs-height": rooms.length > 1 ? ROOM_TABS_HEIGHT : "0px" } as CSSProperties}
    >
      {roomTabs}
      <VoteContent roomId={roomId} view={view} onVoteClosed={onVoteClosed} />
    </div>
  );
};

interface VoteContentProps {
  roomId: number;
  view: Exclude<VoteView, { kind: "voting" }>;
  onVoteClosed: () => void;
}

/** 방 탭 아래 내용이에요. */
const VoteContent = ({ roomId, view, onVoteClosed }: VoteContentProps) => {
  const navigate = useNavigate();
  const openToast = useTabBarToast();
  const { mutate: copyInviteLink, isPending: isCopying } = useCopyInviteLink(roomId, openToast);

  switch (view.kind) {
    case "beforeFirstVote":
      return (
        <div className={NOTICE_TOP}>
          <Result
            figure={<EmojiFigure {...VOTE_EMOJI.eyes} />}
            title="아직 인증하지 않은 보살이 있어요"
            description={
              <>
                투표를 기다리고 있는 보살들을 위해
                <br />
                깨워볼까요?
              </>
            }
            button={
              // 나만 인증하지 않았으면 깨울 친구가 없어 버튼을 빼요.
              // 🔖 이 경우 시안이 없어요. 홈에서 첫 미인증 멤버 카드를 고른 채로 여는 것도 아직 없어요.
              view.firstUncertifiedMember ? (
                <Result.Button onClick={() => navigate(paths.room.home(roomId))}>
                  콕 찌르러 가기
                </Result.Button>
              ) : undefined
            }
          />
        </div>
      );
    case "underThree":
      return (
        <div className={NOTICE_TOP}>
          <Result
            figure={<EmojiFigure {...VOTE_EMOJI.tippingHand} />}
            title={
              <>
                보살이 3명 이상 모이면
                <br />
                투표 기능을 사용할 수 있어요
              </>
            }
            button={
              <Result.Button loading={isCopying} onClick={() => copyInviteLink()}>
                친구 초대하기
              </Result.Button>
            }
          />
        </div>
      );
    case "notInList":
      return (
        <div className={NOTICE_TOP}>
          <Result
            figure={<EmojiFigure {...VOTE_EMOJI.ballotBox} />}
            title="다음 회차부터 참여 가능해요"
            description={
              <>
                투표가 시작된 뒤에 입장해서
                <br />
                다음 투표부터 참여할 수 있어요
              </>
            }
          />
        </div>
      );
    case "voted":
      return (
        <>
          <VoteHeader closesAt={view.closesAt} onClosed={onVoteClosed} />
          <div className="pt-[11svh]">
            <Result
              figure={<EmojiFigure {...VOTE_EMOJI.lotusPosition} />}
              title="투표 완료!"
              description={
                <>
                  <span className="text-(color:--adaptiveBlue600)!">{view.votedCount}</span>
                  {` / ${view.voterCount}명 투표했어요`}
                  <br />
                  모두가 투표하면 결과가 공개돼요
                </>
              }
            />
          </div>
        </>
      );
    case "moktak":
      return <Navigate to={paths.room.tapTap(roomId, view.roundId)} replace />;
    case "result":
      return <VoteResult roomId={roomId} roundId={view.roundId} isSeen={view.isSeen} />;
    case "noVote":
      return <NoVote roomId={roomId} />;
  }
};

export default VoteBoard;
