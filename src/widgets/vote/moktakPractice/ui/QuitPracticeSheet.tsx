import { BottomSheet, Button } from "@toss/tds-mobile";

import handPalm from "../assets/hand_palm.svg";

interface QuitPracticeSheetProps {
  open: boolean;
  /** [종료하기]예요. 친 횟수를 보내 이 회차 수행을 끝내요. */
  onQuit: () => void;
  /** 종료를 보내는 중이에요. 두 번 보내지 않게 [종료하기]를 로딩으로 바꿔요. */
  quitting?: boolean;
  /** [더 수행하기]와 바깥 누르기예요. */
  onClose: () => void;
}

/** 수행 중 [종료하기]를 누르면 한 번 더 묻는 시트예요(시안 목탁-09). */
const QuitPracticeSheet = ({ open, onQuit, quitting, onClose }: QuitPracticeSheetProps) => {
  const handleClose = () => {
    if (!quitting) onClose();
  };

  return (
    <BottomSheet
      open={open}
      onClose={handleClose}
      // 시안은 설명과 버튼 사이가 20px이에요. 본문 아래 여백(13px)에 더해 20px이 되게 기본값(34px)을 줄여요.
      ctaContentGap={7}
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
            <Button color="dark" variant="weak" loading={quitting} onClick={onQuit}>
              종료하기
            </Button>
          }
          rightButton={
            <Button disabled={quitting} onClick={handleClose}>
              더 수행하기
            </Button>
          }
        />
      }
    />
  );
};

export default QuitPracticeSheet;
