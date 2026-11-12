import { Button, Paragraph } from "@toss/tds-mobile";

import { BosalGreyFigure } from "@/entities/bosal";
import { ItemCard } from "@/entities/item";
import { HAIR_PLANT_PRICE, useHairPlanting } from "@/features/storehouse/plantHair";

import slotRing from "../assets/slot_ring.png";

interface HairPlantCardProps {
  onPlant: () => void;
}

/** 곳간 맨 앞의 나발 심기 카드예요. 비어 있는 자리 수를 보여주고 심기 화면으로 보내요. */
const HairPlantCard = ({ onPlant }: HairPlantCardProps) => {
  const { plucked } = useHairPlanting();

  return (
    <ItemCard
      className="shadow-[0_2px_30px_var(--adaptiveGreyOpacity200)]"
      name="나발 심기"
      price={HAIR_PLANT_PRICE}
      status={
        <>
          <Paragraph.Text typography="t7" fontWeight="semibold" color="var(--adaptiveRed600)">
            {plucked.size}
          </Paragraph.Text>
          <Paragraph.Text typography="t7" fontWeight="semibold" color="var(--adaptiveGrey600)">
            곳 비어있어요
          </Paragraph.Text>
        </>
      }
      thumbnail={
        // 시안처럼 회색 보살의 머리만 둥근 사각형 창(85px)으로 잘라 보여줘요.
        <div className="relative h-[95px] w-[136px]">
          <div className="absolute top-1 left-[25px] size-[85px] overflow-hidden rounded-xl">
            <BosalGreyFigure
              pluckedHairs={plucked}
              className="absolute top-[23px] -left-[17px] w-[115px]"
            />
            <img src={slotRing} alt="" className="absolute top-[15px] left-[35px] size-[26px]" />
          </div>
        </div>
      }
      action={
        <Button size="small" display="full" onClick={onPlant}>
          심으러 가기 →
        </Button>
      }
    />
  );
};

export default HairPlantCard;
