import { useNavigate } from "react-router";
import { Button, Paragraph } from "@toss/tds-mobile";

import { paths } from "@/shared/config";

import glowSafe from "../assets/result_glow_safe.svg";
import statueBody from "../assets/statue_no_vote_body.svg";
import statueFace from "../assets/statue_no_vote_face.svg";
import ResultScene from "./ResultScene";

interface NoVoteProps {
  roomId: number;
}

/**
 * 투표가 열리지 않은 날이에요(시안 투표-13). 인증한 보살이 없어 투표 없이 지나갔어요.
 * 투표가 없는 날은 바로 다음 회차 인증이 열려서 [오늘의 인증하러 가기]로 인증하러 가요(화면설계서 22).
 */
const NoVote = ({ roomId }: NoVoteProps) => {
  const navigate = useNavigate();
  return (
    <ResultScene
      glow={glowSafe}
      title="오늘은 투표가 열리지 않았어요"
      // 줄바꿈이 있으면 Paragraph.Text로 감싸야 두 줄이 겹치지 않아요.
      description={
        <Paragraph.Text>
          인증한 보살이 없었어요
          <br />한 명이라도 인증하면 투표가 열려요
        </Paragraph.Text>
      }
    >
      <div aria-hidden className="relative h-[100px] w-[63px]">
        <img src={statueBody} alt="" className="absolute inset-0 size-full" />
        <img
          src={statueFace}
          alt=""
          className="absolute top-[34.27px] left-[17.97px] h-[23.68px] w-[28.16px]"
        />
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <Paragraph typography="t5" fontWeight="semibold" color="var(--adaptiveGrey900)">
          뽑힌 보살이 없어요
        </Paragraph>
        <Paragraph typography="t7" fontWeight="semibold" color="var(--adaptiveGreyOpacity600)">
          인증한 보살이 없었어요
        </Paragraph>
      </div>
      <Button size="medium" color="dark" onClick={() => navigate(paths.room.certify(roomId))}>
        오늘의 인증하러 가기
      </Button>
    </ResultScene>
  );
};

export default NoVote;
