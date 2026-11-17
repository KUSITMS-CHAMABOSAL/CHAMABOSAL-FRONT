import { MATCHED_LAYER } from "../config/stage";

type MatchedLayer = (typeof MATCHED_LAYER)[keyof typeof MATCHED_LAYER];

/**
 * 이어지는 방식이에요.
 * - crossfade: 둘 다 보이며 자리를 옮기고, 앞 화면 것은 사라지고 뒤 화면 것이 나타나요. 글자가 바뀌는 제목에 써요.
 * - grow: 뒤 화면 것만 앞 화면 자리·크기에서 출발해요. 그림이 같은 보살에 써요.
 */
const MODE: Record<MatchedLayer, "crossfade" | "grow"> = {
  title: "crossfade",
  bosal: "grow",
};

interface MatchedPair {
  mode: "crossfade" | "grow";
  from: HTMLElement;
  to: HTMLElement;
  fromRect: DOMRect;
  toRect: DOMRect;
}

const isMatchedLayer = (key: string | undefined): key is MatchedLayer =>
  Object.values(MATCHED_LAYER).some(layer => layer === key);

/**
 * 앞뒤 화면에서 `data-match`가 같은 요소를 짝지어 제자리 위치를 재요.
 * 넘기기 애니메이션을 걸기 전에 불러야 해요. 걸고 나면 뒤 화면이 아래로 밀린 자리에서 재져요.
 */
export const measureMatchedLayers = (fromPage: HTMLElement, toPage: HTMLElement) =>
  Array.from(fromPage.querySelectorAll<HTMLElement>("[data-match]")).flatMap(from => {
    const key = from.dataset.match;
    const to = isMatchedLayer(key)
      ? toPage.querySelector<HTMLElement>(`[data-match="${key}"]`)
      : null;
    if (!isMatchedLayer(key) || !to) return [];
    const pair: MatchedPair = {
      mode: MODE[key],
      from,
      to,
      fromRect: from.getBoundingClientRect(),
      toRect: to.getBoundingClientRect(),
    };
    return [pair];
  });

/**
 * 짝지은 요소를 화면 기준으로 앞 자리에서 뒤 자리로 옮겨요.
 * 화면은 `distance`만큼 위로 밀리므로 그만큼 거꾸로 옮겨 상쇄해요. 화면과 같은 이징이라 정확히 상쇄돼요.
 * 요소는 시안 좌표계 안에 있어서 화면 px를 `scale`로 나눠요. 요소에는 `origin-top-left`가 있어야 해요.
 */
export const animateMatchedLayers = (
  pairs: MatchedPair[],
  distance: number,
  scale: number,
  timing: KeyframeAnimationOptions,
) =>
  pairs.flatMap(({ mode, from, to, fromRect, toRect }) => {
    if (mode === "grow") {
      const x = (fromRect.left - toRect.left) / scale;
      const y = (fromRect.top - toRect.top - distance) / scale;
      return [
        from.animate([{ opacity: 0 }, { opacity: 0 }], timing),
        to.animate(
          [
            { transform: `translate(${x}px, ${y}px) scale(${fromRect.width / toRect.width})` },
            { transform: "translate(0px, 0px) scale(1)" },
          ],
          timing,
        ),
      ];
    }

    // 제목 묶음은 크기가 달라도 글자를 늘리지 않아요. 가로는 가운데, 세로는 윗변을 맞춰요.
    const dx = (toRect.left + toRect.width / 2 - (fromRect.left + fromRect.width / 2)) / scale;
    const dy = (toRect.top - fromRect.top) / scale;
    const lift = distance / scale;
    return [
      from.animate(
        [
          { transform: "translate(0px, 0px)", opacity: 1 },
          { transform: `translate(${dx}px, ${dy + lift}px)`, opacity: 0 },
        ],
        timing,
      ),
      to.animate(
        [
          { transform: `translate(${-dx}px, ${-dy - lift}px)`, opacity: 0 },
          { transform: "translate(0px, 0px)", opacity: 1 },
        ],
        timing,
      ),
    ];
  });
