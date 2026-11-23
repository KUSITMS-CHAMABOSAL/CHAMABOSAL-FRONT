import { FullScreenLoader } from "@toss/tds-mobile";
import { createBrowserRouter } from "react-router";

import { NotFoundPage } from "@/pages/notFound";

import PlainLayout from "../layouts/PlainLayout";
import RoomTabLayout from "../layouts/RoomTabLayout";
import EntryRedirect from "./EntryRedirect";
import RouteErrorBoundary from "./RouteErrorBoundary";

// 경로는 화면을 만드는 이슈에서 추가합니다. 경로 표는 .claude/rules/routes.md에 있습니다.
// 화면 코드는 lazy로 불러옵니다:
// { path: "intro", lazy: { Component: async () => (await import("@/pages/intro")).IntroPage } }
export const router = createBrowserRouter([
  {
    path: "/",
    ErrorBoundary: RouteErrorBoundary,
    // 앱을 처음 열 때 화면 코드를 불러오는 동안이에요.
    HydrateFallback: FullScreenLoader,
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
          {
            path: "settings",
            lazy: { Component: async () => (await import("@/pages/settings")).SettingsPage },
          },
          // 시안에 하단 탭바가 없어요. 방 홈의 [방 정보]로 들어와요.
          {
            path: "rooms/:roomId/info",
            lazy: { Component: async () => (await import("@/pages/roomInfo")).RoomInfoPage },
          },
          // 방 홈에 안 본 축하가 있으면 탭 레이아웃이 이 화면으로 보내요.
          {
            path: "rooms/:roomId/pots/:seq",
            lazy: {
              Component: async () => (await import("@/pages/potCelebration")).PotCelebrationPage,
            },
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
              // 시안에 하단 탭바가 없어 탭바만 숨겨요.
              {
                path: "vote/:roundId/tap",
                lazy: { Component: async () => (await import("@/pages/vote")).TapTapPage },
              },
              {
                path: "vote/:roundId/forehead",
                lazy: {
                  Component: async () => (await import("@/pages/vote")).ForeheadTapPage,
                },
              },
              {
                path: "certify",
                children: [
                  {
                    index: true,
                    lazy: {
                      Component: async () => (await import("@/pages/certify")).CertifyPage,
                    },
                  },
                  // 시안에 하단 탭바가 없어 탭바만 숨겨요.
                  {
                    path: "write",
                    lazy: {
                      Component: async () => (await import("@/pages/certify")).CertifyWritePage,
                    },
                  },
                  {
                    path: "edit",
                    lazy: {
                      Component: async () => (await import("@/pages/certify")).CertifyEditPage,
                    },
                  },
                  {
                    path: "result",
                    lazy: {
                      Component: async () => (await import("@/pages/certify")).CertifyResultPage,
                    },
                  },
                ],
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
                lazy: {
                  Component: async () => (await import("@/pages/storehouse")).StorehousePage,
                },
                children: [
                  // 곳간만 볼 때는 겹쳐 띄울 화면이 없어요.
                  { index: true, Component: () => null },
                  // 나발 빠짐 설명은 곳간 위에 겹쳐 띄워요. 밑에 곳간이 그려져 있어야 올라오고 내려가는 전환이 자연스러워요.
                  {
                    path: "hair/guide",
                    lazy: {
                      Component: async () => (await import("@/pages/hairPlanting")).HairGuidePage,
                    },
                  },
                ],
              },
              // 곳간에서만 들어가는 화면이라 곳간 아래에 두고 탭바만 숨겨요.
              {
                path: "hair",
                lazy: {
                  Component: async () => (await import("@/pages/hairPlanting")).HairPlantingPage,
                },
              },
            ],
          },
        ],
      },
    ],
  },
]);
