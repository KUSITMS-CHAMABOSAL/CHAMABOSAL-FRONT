import { Navigate, useNavigate } from "react-router";
import { Result } from "@toss/tds-mobile";

import type { VoteView } from "@/entities/vote";
import { useCopyInviteLink } from "@/features/room/shareInvite";
import { paths } from "@/shared/config";
import { useTabBarToast } from "@/shared/lib";

import { VOTE_EMOJI } from "../config/emoji";
import EmojiFigure from "./EmojiFigure";
import VoteHeader from "./VoteHeader";

interface VoteBoardProps {
  roomId: number;
  view: VoteView;
  /** 투표 마감 시각이 지나면 불러요. 투표 탭 상태를 다시 받아요. */
  onVoteClosed: () => void;
}

// 안내는 시안처럼 화면 높이의 20.6%(812 시안에서 상단 바 아래 148px)부터 놓여요.
const NOTICE_TOP = "pt-[20.6svh]";

/** 투표 탭이에요. 상태마다 안내, 투표, 결과 화면을 골라 보여줘요. */
const VoteBoard = ({ roomId, view, onVoteClosed }: VoteBoardProps) => {
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
    // 투표하기와 결과 화면은 다음 단계에서 채워요.
    case "voting":
    case "result":
      return null;
  }
};

export default VoteBoard;
