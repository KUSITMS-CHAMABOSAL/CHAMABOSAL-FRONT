import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { setMockHandler, setTokenProvider } from "@/shared/api";

import "./styles/index.css";
import App from "./App.tsx";
import { fetchAccessToken } from "./bootstrap/auth";
import AppProviders from "./providers/AppProviders";

setTokenProvider(fetchAccessToken);

// ponytail: 로그인 외 API는 서버가 준비될 때까지 운영 빌드에서도 목으로 보내요. 붙일 때 client.ts의 분기와 함께 되돌려요.
// 최상위 await는 낮은 WebView에서 안 될 수 있어 Promise로 기다려요.
const mockReady = import("./mocks/handlers").then(({ mockHandler }) => setMockHandler(mockHandler));

// 다른 API가 목이라 로그인이 저절로 불리지 않아요. 실서버 로그인만 시작할 때 확인해요.
fetchAccessToken().catch((error: unknown) => console.error("로그인 실패", error));

void mockReady.then(() =>
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <AppProviders>
        <App />
      </AppProviders>
    </StrictMode>,
  ),
);
