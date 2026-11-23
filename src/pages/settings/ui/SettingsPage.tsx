import { Paragraph, Skeleton, useToast } from "@toss/tds-mobile";

import { useMeQuery } from "@/entities/session";
import { SettingsList } from "@/widgets/settings/settingsList";

/**
 * 설정 화면이에요. 내 보살의 설정 버튼으로 들어와요.
 */
const SettingsPage = () => {
  const me = useMeQuery();
  const { openToast } = useToast();

  if (me.error) throw me.error;

  return (
    <main className="min-h-svh bg-(--adaptiveBackground)">
      <div className="mt-4.5 flex h-11 items-center justify-center">
        <Paragraph as="h1" typography="t5" fontWeight="bold" color="var(--adaptiveGrey900)">
          설정
        </Paragraph>
      </div>
      <div className="mt-2.5">
        {me.data ? (
          <SettingsList
            me={me.data}
            // 🔖 약관 화면은 각 이슈에서 연결해요.
            onOpenTerms={() => openToast("이용약관은 준비 중이에요")}
            onOpenPrivacy={() => openToast("개인정보처리방침은 준비 중이에요")}
          />
        ) : (
          // 제목은 그대로 두고 알림 4개와 약관·데이터 삭제 3개 자리만 비워요.
          <Skeleton pattern="listOnly" repeatLastItemCount={7} />
        )}
      </div>
    </main>
  );
};

export default SettingsPage;
