import { Button, Paragraph } from "@toss/tds-mobile";

import { BosalGreyFigure } from "@/entities/bosal";
import { ItemCard } from "@/entities/item";
import { HAIR_PLANT_PRICE, useHairPlanting } from "@/features/storehouse/plantHair";

import { InfoCircleIcon } from "../assets";
import slotRing from "../assets/slot_ring.png";

interface HairPlantCardProps {
  onPlant: () => void;
  /** 오른쪽 위 정보 아이콘. 나발 빠짐 설명을 다시 봐요. */
  onGuide: () => void;
}

/** 곳간 맨 앞의 나발 심기 카드예요. 비어 있는 자리 수를 보여주고 심기 화면으로 보내요. */
const HairPlantCard = ({ onPlant, onGuide }: HairPlantCardProps) => {
  const { plucked } = useHairPlanting();

  return (
    // 정보 아이콘을 카드 오른쪽 위에 겹쳐 두려고 감싸요. 시안은 아이콘(24px)에 사방 10px 여백을 둬 누르는 면적이 44px이에요.
    <div className="relative">
      <ItemCard
        className="shadow-[0_2px_30px_var(--adaptiveGreyOpacity200)]"
        name="나발 심기"
        price={HAIR_PLANT_PRICE}
        // 화면 설계서 30-1 ⑤ "현재 n곳 비어있어요"
        status={
          <>
            <Paragraph.Text typography="t7" fontWeight="semibold" color="var(--adaptiveGrey600)">
              현재{" "}
            </Paragraph.Text>
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
          // 빈 자리가 없으면 심을 곳이 없어 꺼요(화면 설계서 30-1 ⑥).
          <Button size="small" display="full" disabled={plucked.size === 0} onClick={onPlant}>
            심으러 가기 →
          </Button>
        }
      />
      <button
        type="button"
        aria-label="나발 심기 설명 보기"
        onClick={onGuide}
        className="absolute top-0 right-0 flex appearance-none border-0 bg-transparent p-2.5"
      >
        <InfoCircleIcon aria-hidden className="size-6" />
      </button>
    </div>
  );
};

export default HairPlantCard;
