import { Storage } from "@apps-in-toss/web-framework";

/** 기기 저장소에서 값을 읽어요. 값이 없거나 토스 앱 밖이라 브릿지가 실패하면 `null`이에요. */
export const getStorageItem = async (key: string) => {
  try {
    return await Storage.getItem(key);
  } catch {
    return null;
  }
};

/** 기기 저장소에 값을 저장해요. 실패해도 화면 흐름을 막지 않아요. */
export const setStorageItem = async (key: string, value: string) => {
  try {
    await Storage.setItem(key, value);
  } catch {
    // 저장하지 못하면 다음에 들어올 때 같은 안내를 한 번 더 보여줄 뿐이에요.
  }
};
