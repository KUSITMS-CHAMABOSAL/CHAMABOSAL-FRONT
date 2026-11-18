import { Share } from "@apps-in-toss/web-framework";

/** `intoss://` 딥링크를 토스 공유 링크로 바꿔요. 토스가 없는 사람은 앱스토어·플레이스토어로 가요. */
export const createShareLink = (path: string) => Share.createLink({ path });
