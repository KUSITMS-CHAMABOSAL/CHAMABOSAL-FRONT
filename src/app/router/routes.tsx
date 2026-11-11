import { createBrowserRouter } from "react-router";

import PlainLayout from "../layouts/PlainLayout";
import RoomTabLayout from "../layouts/RoomTabLayout";
import RouteErrorBoundary from "./RouteErrorBoundary";

// 경로는 화면을 만드는 이슈에서 추가합니다. 경로 표는 .claude/rules/routes.md에 있습니다.
// 화면 코드는 lazy로 불러옵니다:
// { path: "intro", lazy: { Component: async () => (await import("@/pages/intro")).IntroPage } }
export const router = createBrowserRouter([
  {
    path: "/",
    ErrorBoundary: RouteErrorBoundary,
    children: [
      // 하단 탭바가 없는 화면
      { Component: PlainLayout, children: [] },
      {
        path: "rooms/:roomId",
        children: [
          // 하단 탭바가 있는 방 화면
          { Component: RoomTabLayout, children: [] },
          // 하단 탭바가 없는 방 화면
          { Component: PlainLayout, children: [] },
        ],
      },
    ],
  },
]);
