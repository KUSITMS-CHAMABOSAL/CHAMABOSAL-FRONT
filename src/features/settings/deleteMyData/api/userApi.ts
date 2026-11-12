import { request } from "@/shared/api";

/** 내 데이터를 지워요. 모든 방에서 나가고 사진은 바로 지워져요. 6개월 안에 돌아오면 복구돼요. */
export const deleteMe = () => request("DELETE", "/api/users/me");
