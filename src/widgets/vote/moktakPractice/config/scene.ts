/**
 * 목탁 수행 화면들의 배경이에요. 시안의 원형 그라데이션(가운데 붉은빛 → 바깥 청록빛, 투명도 0.3)을 흰 바탕에 깔아요.
 * TDS 색 변수에 없는 일러스트 색이라 시안 값을 그대로 써요.
 */
export const PRACTICE_BACKGROUND =
  "bg-[radial-gradient(95%_50%_at_50%_50%,rgba(237,40,49,0.039)_0%,rgba(136,105,110,0.11)_50%,rgba(85,138,140,0.145)_75%,rgba(34,170,170,0.18)_100%),linear-gradient(#fff,#fff)]";

/** 완료 화면 빛 링 3겹의 지름이에요. 바깥부터 그려요. */
export const COMPLETE_GLOW_RING_SIZES = [522, 434, 356] as const;

/**
 * 목표를 채운 뒤 완료 화면으로 넘어가기까지예요. 1초 안에 뜨도록, 마지막 타격 동작(최대 0.38초)이 끝나고
 * 목탁 울림이 잦아들 무렵 넘어가요. 🔖 시안에 시간이 없어요.
 */
export const COMPLETE_DELAY_MS = 800;
