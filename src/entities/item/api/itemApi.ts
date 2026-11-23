import { request } from "@/shared/api";

import type { StoreResponse } from "../model/types";

export const getStore = () => request<StoreResponse>("GET", "/api/store");
