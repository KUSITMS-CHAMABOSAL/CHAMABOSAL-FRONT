import emptyBody from "../assets/bosal_empty_body.svg";
import emptyFace from "../assets/bosal_empty_face.svg";

const SILHOUETTE_WIDTH = 88;
const SILHOUETTE_HEIGHT = 141;

interface BosalSilhouetteProps {
  /** 렌더링 높이예요. 폭은 원본 비율로 따라가요. */
  height?: number;
}

/** 아직 들어오지 않은 자리의 회색 보살이에요. 시안처럼 몸과 얼굴 두 레이어를 겹쳐요. */
const BosalSilhouette = ({ height = SILHOUETTE_HEIGHT }: BosalSilhouetteProps) => {
  const width = (SILHOUETTE_WIDTH * height) / SILHOUETTE_HEIGHT;
  return (
    <div className="relative opacity-50" aria-hidden>
      <img
        src={emptyBody}
        alt=""
        width={width}
        height={height}
        className="block max-w-none select-none"
      />
      <img
        src={emptyFace}
        alt=""
        width={width}
        height={height}
        className="absolute inset-0 max-w-none select-none"
      />
    </div>
  );
};

export default BosalSilhouette;
