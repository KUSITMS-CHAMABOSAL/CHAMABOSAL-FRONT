import { Result } from "@toss/tds-mobile";
import { useNavigate } from "react-router";

import { paths } from "@/shared/config";

import NotFoundFigure from "./NotFoundFigure";

// 없는 경로나 잘못된 방 번호(`/rooms/abc`)로 들어왔을 때 보여줘요. [홈으로]는 진입 분기가 방을 골라요.
// 🔖 시안에 없는 화면이라 문구와 모양은 디자이너 확인이 필요합니다.
const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-svh flex-col justify-center">
      <NotFoundFigure />
      <Result
        title="페이지를 찾을 수 없어요"
        description="주소가 잘못되었거나 없어진 화면이에요."
        button={
          <Result.Button onClick={() => navigate(paths.root, { replace: true })}>
            홈으로
          </Result.Button>
        }
      />
    </main>
  );
};

export default NotFoundPage;
