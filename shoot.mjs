import { chromium, devices } from 'playwright'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const iphone = devices['iPhone 13']

const browser = await chromium.launch()
const context = await browser.newContext({ ...iphone, deviceScaleFactor: 2 })
const page = await context.newPage()

async function shoot(file, out) {
  await page.goto('file://' + resolve(__dirname, file))
  await page.waitForLoadState('networkidle')
  await page.screenshot({ path: resolve(__dirname, out), fullPage: false })
  console.log('wrote', out)
}

await shoot('bug.html', 'bug-iphone13.png')
await shoot('fix.html', 'fix-iphone13.png')

// Also at a slightly different (Pixel 7) viewport for cross-device coverage
const ctx2 = await browser.newContext({ ...devices['Pixel 7'], deviceScaleFactor: 2 })
const p2 = await ctx2.newPage()
await p2.goto('file://' + resolve(__dirname, 'bug.html'))
await p2.waitForLoadState('networkidle')
await p2.screenshot({ path: resolve(__dirname, 'bug-pixel7.png'), fullPage: false })
await p2.goto('file://' + resolve(__dirname, 'fix.html'))
await p2.waitForLoadState('networkidle')
await p2.screenshot({ path: resolve(__dirname, 'fix-pixel7.png'), fullPage: false })
console.log('wrote pixel7 pair')

await browser.close()
