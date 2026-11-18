/**
 * 방 만들기 흐름마다 기록(location.state)에 붙이는 ID예요. 같은 흐름의 단계 기록은 같은 ID를 가져요.
 * 방을 만들면 그 흐름 ID에 만든 방을 남겨, 방 홈에서 뒤로가기로 이 흐름의 단계에 돌아오면 그 방 홈으로 보내요.
 * 화면이 다시 그려져도 남도록 위젯 밖(모듈)에 둬요. 새로고침하면 사라져요.
 */
const completedFlows = new Map<string, number>();

export const newCreateRoomFlowId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const markCreateRoomFlowDone = (flowId: string, roomId: number) =>
  completedFlows.set(flowId, roomId);

export const getCreateRoomFlowRoomId = (flowId: string) => completedFlows.get(flowId);
