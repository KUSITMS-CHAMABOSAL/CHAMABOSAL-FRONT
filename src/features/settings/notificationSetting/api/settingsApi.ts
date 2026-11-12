import { request } from "@/shared/api";

import type { SettingsUpdateRequest } from "../model/types";

export const updateMySettings = (settings: SettingsUpdateRequest) =>
  request("PATCH", "/api/users/me/settings", settings);
