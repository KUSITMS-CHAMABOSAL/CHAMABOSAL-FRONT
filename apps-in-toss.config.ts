import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
  appName: "chamabosal",
  brand: {
    primaryColor: "#3182F6", // 화면에 노출될 앱의 기본 색상으로 바꿔주세요.
  },
  // 초대 링크 복사(Clipboard.setText), 인증 사진 촬영(Device.openCamera)·앨범 선택(Device.getPhotos)에 써요.
  permissions: [
    { name: "clipboard", access: "write" },
    { name: "camera", access: "access" },
    { name: "photos", access: "read" },
  ],
  webView: {
    // iOS WebView는 기본으로 좌우 스와이프가 브라우저 기록을 넘겨요(기본값 true). 앱처럼 쓰려고 꺼요.
    // 뒤로 가기는 토스 상단 바의 뒤로가기와 안드로이드 시스템 뒤로가기로만 해요.
    allowsBackForwardNavigationGestures: false,
  },
  webBundleDir: "dist",
});
