// 경로 문자열은 이 빌더로만 만듭니다. 화면을 추가할 때 app/router/routes.tsx와 함께 추가합니다.
export const paths = {
  root: "/",
  onboarding: "/onboarding",
  // 곳간은 방마다 달라지지 않아요.
  storehouse: "/storehouse",
  hairPlanting: "/storehouse/hair",
  my: (roomId: number) => `/my/${roomId}`,
  room: {
    home: (roomId: number) => `/rooms/${roomId}`,
    vote: (roomId: number) => `/rooms/${roomId}/vote`,
    tapTap: (roomId: number, roundId: number) => `/rooms/${roomId}/vote/${roundId}/tap`,
  },
} as const;
