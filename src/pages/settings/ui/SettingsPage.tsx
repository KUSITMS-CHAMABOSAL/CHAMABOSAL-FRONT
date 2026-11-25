import { Paragraph, Skeleton } from "@toss/tds-mobile";
import { useNavigate } from "react-router";

import { useMeQuery } from "@/entities/session";
import { paths } from "@/shared/config";
import { SettingsList } from "@/widgets/settings/settingsList";

/**
 * 설정 화면이에요. 내 보살의 설정 버튼으로 들어와요.
 */
const SettingsPage = () => {
  const me = useMeQuery();
  const navigate = useNavigate();

  // 처음 받지 못했을 때만 에러 화면이에요. 다시 받기만 실패하면 보던 설정을 그대로 둬요.
  if (!me.data && me.error) throw me.error;

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
            onOpenTerms={() => navigate(paths.terms)}
            onOpenPrivacy={() => navigate(paths.privacy)}
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
