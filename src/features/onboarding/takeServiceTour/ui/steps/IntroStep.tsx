import { Paragraph } from "@toss/tds-mobile";

import bosalLarge from "../../assets/bosal_large.svg";
import logo from "../../assets/logo_chamabosal.svg";
import { MATCHED_LAYER } from "../../config/stage";

/** 온보딩-01 서비스 소개예요. 큰 보살은 다음 화면에서 절 앞 작은 보살로 이어져요. */
const IntroStep = () => (
  <>
    <div
      data-match={MATCHED_LAYER.bosal}
      className="absolute top-[285px] left-4 h-[540px] w-[342px] origin-top-left"
    >
      <img src={bosalLarge} alt="" className="size-full" />
    </div>
    <div className="absolute inset-x-0 top-8 flex flex-col items-center gap-8 p-6">
      <img src={logo} alt="Chama!bosal" className="h-[50px] w-[272.22px]" />
      <div className="flex flex-col items-center gap-2 text-center whitespace-pre">
        <Paragraph typography="t6" fontWeight="medium" color="var(--adaptiveGreyOpacity600)">
          참아보살
        </Paragraph>
        <Paragraph typography="st5" fontWeight="bold" color="var(--adaptiveGrey900)">
          {"지름신 대신 참아보살,\n함께 참는 절약 서비스"}
        </Paragraph>
      </div>
    </div>
  </>
);

export default IntroStep;
