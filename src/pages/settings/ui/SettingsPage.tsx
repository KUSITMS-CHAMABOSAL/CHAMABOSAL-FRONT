import { Paragraph, useToast } from "@toss/tds-mobile";

import { useMeQuery } from "@/entities/session";
import { SettingsList } from "@/widgets/settings/settingsList";

/**
 * 설정 화면이에요. 내 보살의 설정 버튼으로 들어와요.
 */
const SettingsPage = () => {
  const me = useMeQuery();
  const { openToast } = useToast();

  if (!me.data) {
    if (me.error) throw me.error;
    // 🔖 로딩 시안이 없어 아직 아무것도 그리지 않아요.
    return null;
  }

  return (
    <main className="min-h-svh bg-(--adaptiveBackground)">
      <div className="mt-4.5 flex h-11 items-center justify-center">
        <Paragraph as="h1" typography="t5" fontWeight="bold" color="var(--adaptiveGrey900)">
          설정
        </Paragraph>
      </div>
      <div className="mt-2.5">
        <SettingsList
          me={me.data}
          // 🔖 약관 화면은 각 이슈에서 연결해요.
          onOpenTerms={() => openToast("이용약관은 준비 중이에요")}
          onOpenPrivacy={() => openToast("개인정보처리방침은 준비 중이에요")}
        />
      </div>
    </main>
  );
};

export default SettingsPage;
