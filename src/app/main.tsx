import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { setTokenProvider } from "@/shared/api";

import "./styles/index.css";
import App from "./App.tsx";
import { fetchAccessToken } from "./bootstrap/auth";
import AppProviders from "./providers/AppProviders";

setTokenProvider(fetchAccessToken);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
);
