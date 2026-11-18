import { paths } from "./paths";

/** `apps-in-toss.config.ts`의 `appName`과 같아야 해요. */
const APP_SCHEME = "intoss://chamabosal";

/** 밖에서 미니앱으로 들어오는 딥링크예요. 공유 링크는 `intoss://`만 써요(`intoss-private://`는 반려돼요). */
export const deepLinks = {
  invite: (code: string) => `${APP_SCHEME}${paths.invite(code)}`,
} as const;
