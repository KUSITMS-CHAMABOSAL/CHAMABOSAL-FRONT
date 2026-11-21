import type { CertificationResult } from "@/shared/types";

// 경로 문자열은 이 빌더로만 만듭니다. 화면을 추가할 때 app/router/routes.tsx와 함께 추가합니다.
export const paths = {
  root: "/",
  onboarding: "/onboarding",
  intro: "/intro",
  createRoom: "/rooms/new",
  invite: (code: string) => `/invite?code=${encodeURIComponent(code)}`,
  // 곳간은 방마다 달라지지 않아요.
  storehouse: "/storehouse",
  hairPlanting: "/storehouse/hair",
  hairGuide: "/storehouse/hair/guide",
  my: (roomId: number) => `/my/${roomId}`,
  settings: "/settings",
  room: {
    home: (roomId: number) => `/rooms/${roomId}`,
    vote: (roomId: number) => `/rooms/${roomId}/vote`,
    tapTap: (roomId: number, roundId: number) => `/rooms/${roomId}/vote/${roundId}/tap`,
    certify: (roomId: number) => `/rooms/${roomId}/certify`,
    /** 결과를 빼면 쿼리 없는 경로예요. 탭바를 숨길 화면인지 볼 때 써요. */
    certifyWrite: (roomId: number, result?: CertificationResult) =>
      `/rooms/${roomId}/certify/write${result ? `?result=${result}` : ""}`,
    certifyResult: (roomId: number) => `/rooms/${roomId}/certify/result`,
    /** 한 솥 축하예요. `seq`는 몇 번째 솥인지예요. */
    pot: (roomId: number, seq: number) => `/rooms/${roomId}/pots/${seq}`,
  },
} as const;
