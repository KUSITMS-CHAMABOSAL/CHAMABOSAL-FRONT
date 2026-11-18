import { useQuery } from "@tanstack/react-query";

import { roomQueries } from "./roomQueries";

/** 방 만들기 전에 뽑은 내 보살 색이에요. */
export const useNewColorQuery = () => useQuery(roomQueries.newColor());
