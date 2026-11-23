import { queryOptions } from "@tanstack/react-query";

import { getStore } from "./itemApi";

export const itemQueries = {
  store: () => queryOptions({ queryKey: ["item", "store"], queryFn: getStore }),
};
