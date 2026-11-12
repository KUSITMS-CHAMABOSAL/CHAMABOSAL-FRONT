import { User } from "@apps-in-toss/web-framework";

/** 익명 키 교환용 일회용 인증 코드를 받아요. 동의 화면 없이 발급되고, `expiresIn`초 안에 한 번만 쓸 수 있어요. */
export const getAnonymousKeyAuthCode = async () => (await User.createAnonymousKeyAuthCode()).code;
