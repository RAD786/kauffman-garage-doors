/**
 * Dev-only. Captures viewport-sized screenshots at given scroll offsets so the
 * output is readable instead of a 28,000px-tall strip.
 *   node scripts/shots.mjs <path> <width> <offset1> [offset2 ...]
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const [path, widthArg, ...offsets] = process.argv.slice(2)
const width = Number(widthArg) || 390
const BASE = 'http://localhost:3111'
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const OUT = '.audit'
mkdirSync(OUT, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: 'new',
  args: ['--hide-scrollbars', '--disable-gpu'],
})
const page = await browser.newPage()
await page.setViewport({ width, height: width < 700 ? 844 : 1000, deviceScaleFactor: 2 })
await page.goto(BASE + path, { waitUntil: 'networkidle0' })
await page.evaluate(() => document.fonts.ready)

const slug = (path === '/' ? 'home' : path.replace(/\W+/g, '-').replace(/^-|-$/g, '')) + `-${width}`

for (const off of offsets.length ? offsets : ['0']) {
  await page.evaluate((y) => window.scrollTo(0, Number(y)), off)
  await new Promise((r) => setTimeout(r, 350))
  const file = `${OUT}/${slug}-at${off}.png`
  await page.screenshot({ path: file })
  console.log(file)
}

await browser.close()
