import { BottomSheet, Button } from "@toss/tds-mobile";

import handPalm from "../assets/hand_palm.svg";

interface QuitPracticeSheetProps {
  open: boolean;
  /** [종료하기]예요. 친 횟수는 저장하지 않고 나가요. */
  onQuit: () => void;
  /** [더 수행하기]와 바깥 누르기예요. */
  onClose: () => void;
}

/** 수행 중 [종료하기]를 누르면 한 번 더 묻는 시트예요(시안 목탁-09). */
const QuitPracticeSheet = ({ open, onQuit, onClose }: QuitPracticeSheetProps) => (
  <BottomSheet
    open={open}
    onClose={onClose}
    header={
      <>
        <img src={handPalm} alt="" className="mx-auto box-content block size-20 p-2.5" />
        <BottomSheet.Header>지금 나가면 수행이 종료돼요</BottomSheet.Header>
      </>
    }
    headerDescription={
      <BottomSheet.HeaderDescription>
        수행을 무사히 마치면 공양미를 얻을 수 있어요
        <br />
        이대로 종료할까요?
      </BottomSheet.HeaderDescription>
    }
    cta={
      <BottomSheet.DoubleCTA
        leftButton={
          <Button color="dark" variant="weak" onClick={onQuit}>
            종료하기
          </Button>
        }
        rightButton={<Button onClick={onClose}>더 수행하기</Button>}
      />
    }
  />
);

export default QuitPracticeSheet;
