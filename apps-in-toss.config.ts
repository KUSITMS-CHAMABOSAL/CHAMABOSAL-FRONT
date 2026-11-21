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
  webBundleDir: "dist",
});
