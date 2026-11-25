import { Device } from "@apps-in-toss/web-framework";

/**
 * 토스 밖(기본 브라우저, 메일 앱)에서 주소를 열어요. 토스 WebView는 `<a target="_blank">`로 열리지 않을 수 있어요.
 * 서비스 오픈 정책 2-2상 외부 이동은 법정 고지, 공공기관 안내처럼 허용된 경우에만 써요.
 */
export const openExternalUrl = (url: string) => Device.openURL(url);
