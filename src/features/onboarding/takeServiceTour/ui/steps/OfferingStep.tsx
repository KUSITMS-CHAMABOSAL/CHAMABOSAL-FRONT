import phoneFrame from "../../assets/mockup_phone_frame.png";
import statusBar from "../../assets/mockup_status_bar.png";
import storehouseCard from "../../assets/mockup_storehouse_card.png";
import storehouseScreen from "../../assets/mockup_storehouse_screen.png";
import rice from "../../assets/rice.svg";
import TourTitle from "../TourTitle";

/**
 * 온보딩-08 공양미와 아이템이에요. 밥 구름과 쌀알은 한 장으로 합쳤어요(뒤집기·회전은 시안 값 그대로).
 * 휴대폰 목업은 시안의 조각(테두리, 화면, 상태바, 보살 카드) 그대로 겹쳐요.
 * 통째로 내보낸 이미지는 프레임 배경이 칠해져 있어 쓰지 않아요.
 */
const OfferingStep = () => (
  <>
    <img
      src={rice}
      alt=""
      className="absolute top-[138px] left-[-37.9px] h-[851.69px] w-[451.81px] max-w-none"
    />
    <TourTitle
      title="공양미를 모아, 아이템을 사요"
      description="세상에 하나뿐인 나만의 보살을 만들어요"
      className="top-[47px]"
    />
    <img
      src={phoneFrame}
      alt=""
      className="absolute top-[140.4px] left-[83px] h-[362.21px] w-[208.81px] max-w-none object-cover"
    />
    <img
      src={storehouseScreen}
      alt=""
      className="absolute top-[165.03px] left-[114px] h-[315.95px] w-[146px] rounded-[18px] object-cover"
    />
    <div className="absolute top-[165px] left-[114px] h-[22px] w-[146px] rounded-t-full bg-white" />
    <img
      src={statusBar}
      alt=""
      className="absolute top-[165px] left-[114px] h-[22px] w-[146px] rounded-t-full object-cover"
    />
    <div className="border-mockup-border absolute top-[205px] left-[84px] h-[129px] w-[207px] rounded-[20px] border-2 border-solid bg-white" />
    <div className="absolute top-[219.45px] left-[118.96px] h-[99.91px] w-[142px] overflow-hidden">
      <img
        src={storehouseCard}
        alt=""
        className="absolute top-0 left-[-4.3%] h-full w-[104.31%] max-w-none"
      />
    </div>
  </>
);

export default OfferingStep;
