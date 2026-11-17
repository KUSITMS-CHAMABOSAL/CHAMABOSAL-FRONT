import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { setMockHandler, setTokenProvider } from "@/shared/api";
import { API_MOCK } from "@/shared/config";

import "./styles/index.css";
import App from "./App.tsx";
import { fetchAccessToken } from "./bootstrap/auth";
import AppProviders from "./providers/AppProviders";

setTokenProvider(fetchAccessToken);

// 목 모드(.env의 VITE_API_MOCK=true)일 때만 목 데이터를 불러와요. 실서버 모드에서는 번들에 들어가도 쓰지 않아요.
// 최상위 await는 낮은 WebView에서 안 될 수 있어 Promise로 기다려요.
const mockReady = API_MOCK
  ? import("./mocks/handlers").then(({ mockHandler }) => {
      setMockHandler(mockHandler);
      // 다른 API가 목이라 로그인이 저절로 불리지 않아요. 실서버 로그인만 시작할 때 확인해요.
      fetchAccessToken().catch((error: unknown) => console.error("로그인 실패", error));
    })
  : Promise.resolve();

void mockReady.then(() =>
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <AppProviders>
        <App />
      </AppProviders>
    </StrictMode>,
  ),
);
