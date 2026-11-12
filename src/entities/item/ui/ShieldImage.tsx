import shield from "../assets/item_shield.svg";
import glowInner from "../assets/shield_glow_inner.svg";
import glowOuter from "../assets/shield_glow_outer.svg";

/** 이마 방어권 썸네일이에요. Figma 시안처럼 방패 뒤에 빛 번짐 두 겹을 깔아요. */
const ShieldImage = () => (
  <div className="relative size-[86px]" aria-hidden>
    <img src={glowOuter} alt="" className="absolute inset-0 size-full" />
    <img src={glowInner} alt="" className="absolute inset-3 size-[62px]" />
    <img src={shield} alt="" className="absolute inset-[19px] size-12" />
  </div>
);

export default ShieldImage;
