// 앱인토스 화면 측정 스크립트. 이 주석과 맨 끝 세미콜론을 뺀 함수를 브라우저 도구의 evaluate에 넘깁니다.
() => {
  const MIN_TEXT_PX = 11;
  const MIN_TARGET_PX = 44;
  const INTERACTIVE = 'a[href], button, input, select, textarea, [role="button"], [role="tab"]';

  const isVisible = el => {
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return (
      rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none"
    );
  };
  const label = el => {
    const text = (el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 30);
    return `${el.tagName.toLowerCase()}${text ? ` "${text}"` : ""}`;
  };
  const hasOwnText = el =>
    [...el.childNodes].some(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());

  const elements = [...document.body.querySelectorAll("*")].filter(isVisible);

  const tinyText = elements
    .filter(el => hasOwnText(el) && parseFloat(getComputedStyle(el).fontSize) < MIN_TEXT_PX)
    .map(el => `${label(el)} ${getComputedStyle(el).fontSize}`);

  const smallTargets = elements
    .filter(el => el.matches(INTERACTIVE))
    .filter(el => {
      const { width, height } = el.getBoundingClientRect();
      return width < MIN_TARGET_PX || height < MIN_TARGET_PX;
    })
    .map(el => {
      const { width, height } = el.getBoundingClientRect();
      return `${label(el)} ${Math.round(width)}x${Math.round(height)}`;
    });

  const unsizedImages = [...document.images]
    .filter(isVisible)
    .filter(img => !img.getAttribute("width") && getComputedStyle(img).aspectRatio === "auto")
    .map(img => img.currentSrc.split("/").pop());

  const unnamedControls = elements
    .filter(el => el.matches("button, a[href], [role='button']"))
    .filter(el => !(el.textContent || "").trim() && !el.getAttribute("aria-label"))
    .map(el => label(el));

  const viewportMeta = document.querySelector('meta[name="viewport"]')?.content ?? "";
  const pinchZoomBlocked = /user-scalable=(no|0)|maximum-scale=1(\.0)?(,|$|\s)/.test(viewportMeta);

  const overflowing = elements
    .filter(el => el.getBoundingClientRect().right > innerWidth + 1)
    .slice(0, 5)
    .map(el => label(el));

  return {
    viewport: `${innerWidth}x${innerHeight}`,
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
    overflowing,
    colorScheme: getComputedStyle(document.documentElement).colorScheme,
    pinchZoomBlocked,
    viewportMeta,
    tinyText,
    smallTargets,
    unsizedImages,
    unnamedControls,
    inlineStyleCount: document.querySelectorAll("#root [style]").length,
  };
};
