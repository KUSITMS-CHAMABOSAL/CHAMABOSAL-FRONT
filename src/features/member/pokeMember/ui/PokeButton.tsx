import { Button } from "@toss/tds-mobile";

import { triggerTapHaptic } from "@/shared/lib/appsInToss";

interface PokeButtonProps {
  onPoke: () => void;
  /** 인증 시간이 아니면 꺼요. 서버가 콕 찌르기를 받지 않아요(POKE_002). */
  disabled?: boolean;
}

const PokeButton = ({ onPoke, disabled }: PokeButtonProps) => (
  <Button
    size="xlarge"
    display="block"
    disabled={disabled}
    onClick={() => {
      triggerTapHaptic();
      onPoke();
    }}
  >
    콕 찌르기
  </Button>
);

export default PokeButton;
