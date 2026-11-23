import { isApiError } from "@/shared/api";

// 🔖 실패 문구는 시안이 없어 임시예요. 공양미 부족은 나발 심기와 같은 문구예요.
export const getBuyErrorMessage = (error: unknown) => {
  if (isApiError(error, "STORE_001")) return "공양미가 부족해요";
  if (isApiError(error, "STORE_003")) return "이미 가진 아이템이에요";
  return "사지 못했어요. 잠시 후 다시 시도해 주세요";
};
