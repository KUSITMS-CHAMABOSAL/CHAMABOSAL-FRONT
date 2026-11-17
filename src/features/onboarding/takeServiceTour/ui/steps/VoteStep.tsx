import phoneFrame from "../../assets/mockup_phone_frame.png";
import statusBar from "../../assets/mockup_status_bar.png";
import voteLeftScreen from "../../assets/mockup_vote_left_screen.png";
import voteRightScreen from "../../assets/mockup_vote_right_screen.png";
import TourTitle from "../TourTitle";

/**
 * 온보딩-05 투표예요. 휴대폰 목업 둘을 시안의 조각(화면, 상태바, 테두리) 그대로 겹쳐요.
 * 통째로 내보낸 이미지는 프레임 배경이 칠해져 있어 위에 겹친 왼쪽 폰이 오른쪽 폰을 가려서 쓰지 않아요.
 */
const VoteStep = () => (
  <>
    <img
      src={voteRightScreen}
      alt=""
      className="absolute top-[53.05px] left-[196.24px] h-[237.03px] w-[109.46px] rounded-2xl object-cover"
    />
    <div className="absolute top-[53px] left-[197px] h-4 w-[109px] rounded-t-full bg-white" />
    <img
      src={statusBar}
      alt=""
      className="absolute top-[54px] left-[196px] h-4 w-[110px] rounded-t-full object-cover"
    />
    <img
      src={phoneFrame}
      alt=""
      className="absolute top-[35px] left-[172.8px] h-[271.36px] w-[156.44px] max-w-none object-cover"
    />
    <img
      src={voteLeftScreen}
      alt=""
      className="absolute top-[152.85px] left-[70.43px] h-[237.84px] w-[109.5px] rounded-2xl object-cover"
    />
    <div className="absolute top-[152px] left-[71px] h-4 w-[109px] rounded-t-full bg-white" />
    <img
      src={statusBar}
      alt=""
      className="absolute top-[153px] left-[70px] h-4 w-[110px] rounded-t-full object-cover"
    />
    <img
      src={phoneFrame}
      alt=""
      className="absolute top-[134.74px] left-[47px] h-[272.26px] w-[156.95px] max-w-none object-cover"
    />
    <TourTitle
      matched
      title="누가 제일 못 참았나요?"
      description={"서로의 인증을 보고\n가장 못 참은 사람에게 투표해요"}
      className="top-[441px]"
    />
  </>
);

export default VoteStep;
