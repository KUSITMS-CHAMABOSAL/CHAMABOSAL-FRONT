import { MIN_RICE_MEMBERS } from "@/entities/room";
import { MIN_VOTERS } from "@/entities/vote";

/** 방 이름 최대 글자 수예요. 서버도 앞뒤 띄어쓰기를 지운 뒤 1~12자로 검사해요. */
export const ROOM_NAME_MAX_LENGTH = 12;

/** 시안이 처음 보여주는 목표 공양미예요. */
export const DEFAULT_POT_GOAL = 450;

/** 인원 아래 안내예요. 투표가 열리는 인원부터는(3명, 4명) 같은 문구를 보여줘요. */
export const RICE_MEMBERS_HINT = `${MIN_RICE_MEMBERS}명부터 인증 공양미가 쌓여요!`;
export const VOTERS_HINT = `${MIN_VOTERS}명부터 투표가 열려요!`;
