import { useQuery } from "@tanstack/react-query";

import { sessionQueries } from "./sessionQueries";

/** 내 정보와 참여 중인 방 목록이에요. */
export const useMeQuery = () => useQuery(sessionQueries.me());
