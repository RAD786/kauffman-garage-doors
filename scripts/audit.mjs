/**
 * Dev-only visual + layout audit. Drives the locally installed Edge via CDP.
 *   node scripts/audit.mjs [baseUrl]
 *
 * Checks each page at mobile and desktop widths for horizontal overflow and
 * writes screenshots to .audit/. Not part of the build.
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const BASE = process.argv[2] || 'http://localhost:3111'
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const OUT = '.audit'

const PAGES = [
  ['home', '/'],
  ['services', '/services'],
  ['service-repair', '/services/garage-door-repair'],
  ['service-carport', '/services/carport-to-garage-conversion'],
  ['areas', '/service-areas'],
  ['city-gainesville', '/service-areas/gainesville'],
  ['city-atlanta', '/service-areas/atlanta'],
  ['contact', '/contact'],
  ['about', '/about'],
  ['privacy', '/privacy'],
  ['404', '/this-page-does-not-exist'],
]

const VIEWPORTS = [
  // 320px is the WCAG 1.4.10 reflow floor. 640px is what a 1280px desktop
  // viewport becomes at 200% zoom (WCAG 1.4.4) -- both are claims the
  // /accessibility page makes, so both get tested.
  { name: 'reflow320', width: 320, height: 720, isMobile: true, deviceScaleFactor: 1 },
  { name: 'zoom200', width: 640, height: 720, isMobile: false, deviceScaleFactor: 1 },
  { name: 'mobile', width: 390, height: 844, isMobile: true, deviceScaleFactor: 2 },
  { name: 'tablet', width: 820, height: 1180, isMobile: false, deviceScaleFactor: 1 },
  { name: 'desktop', width: 1440, height: 900, isMobile: false, deviceScaleFactor: 1 },
]

mkdirSync(OUT, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: 'new',
  args: ['--hide-scrollbars', '--disable-gpu'],
})

let problems = 0

for (const vp of VIEWPORTS) {
  for (const [name, path] of PAGES) {
    const page = await browser.newPage()
    await page.setViewport(vp)
    const res = await page.goto(BASE + path, { waitUntil: 'networkidle0', timeout: 45000 })
    await page.evaluate(() => document.fonts.ready)

    const report = await page.evaluate(() => {
      const de = document.documentElement
      const scrollW = de.scrollWidth
      const clientW = de.clientWidth
      const offenders = []
      if (scrollW > clientW + 1) {
        for (const el of document.querySelectorAll('body *')) {
          const r = el.getBoundingClientRect()
          if (r.width === 0 || r.height === 0) continue
          if (r.right > clientW + 1 || r.left < -1) {
            offenders.push({
              tag: el.tagName.toLowerCase(),
              cls: (el.className?.baseVal ?? el.className ?? '').toString().slice(0, 90),
              left: Math.round(r.left),
              right: Math.round(r.right),
            })
          }
        }
      }
      return {
        scrollW,
        clientW,
        offenders: offenders.slice(0, 8),
        h1: document.querySelectorAll('h1').length,
        title: document.title,
        telLinks: document.querySelectorAll('a[href^="tel:"]').length,
        imgsNoAlt: [...document.querySelectorAll('img')].filter((i) => !i.alt).length,
      }
    })

    const overflow = report.scrollW > report.clientW + 1
    if (overflow) problems++
    const flag = overflow ? 'OVERFLOW' : 'ok      '
    console.log(
      `${flag} [${vp.name}] ${path}  status=${res.status()} scrollW=${report.scrollW} clientW=${report.clientW} h1=${report.h1} tel=${report.telLinks} noAlt=${report.imgsNoAlt}`
    )
    if (overflow) {
      for (const o of report.offenders) {
        console.log(`         -> <${o.tag}> [${o.left}..${o.right}] .${o.cls}`)
      }
    }
    if (report.h1 !== 1) {
      console.log(`         !! expected exactly one <h1>, found ${report.h1}`)
      problems++
    }

    if (vp.name === 'mobile' || vp.name === 'desktop') {
      await page.screenshot({ path: `${OUT}/${name}-${vp.name}.png`, fullPage: true })
    }
    await page.close()
  }
}

await browser.close()
console.log(problems === 0 ? '\nAll clean.' : `\n${problems} problem(s) found.`)
