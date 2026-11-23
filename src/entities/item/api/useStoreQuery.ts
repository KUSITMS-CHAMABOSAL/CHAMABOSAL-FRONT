import { useQuery } from "@tanstack/react-query";

import { itemQueries } from "./itemQueries";

/** 곳간의 공양미 잔액, 방어권, 꾸미기 아이템이에요. */
export const useStoreQuery = () => useQuery(itemQueries.store());
