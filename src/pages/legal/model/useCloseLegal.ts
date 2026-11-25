import { useLocation, useNavigate } from "react-router";

import { paths } from "@/shared/config";

/** [닫기]예요. 인트로·초대·설정에서 열었으면 돌아가고, 바로 열렸으면 첫 화면으로 가요. */
export const useCloseLegal = () => {
  const navigate = useNavigate();
  const { key } = useLocation();
  return () => (key === "default" ? navigate(paths.root, { replace: true }) : navigate(-1));
};
