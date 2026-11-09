// 사용법은 SKILL.md 4장. 옵션: localStorage "interaction-probe"
async page => {
  const saved = await page.evaluate(() => localStorage.getItem("interaction-probe"));
  const opt = { reload: true, ms: 6000, times: 0, interval: 150, cpu: 4, by: 300, ...JSON.parse(saved || "{}") };
  const errors = [];
  const onConsole = message => message.type() === "error" && errors.push(message.text());
  const cdp = await page.context().newCDPSession(page);
  page.on("console", onConsole);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: opt.cpu });
  try {
    if (opt.reload) await page.reload();
    const probe = page.evaluate(
      ms =>
        new Promise(resolve => {
          const gaps = [];
          let last = performance.now();
          const end = last + ms;
          const tick = now => {
            gaps.push(now - last);
            last = now;
            if (now < end) return requestAnimationFrame(tick);
            const frames = gaps.slice(2);
            const sorted = [...frames].sort((a, b) => a - b);
            resolve({
              frames: frames.length,
              p95: +sorted[Math.floor(frames.length * 0.95)].toFixed(1),
              max: +sorted[frames.length - 1].toFixed(1),
              over33: frames.filter(gap => gap > 33.4).length,
              runningAnimations: document.getAnimations().length,
            });
          };
          requestAnimationFrame(tick);
        }),
      opt.ms,
    );
    for (let i = 0; (opt.tap || opt.scroll) && i < opt.times; i++) {
      if (opt.tap) await page.locator(opt.tap).first().click({ noWaitAfter: true });
      if (opt.scroll)
        await page
          .locator(opt.scroll)
          .first()
          .evaluate((el, by) => el.scrollBy({ left: by, behavior: "smooth" }), opt.by);
      await page.waitForTimeout(opt.interval);
    }
    return { ...(await probe), consoleErrors: errors, options: opt };
  } finally {
    page.off("console", onConsole);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
  }
}
