import { useState } from "react";

import { ListRow } from "@toss/tds-mobile";

import { useTabBarToast } from "@/shared/lib";

import { useDeleteMyData } from "../model/useDeleteMyData";
import DeleteMyDataDialog from "./DeleteMyDataDialog";

// 🔖 지운 뒤 어디로 갈지(첫 화면, 미니앱 닫기) 정해지지 않았어요. 지금은 진입 분기로 가요.
/** 설정 목록의 [내 데이터 삭제] 줄과 확인 다이얼로그예요. */
const DeleteMyDataRow = () => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { mutate: remove, isPending } = useDeleteMyData();
  const openToast = useTabBarToast();

  const confirmDelete = () =>
    remove(undefined, {
      onError: () => {
        setIsConfirmOpen(false);
        openToast("데이터를 지우지 못했어요. 잠시 후 다시 시도해 주세요");
      },
    });

  return (
    <>
      <ListRow
        verticalPadding="large"
        withArrow
        contents={<ListRow.Texts type="1RowTypeA" top="내 데이터 삭제" />}
        onClick={() => setIsConfirmOpen(true)}
      />
      <DeleteMyDataDialog
        open={isConfirmOpen}
        isPending={isPending}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default DeleteMyDataRow;
