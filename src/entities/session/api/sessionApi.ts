import { request } from "@/shared/api";

import type { MeResponse } from "../model/types";

export const getMe = () => request<MeResponse>("GET", "/api/users/me");
