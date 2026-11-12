import { Button } from "@toss/tds-mobile";

import { triggerTapHaptic } from "@/shared/lib/appsInToss";

interface PokeButtonProps {
  onPoke: () => void;
}

const PokeButton = ({ onPoke }: PokeButtonProps) => (
  <Button
    size="xlarge"
    onClick={() => {
      triggerTapHaptic();
      onPoke();
    }}
  >
    콕 찌르기
  </Button>
);

export default PokeButton;
