import type { MeResponse } from "@/entities/session";

/** 앱 안에서 켜고 끄는 알림이에요. `GET /api/users/me`의 같은 이름 필드예요. */
export type NotificationSettingKey = keyof Pick<
  MeResponse,
  "isPokePushEnabled" | "isActivityPushEnabled"
>;

/** PATCH /api/users/me/settings. 보낸 값만 바뀌어요. */
export type SettingsUpdateRequest = Partial<Record<NotificationSettingKey, boolean>>;
