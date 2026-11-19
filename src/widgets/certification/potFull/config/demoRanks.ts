// 🔖 순위 API 스펙이 없어 시안의 값을 그대로 써요. 스펙이 나오면 props로 받도록 바꿔요.
// 🔖 보살 색은 시안 카드에 있는 세 가지만 넣었어요. 나머지 색의 얼굴 벡터가 필요해요.
export type BosalColor = "yellow" | "grey" | "orange";

export interface PotRank {
  rank: 1 | 2 | 3 | 4;
  name: string;
  rice: number;
  /** 각자 부여받은 보살 색이에요. 순위 카드 얼굴이 이 색을 따라요. */
  bosalColor: BosalColor;
}

export const DEMO_RANKS: PotRank[] = [
  { rank: 1, name: "민지", rice: 84, bosalColor: "yellow" },
  { rank: 2, name: "지수", rice: 77, bosalColor: "grey" },
  { rank: 3, name: "하린", rice: 62, bosalColor: "orange" },
  { rank: 4, name: "지혜", rice: 77, bosalColor: "grey" },
];
