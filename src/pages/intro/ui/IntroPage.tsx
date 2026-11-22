import { BottomCTA, Paragraph } from "@toss/tds-mobile";
import { useNavigate } from "react-router";

import { paths } from "@/shared/config";

import IntroHero from "./IntroHero";

/** 참여 중인 방이 없을 때 보는 첫 화면이에요. 방을 만들거나, 초대받았다면 받은 링크로 들어와요. */
const IntroPage = () => {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-svh flex-col items-center bg-[linear-gradient(-25.22deg,var(--adaptiveYellow50)_3.97%,var(--color-mint-75)_63.07%,var(--color-mint-100))] text-center">
      {/* 그림과 문구 묶음을 버튼 위 공간의 가운데에 둬요. 좁은 화면에서도 위 27, 아래 32는 남겨요. */}
      <div aria-hidden className="min-h-[27px] grow" />
      <IntroHero />
      <div className="mt-8 flex flex-col items-center gap-2.5">
        <Paragraph typography="t6" fontWeight="semibold" color="var(--adaptiveBlue600)">
          친구와 함께하는 절약 챌린지
        </Paragraph>
        <Paragraph typography="t1" fontWeight="bold" color="var(--adaptiveGrey900)">
          오늘의 유혹,
          <br />
          같이 참아봐요.
        </Paragraph>
        <Paragraph typography="t6" fontWeight="semibold" color="var(--adaptiveGreyOpacity700)">
          참은 순간을 인증하고 친구들과 응원해요.
          <br />
          흔들린 날엔 이마를 톡톡, 다시 맑게!
        </Paragraph>
      </div>
      <div aria-hidden className="min-h-8 grow" />
      {/* 작은 화면에서 고정 버튼이 문구를 가리지 않도록 화면 흐름 안의 맨 아래에 둬요. */}
      <BottomCTA
        className="w-full"
        background="none"
        onClick={() => navigate(paths.createRoom)}
        bottomAccessory={
          <div className="-mt-2 flex flex-col items-center gap-2 text-center">
            <Paragraph typography="t7" fontWeight="medium" color="var(--adaptiveGrey900)">
              초대받았다면 친구에게 받은 링크로 들어와주세요.
            </Paragraph>
            {/* 🔖 약관 화면(/terms, /privacy)이 생기면 링크로 바꿔요. */}
            <Paragraph typography="st12" color="var(--adaptiveGreyOpacity700)">
              시작하면 <span className="underline">이용약관</span>과{" "}
              <span className="underline">개인정보처리방침</span>에 동의하게 돼요.
            </Paragraph>
          </div>
        }
      >
        방 만들기
      </BottomCTA>
    </main>
  );
};

export default IntroPage;
