import { createBrowserRouter } from "react-router";

import { NotFoundPage } from "@/pages/notFound";

import PlainLayout from "../layouts/PlainLayout";
import RoomTabLayout from "../layouts/RoomTabLayout";
import EntryRedirect from "./EntryRedirect";
import OnboardingGuard from "./guards/OnboardingGuard";
import RouteErrorBoundary from "./RouteErrorBoundary";

// 경로는 화면을 만드는 이슈에서 추가합니다. 경로 표는 .claude/rules/routes.md에 있습니다.
// 화면 코드는 lazy로 불러옵니다:
// { path: "intro", lazy: { Component: async () => (await import("@/pages/intro")).IntroPage } }
export const router = createBrowserRouter([
  {
    path: "/",
    ErrorBoundary: RouteErrorBoundary,
    children: [
      // 온보딩만 가드 밖에 둬요. 처음 들어오면 나머지 화면은 모두 온보딩을 먼저 거쳐요.
      {
        Component: PlainLayout,
        children: [
          {
            path: "onboarding",
            lazy: { Component: async () => (await import("@/pages/onboarding")).OnboardingPage },
          },
        ],
      },
      {
        Component: OnboardingGuard,
        children: [
          { index: true, Component: EntryRedirect },
          {
            Component: PlainLayout,
            children: [
              {
                path: "intro",
                lazy: { Component: async () => (await import("@/pages/intro")).IntroPage },
              },
              {
                path: "rooms/new",
                lazy: {
                  Component: async () => (await import("@/pages/createRoom")).CreateRoomPage,
                },
              },
              {
                path: "invite",
                lazy: { Component: async () => (await import("@/pages/invite")).InvitePage },
              },
            ],
          },
          // 없는 경로예요. 탭 레이아웃도 잘못된 방 번호에 같은 화면을 써서 lazy 없이 불러와요.
          { path: "*", Component: NotFoundPage },
          // 하단 탭바가 있는 화면. 곳간은 방마다 달라지지 않아 방 경로 밖에 둬요.
          {
            Component: RoomTabLayout,
            children: [
              {
                path: "rooms/:roomId",
                children: [
                  {
                    index: true,
                    lazy: { Component: async () => (await import("@/pages/home")).HomePage },
                  },
                  {
                    path: "vote",
                    lazy: { Component: async () => (await import("@/pages/vote")).VotePage },
                  },
                ],
              },
              // 내 보살 화면 안에서 방을 골라 닉네임 수정, 나가기를 해요.
              {
                path: "my/:roomId",
                lazy: { Component: async () => (await import("@/pages/myBosal")).MyBosalPage },
              },
              {
                path: "storehouse",
                children: [
                  {
                    index: true,
                    lazy: {
                      Component: async () => (await import("@/pages/storehouse")).StorehousePage,
                    },
                  },
                  // 곳간에서만 들어가는 화면이라 곳간 아래에 두고 탭바만 숨겨요.
                  {
                    path: "hair",
                    lazy: {
                      Component: async () =>
                        (await import("@/pages/hairPlanting")).HairPlantingPage,
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);
