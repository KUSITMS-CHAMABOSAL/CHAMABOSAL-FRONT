// 경로 문자열은 이 빌더로만 만듭니다. 화면을 추가할 때 app/router/routes.tsx와 함께 추가합니다.
// 예: room: { vote: (roomId: string) => `/rooms/${encodeURIComponent(roomId)}/vote` }
export const paths = {
  root: "/",
} as const;
