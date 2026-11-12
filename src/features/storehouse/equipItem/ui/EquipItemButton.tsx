import { Button } from "@toss/tds-mobile";

interface EquipItemButtonProps {
  worn: boolean;
  onClick: () => void;
}

const EquipItemButton = ({ worn, onClick }: EquipItemButtonProps) => (
  <Button
    size="small"
    display="full"
    color={worn ? "dark" : "primary"}
    variant="weak"
    aria-pressed={worn}
    onClick={onClick}
  >
    {worn ? "착용 중" : "착용하기"}
  </Button>
);

export default EquipItemButton;
