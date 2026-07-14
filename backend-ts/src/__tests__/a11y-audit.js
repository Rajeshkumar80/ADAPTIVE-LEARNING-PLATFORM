const { chromium } = require('playwright');

const PAGES = [
  { name: 'Login', url: 'http://localhost:3000/login' },
  { name: 'Dashboard', url: 'http://localhost:3000/dashboard' },
  { name: 'Leaderboard', url: 'http://localhost:3000/leaderboard' },
  { name: 'Mastery', url: 'http://localhost:3000/mastery' },
  { name: 'Admin', url: 'http://localhost:3000/admin' },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const page of PAGES) {
    try {
      const ctx = await browser.newContext();
      const p = await ctx.newPage();
      await p.goto(page.url, { waitUntil: 'networkidle', timeout: 10000 }).catch(() => {});

      // Inject axe-core
      await p.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.8.4/axe.min.js' });
      await p.waitForFunction(() => typeof (window as any).axe !== 'undefined', { timeout: 5000 }).catch(() => {});

      const axeResults = await p.evaluate(async () => {
        const axe = (window as any).axe;
        if (!axe) return null;
        const results = await axe.run();
        return {
          violations: results.violations.length,
          passes: results.passes.length,
          incomplete: results.incomplete.length,
          details: results.violations.map((v: any) => ({
            id: v.id,
            impact: v.impact,
            description: v.description,
            nodes: v.nodes.length,
            helpUrl: v.helpUrl,
          })),
        };
      });

      results.push({ page: page.name, ...axeResults });
      await ctx.close();
    } catch (err: any) {
      results.push({ page: page.name, error: err.message });
    }
  }

  await browser.close();
  console.log(JSON.stringify(results, null, 2));
})();
