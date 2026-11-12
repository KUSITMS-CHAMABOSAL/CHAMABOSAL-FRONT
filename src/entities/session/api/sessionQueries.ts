import { queryOptions } from "@tanstack/react-query";

import { getMe } from "./sessionApi";

export const sessionQueries = {
  me: () => queryOptions({ queryKey: ["session", "me"], queryFn: getMe }),
};
