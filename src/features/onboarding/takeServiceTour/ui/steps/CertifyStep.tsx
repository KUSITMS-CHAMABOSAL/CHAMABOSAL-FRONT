import certifyCard from "../../assets/mockup_certify_card.png";
import certifyFrame from "../../assets/mockup_certify_frame.png";
import certifyScreen from "../../assets/mockup_certify_screen.png";
import statusBar from "../../assets/mockup_status_bar.png";
import TourTitle from "../TourTitle";

/**
 * 온보딩-04 번뇌 인증이에요. 휴대폰 목업은 시안 이미지를 겹친 구조 그대로예요.
 * 목업이 화면 아래로 이어지므로 잘린 내보내기 이미지 대신 원본 조각을 써서 키 큰 화면에서도 끊기지 않아요.
 */
const CertifyStep = () => (
  <>
    <TourTitle
      matched
      title="오늘의 번뇌를 인증해요"
      description="사고 싶었던 것이나, 못 참고 구매한 것을 올려요"
      className="top-[23px]"
    />
    <div className="absolute top-[144px] left-[118px] h-[158px] w-[140px] overflow-hidden rounded-t-xl">
      <img
        src={certifyCard}
        alt=""
        className="absolute top-[-22.36%] left-0 h-[191.56%] w-[99.87%] max-w-none"
      />
    </div>
    <img
      src={certifyScreen}
      alt=""
      className="absolute top-[309.08px] left-[63.06px] h-[538.9px] w-[248.87px] rounded-[31px] object-cover"
    />
    <div className="absolute top-[308px] left-[64px] h-[37px] w-[247px] rounded-t-full bg-white" />
    <div className="absolute top-[309px] left-[63px] h-[36px] w-[249px] overflow-hidden rounded-t-full">
      <img
        src={statusBar}
        alt=""
        className="absolute top-0 left-[1.85%] h-full w-[96.3%] max-w-none"
      />
    </div>
    <img
      src={certifyFrame}
      alt=""
      className="absolute top-[267px] left-[9.28px] h-[371.6px] w-[357.31px] max-w-none object-cover"
    />
  </>
);

export default CertifyStep;
