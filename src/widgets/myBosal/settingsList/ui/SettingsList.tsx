import { ListRow, Paragraph, TableRow } from "@toss/tds-mobile";

import type { MeResponse } from "@/entities/session";
import { DeleteMyDataRow } from "@/features/settings/deleteMyData";
import { NotificationSettingRow } from "@/features/settings/notificationSetting";

interface SettingsListProps {
  me: MeResponse;
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
}

// 🔖 시안의 제목 오른쪽 "2/2"는 뜻을 몰라 넣지 않았어요. 디자이너 확인이 필요해요.
/** 내 보살 아래쪽 설정이에요. 알림 설정, 약관, 내 데이터 삭제를 모아요. */
const SettingsList = ({ me, onOpenTerms, onOpenPrivacy }: SettingsListProps) => (
  <section className="pt-3">
    <TableRow
      align="space-between"
      left={
        <Paragraph typography="t6" fontWeight="bold" color="var(--adaptiveGrey900)">
          설정
        </Paragraph>
      }
      right={null}
    />
    <NotificationSettingRow
      setting="isPokePushEnabled"
      label="콕 알림"
      checked={me.isPokePushEnabled}
    />
    <NotificationSettingRow
      setting="isActivityPushEnabled"
      label="인증·투표 알림"
      checked={me.isActivityPushEnabled}
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
