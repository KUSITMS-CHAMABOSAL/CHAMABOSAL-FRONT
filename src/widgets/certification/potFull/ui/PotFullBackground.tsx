import glow from "../assets/glow.svg";

/**
 * 화면 뒤 배경(시안 Background-FullOfRice의 빛)이에요. 인터랙션이 건드리지 않는 원본 레이어예요.
 * 밥더미와 쌀알은 쌓이면서 커지도록 `RiceFall`이 그려요. 시안 밥더미에 있던 회색 쉐도우 레이어 두 개는 뺐어요.
 */
const PotFullBackground = () => (
  <img
    src={glow}
    alt=""
    width={738}
    height={845}
    // 시안은 375px 폭 기준이라 화면이 넓어지면 타원의 둥근 양끝이 드러나 쉐도우처럼 보여요. 화면 폭에 비례해 가로로 늘려요.
    className="pointer-events-none absolute -top-[174px] left-[calc(50%-0.5px)] h-[845px] w-[calc(100%*738/375)] max-w-none -translate-x-1/2 -scale-y-100 select-none"
  />
);

export default PotFullBackground;
