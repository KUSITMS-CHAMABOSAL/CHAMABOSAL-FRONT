import { useState } from "react";

import { ListRow, useToast } from "@toss/tds-mobile";

import { useDeleteMyData } from "../model/useDeleteMyData";
import DeleteMyDataDialog from "./DeleteMyDataDialog";

/** 시안 설정 항목 글자예요. 17px 보통 굵기, 가장 진한 글자색이에요. */
const ROW_TEXT = { fontWeight: "regular", color: "var(--adaptiveGrey900)" } as const;

// 지운 뒤에는 진입 분기로 가요. 참여 중인 방이 없어져 첫 화면(인트로)으로 가요.
/** 설정 목록의 [내 데이터 삭제] 줄과 확인 다이얼로그예요. */
const DeleteMyDataRow = () => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { mutate: remove, isPending } = useDeleteMyData();
  const { openToast } = useToast();

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
        className="min-h-16!"
        withArrow
        contents={<ListRow.Texts type="1RowTypeA" top="내 데이터 삭제" topProps={ROW_TEXT} />}
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
