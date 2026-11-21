import { Border, ListRow } from "@toss/tds-mobile";

import type { MeResponse } from "@/entities/session";
import { DeleteMyDataRow } from "@/features/settings/deleteMyData";
import { NotificationSettingRow } from "@/features/settings/notificationSetting";

interface SettingsListProps {
  me: MeResponse;
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
}

/** 시안 설정 항목 글자예요. 17px 보통 굵기, 가장 진한 글자색이에요. */
const ROW_TEXT = { fontWeight: "regular", color: "var(--adaptiveGrey900)" } as const;

/** 설정 화면 목록이에요. 알림 설정, 약관, 내 데이터 삭제를 모아요. 시안처럼 줄마다 아래에 구분선이 있어요. */
const SettingsList = ({ me, onOpenTerms, onOpenPrivacy }: SettingsListProps) => (
  <section>
    <NotificationSettingRow
      setting="isPokePushEnabled"
      label="콕 알림"
      checked={me.isPokePushEnabled}
    />
    <Border variant="full" />
    <NotificationSettingRow
      setting="isResultPushEnabled"
      label="투표 결과 알림"
      checked={me.isResultPushEnabled}
    />
    <Border variant="full" />
    <NotificationSettingRow
      setting="isVoteOpenedPushEnabled"
      label="새 투표 알림"
      checked={me.isVoteOpenedPushEnabled}
    />
    <Border variant="full" />
    <NotificationSettingRow
      setting="isCertReminderPushEnabled"
      label="인증 마감 알림"
      checked={me.isCertReminderPushEnabled}
    />
    <Border variant="full" />
    <ListRow
      verticalPadding="large"
      className="min-h-16!"
      withArrow
      contents={<ListRow.Texts type="1RowTypeA" top="이용약관" topProps={ROW_TEXT} />}
      onClick={onOpenTerms}
    />
    <Border variant="full" />
    <ListRow
      verticalPadding="large"
      className="min-h-16!"
      withArrow
      contents={<ListRow.Texts type="1RowTypeA" top="개인정보처리방침" topProps={ROW_TEXT} />}
      onClick={onOpenPrivacy}
    />
    <Border variant="full" />
    <DeleteMyDataRow />
    <Border variant="full" />
  </section>
);

export default SettingsList;
