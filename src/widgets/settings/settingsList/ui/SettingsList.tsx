import { ListRow } from "@toss/tds-mobile";

import type { MeResponse } from "@/entities/session";
import { DeleteMyDataRow } from "@/features/settings/deleteMyData";
import { NotificationSettingRow } from "@/features/settings/notificationSetting";

interface SettingsListProps {
  me: MeResponse;
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
}

/** 설정 화면 목록이에요. 알림 설정, 약관, 내 데이터 삭제를 모아요. */
const SettingsList = ({ me, onOpenTerms, onOpenPrivacy }: SettingsListProps) => (
  <section>
    <NotificationSettingRow
      setting="isPokePushEnabled"
      label="콕 알림"
      checked={me.isPokePushEnabled}
    />
    <NotificationSettingRow
      setting="isResultPushEnabled"
      label="투표 결과 알림"
      checked={me.isResultPushEnabled}
    />
    <NotificationSettingRow
      setting="isVoteOpenedPushEnabled"
      label="새 투표 알림"
      checked={me.isVoteOpenedPushEnabled}
    />
    <NotificationSettingRow
      setting="isCertReminderPushEnabled"
      label="인증 마감 알림"
      checked={me.isCertReminderPushEnabled}
    />
    <ListRow
      verticalPadding="large"
      withArrow
      contents={<ListRow.Texts type="1RowTypeA" top="이용약관" />}
      onClick={onOpenTerms}
    />
    <ListRow
      verticalPadding="large"
      withArrow
      contents={<ListRow.Texts type="1RowTypeA" top="개인정보처리방침" />}
      onClick={onOpenPrivacy}
    />
    <DeleteMyDataRow />
  </section>
);

export default SettingsList;
