import { useLocation, useNavigate } from "react-router";

import { useStoreQuery } from "@/entities/item";
import { useMeQuery } from "@/entities/session";
import { paths } from "@/shared/config";
import { HairPlanting, HairPlantingSkeleton } from "@/widgets/storehouse/hairPlanting";

const HairPlantingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // 빠진 나발은 내 정보, 공양미는 곳간 조회에서 와요. 둘 다 받기 전에 그리면 빈자리 0곳·0석이 잠깐 보여요.
  const me = useMeQuery();
  const store = useStoreQuery();

  // 나발 빠짐 설명에서 넘어오면 내용만 나타나게 해요(HairGuidePage가 state로 알려줘요).
  const state = location.state as { fadeIn?: boolean; openedDirectly?: boolean } | null;
  const fadeIn = state?.fadeIn === true;

  // 곳간에서 들어왔으면 뒤로 돌아가고, 이 화면이나 설명 화면으로 바로 열렸으면 곳간으로 바꿔요.
  const close = () =>
    location.key === "default" || state?.openedDirectly === true
      ? navigate(paths.storehouse, { replace: true })
      : navigate(-1);

  if (!me.data || !store.data) {
    const failure = me.error ?? store.error;
    if (failure) throw failure;
    return <HairPlantingSkeleton />;
  }

  return <HairPlanting onClose={close} fadeIn={fadeIn} />;
};

export default HairPlantingPage;
