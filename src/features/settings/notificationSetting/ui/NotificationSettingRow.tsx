import { ListRow, Switch } from "@toss/tds-mobile";

import { useTabBarToast } from "@/shared/lib";

import type { NotificationSettingKey } from "../model/types";
import { useUpdateNotificationSetting } from "../model/useUpdateNotificationSetting";

interface NotificationSettingRowProps {
  setting: NotificationSettingKey;
  label: string;
  checked: boolean;
}

// 앱 안의 알림 설정만 서버에 저장해요. 토스 알림 동의는 [알림받기] 버튼에서 따로 받아요.
/** 알림 설정 한 줄이에요. 스위치를 누르면 바로 서버에 저장해요. */
const NotificationSettingRow = ({ setting, label, checked }: NotificationSettingRowProps) => {
  const { mutate: update } = useUpdateNotificationSetting();
  const openToast = useTabBarToast();

  return (
    <ListRow
      verticalPadding="large"
      contents={<ListRow.Texts type="1RowTypeA" top={label} />}
      right={
        <Switch
          checked={checked}
          aria-label={label}
          onChange={() =>
            update(
              { key: setting, enabled: !checked },
              { onError: () => openToast("알림 설정을 바꾸지 못했어요") },
            )
          }
        />
      }
    />
  );
};

export default NotificationSettingRow;
