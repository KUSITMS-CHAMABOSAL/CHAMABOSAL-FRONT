import { Button } from "@toss/tds-mobile";

import { triggerTapHaptic } from "@/shared/lib/appsInToss";

interface PokeButtonProps {
  onPoke: () => void;
  /** 인증 시간이 아니면 꺼요. 서버가 콕 찌르기를 받지 않아요(POKE_002). */
  disabled?: boolean;
  /** 꺼졌을 때 문구예요. 시안: 투표 중에는 "콕 찌르기" 그대로, 그 밖에는 "지금은 콕 찌를 수 없어요" */
  disabledLabel?: string;
}

/** 꺼지면 시안처럼 회색(dark)으로 바뀌어요. */
const PokeButton = ({ onPoke, disabled, disabledLabel = "콕 찌르기" }: PokeButtonProps) => (
  <Button
    size="xlarge"
    display="block"
    color={disabled ? "dark" : "primary"}
    disabled={disabled}
    onClick={() => {
      triggerTapHaptic();
      onPoke();
    }}
  >
    {disabled ? disabledLabel : "콕 찌르기"}
  </Button>
);

export default PokeButton;
