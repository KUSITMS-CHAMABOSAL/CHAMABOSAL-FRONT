import { Analytics } from "@apps-in-toss/web-framework";

/**
 * 데이터 트래킹 정의서의 커스텀 이벤트와 파라미터예요. 이벤트 이름(`log_name`)이 콘솔 분석 > 이벤트에 그대로 보여요.
 * 값은 정의서의 영문 값을 그대로 써요. 콘솔에는 모두 문자열로 저장돼요.
 */
interface AnalyticsEventParams {
  room_create_complete: {
    goal_category: "delivery" | "snack" | "shopping" | "free";
    target_rice: number;
    planned_members: number;
  };
  invite_link_copy: { entry_point: "room_created" | "home_card" | "room_info" | "vote_tab" };
  invite_join_complete: { member_count_after: number; is_second_room: boolean };
  certify_complete: {
    result: "endured" | "failed";
    has_photo: boolean;
    member_count: number;
    /** 오늘 탭의 `daysTogether` 그대로예요. 2명이 된 날이 1일째이고, 혼자인 동안은 0이에요. */
    room_day: number;
    is_last_certifier: boolean;
  };
  vote_complete: { choice: "member" | "all_bosal"; member_count: number };
  tap_session_complete: {
    role: "sender" | "receiver";
    tap_count: number;
    /** 받은 수만큼 다 쳤는지예요. receiver만 보내요. */
    completed?: boolean;
  };
  signup_complete: { entry: "direct" | "invite" };
  poke_send: { is_first_today: boolean };
  item_purchase: {
    item_type: "hat" | "face" | "accessory" | "shield" | "nabal";
    price: number;
    balance_after: number;
  };
  intro_view: Record<string, never>;
  invite_preview_view: { inviter_shown: boolean };
}

/** 초대링크를 복사한 곳이에요. 방 홈의 위쪽 초대 버튼과 격자의 초대 카드는 둘 다 `home_card`예요. */
export type InviteEntryPoint = AnalyticsEventParams["invite_link_copy"]["entry_point"];

type AnalyticsEventName = keyof AnalyticsEventParams;

/** 이벤트마다 정의서의 종류대로 화면(screen) 또는 클릭(click) 로그로 보내요. */
const EVENT_KINDS = {
  room_create_complete: "screen",
  invite_link_copy: "click",
  invite_join_complete: "screen",
  certify_complete: "screen",
  vote_complete: "screen",
  tap_session_complete: "click",
  signup_complete: "click",
  poke_send: "click",
  item_purchase: "click",
  intro_view: "screen",
  invite_preview_view: "screen",
} as const satisfies Record<AnalyticsEventName, "screen" | "click">;

/** 개발 서버에서만 로그 실패를 알려요. 로그가 화면 동작을 막지 않도록 그 밖에는 조용히 넘겨요. */
const warnInDev = (error: unknown) => {
  if (import.meta.env.DEV) console.warn("분석 로그 전송 실패", error);
};

/**
 * 커스텀 이벤트를 보내요. 서버 요청이 성공한 뒤에 불러서 실패·재시도로 중복 집계되지 않게 해요.
 * https가 아니면 SDK가 보내지 않고, 로컬 개발에서는 devtools 패널에 기록돼요.
 */
export const logEvent = <N extends AnalyticsEventName>(
  name: N,
  ...[params]: AnalyticsEventParams[N] extends Record<string, never>
    ? []
    : [params: AnalyticsEventParams[N]]
) => {
  const log = EVENT_KINDS[name] === "screen" ? Analytics.screen : Analytics.click;
  try {
    log({ log_name: name, ...params })?.catch(warnInDev);
  } catch (error) {
    // 토스 앱 밖이거나 브릿지 호출이 실패해도 화면은 그대로 진행해요.
    warnInDev(error);
  }
};
