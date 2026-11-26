import { Share } from "@apps-in-toss/web-framework";

/**
 * `intoss://` 딥링크를 토스 공유 링크로 바꿔요. 토스가 없는 사람은 앱스토어·플레이스토어로 가요.
 * `ogImageUrl`은 메신저 미리보기 이미지예요. 토스앱 Android 5.240.0, iOS 5.239.0 이상에서만 반영돼요.
 */
export const createShareLink = (path: string, ogImageUrl?: string) =>
  Share.createLink({ path, ogImageUrl });
