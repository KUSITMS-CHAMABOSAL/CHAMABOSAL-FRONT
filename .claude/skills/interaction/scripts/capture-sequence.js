// 사용법은 SKILL.md 4장. 옵션: localStorage "interaction-capture"
async page => {
  const saved = await page.evaluate(() => localStorage.getItem("interaction-capture"));
  const opt = { count: 24, interval: 200, reload: true, times: 0, ...JSON.parse(saved || "{}") };
  if (!opt.dir) throw new Error('localStorage "interaction-capture"에 dir을 넣어 주세요.');
  if (opt.reload) await page.reload();
  for (let i = 0; opt.tap && i < opt.times; i++) {
    if (i > 0) await page.waitForTimeout(150);
    await page.locator(opt.tap).first().click({ noWaitAfter: true });
  }
  const started = Date.now();
  const paths = [];
  for (let i = 0; i < opt.count; i++) {
    const path = `${opt.dir}/frame-${String(i).padStart(2, "0")}.png`;
    await page.screenshot({ path, clip: opt.clip });
    paths.push(path);
    await page.waitForTimeout(Math.max(0, (i + 1) * opt.interval - (Date.now() - started)));
  }
  return { saved: paths.length, dir: opt.dir, everyMs: opt.interval };
}
