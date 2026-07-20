import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  await page.goto('https://www.linkedin.com', { waitUntil: 'networkidle' });

  const needsLogin = await page.getByLabel('Email or Phone').first().isVisible().catch(() => false);
  if (needsLogin) {
    console.log('\n--- SIGN IN TO LINKEDIN IN THE BROWSER WINDOW ---');
    console.log('Waiting up to 120s...\n');
    await page.waitForURL('**/feed/**', { timeout: 120000 });
  }

  // Navigate to the "Write article" page
  console.log('Opening LinkedIn article editor...');
  await page.goto('https://www.linkedin.com/pulse/', { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {
    console.log('Pulse redirect — navigating via feed.');
  });

  await page.waitForTimeout(4000);

  // Try to find and click "Write article" link
  const articleLinks = page.locator('a').filter({ hasText: /write article/i });
  if (await articleLinks.first().isVisible().catch(() => false)) {
    await articleLinks.first().click();
    await page.waitForTimeout(3000);
  }

  console.log('\n✓ Browser ready. Your article is at:');
  console.log('  /Users/c/Claude/Projects/Job Search/output/2026-07-09_PKI_LinkedIn_Article.md');
  console.log('\n  1. Paste the title and body into the editor');
  console.log('  2. Add any images or formatting');
  console.log('  3. Click Publish');
  console.log('\n  Keep this terminal open while you work.');
  console.log('  Press Ctrl+C to close the browser when done.\n');

  await new Promise(() => {});
}

main().catch(err => { console.error(err); process.exit(1); });
