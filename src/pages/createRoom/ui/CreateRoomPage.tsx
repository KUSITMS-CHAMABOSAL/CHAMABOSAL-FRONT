import { useState } from "react";

import { CreateRoomForm, type RoomDraft } from "@/features/room/createRoom";

/**
 * 방 만들기 → 닉네임 → 보살 받기 → 초대 공유를 한 화면 안에서 단계로 넘겨요.
 * 🔖 닉네임 단계부터는 다음 작업에서 붙여요. 지금은 첫 화면의 값만 모아요.
 */
const CreateRoomPage = () => {
  const [draft, setDraft] = useState<RoomDraft>();

  return <CreateRoomForm initialDraft={draft} onSubmit={setDraft} />;
};

export default CreateRoomPage;
