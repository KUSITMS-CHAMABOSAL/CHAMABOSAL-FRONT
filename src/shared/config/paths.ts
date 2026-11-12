// 경로 문자열은 이 빌더로만 만듭니다. 화면을 추가할 때 app/router/routes.tsx와 함께 추가합니다.
export const paths = {
  root: "/",
  room: {
    home: (roomId: number) => `/rooms/${roomId}`,
    vote: (roomId: number) => `/rooms/${roomId}/vote`,
    storehouse: (roomId: number) => `/rooms/${roomId}/storehouse`,
    my: (roomId: number) => `/rooms/${roomId}/my`,
  },
} as const;
