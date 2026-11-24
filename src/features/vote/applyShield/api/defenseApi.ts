import { request } from "@/shared/api";

/** 지목된 회차에 이마 방어권을 써요. 이미 방어했으면 다시 보내도 성공해요. */
export const applyDefense = (roundId: number) => request("POST", `/api/rounds/${roundId}/defenses`);
