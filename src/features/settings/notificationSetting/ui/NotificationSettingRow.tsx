import { ListRow, Switch, useToast } from "@toss/tds-mobile";

import type { NotificationSettingKey } from "../model/types";
import { useUpdateNotificationSetting } from "../model/useUpdateNotificationSetting";

interface NotificationSettingRowProps {
  setting: NotificationSettingKey;
  label: string;
  checked: boolean;
}

/** 시안 설정 항목 글자예요. 17px 보통 굵기, 가장 진한 글자색이에요. */
const ROW_TEXT = { fontWeight: "regular", color: "var(--adaptiveGrey900)" } as const;

// 앱 안의 알림 설정만 서버에 저장해요. 토스 알림 동의는 [알림받기] 버튼에서 따로 받아요.
/** 알림 설정 한 줄이에요. 스위치를 누르면 바로 서버에 저장해요. */
const NotificationSettingRow = ({ setting, label, checked }: NotificationSettingRowProps) => {
  const { mutate: update } = useUpdateNotificationSetting();
  const { openToast } = useToast();

  return (
    // 시안처럼 줄 높이 64px에 구분선 1px을 더해 65px이에요. TDS 최소 높이(44px)를 이기려고 !를 붙이고, 구분선은 목록에서 그려요.
    <ListRow
      verticalPadding="large"
      className="min-h-16!"
      contents={<ListRow.Texts type="1RowTypeA" top={label} topProps={ROW_TEXT} />}
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
