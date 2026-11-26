import type { TodayResponse } from "../model/types";

/** 만료까지 이만큼 남으면 다시 받은 새 주소로 바꿔요. 그 사이 화면에 새로 그려도 만료된 주소를 쓰지 않아요. */
const REFRESH_BEFORE_MS = 5 * 60_000;

/** presigned URL의 만료 시각이에요. 서명 시각(`X-Amz-Date`, 20261126T161651Z)에 유효 시간(`X-Amz-Expires`, 초)을 더해요. */
const getExpiresAt = (url: string) => {
  const params = new URL(url).searchParams;
  const signedAt = params
    .get("X-Amz-Date")
    ?.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/)
    ?.slice(1);
  const expires = Number(params.get("X-Amz-Expires"));
  if (!signedAt || !expires) return 0;
  const [year, month, day, hour, minute, second] = signedAt.map(Number);
  return Date.UTC(year, month - 1, day, hour, minute, second) + expires * 1000;
};

const withoutQuery = (url: string) => url.split("?")[0];

/**
 * 같은 사진이고 이전 주소가 아직 넉넉히 유효하면 이전 주소를 그대로 써요.
 * 서버는 조회할 때마다 서명을 새로 붙여서, 그대로 두면 다시 받을 때마다 `<img>`가 새로 받느라 깜빡여요.
 * 만료 5분 전부터는 다시 받은 새 주소로 바꿔요. 이때 한 번만 새로 받아요.
 */
export const keepImageUrl = (prev: string | null | undefined, next: string | null, now: number) =>
  prev &&
  next &&
  withoutQuery(prev) === withoutQuery(next) &&
  getExpiresAt(prev) - now > REFRESH_BEFORE_MS
    ? prev
    : next;

/** 다시 받은 오늘 정보에서 인증 사진 주소를 이전 것으로 유지해요. `structuralSharing`에서 써요. */
export const keepTodayImageUrls = (prev: TodayResponse | undefined, next: TodayResponse) => {
  if (!prev) return next;
  const now = Date.now();
  const prevUrls = new Map(
    prev.members.map(({ certification }) => [
      certification?.certificationId,
      certification?.imageUrl,
    ]),
  );
  return {
    ...next,
    members: next.members.map(member => {
      const { certification } = member;
      if (!certification) return member;
      const imageUrl = keepImageUrl(
        prevUrls.get(certification.certificationId),
        certification.imageUrl,
        now,
      );
      return imageUrl === certification.imageUrl
        ? member
        : { ...member, certification: { ...certification, imageUrl } };
    }),
  };
};
