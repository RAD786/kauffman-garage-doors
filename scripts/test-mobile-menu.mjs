/**
 * Regression test for the mobile navigation menu.
 *   node scripts/test-mobile-menu.mjs
 *
 * Guards the containing-block bug: any ancestor with backdrop-filter, filter or
 * transform turns the fixed-position menu into a zero-height element that is
 * technically in the DOM but invisible. Asserting on measured size catches
 * that; asserting on existence does not.
 */
import puppeteer from 'puppeteer-core'

const BASE = 'http://localhost:3111'
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: 'new',
  args: ['--hide-scrollbars', '--disable-gpu'],
})

let failures = 0
const check = (label, ok, detail = '') => {
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? `  — ${detail}` : ''}`)
  if (!ok) failures++
}

for (const route of ['/', '/services/garage-door-repair', '/service-areas/buford']) {
  console.log(`\n${route}`)
  const page = await browser.newPage()
  await page.setViewport({ width: 390, height: 844, isMobile: true, deviceScaleFactor: 2 })
  await page.goto(BASE + route, { waitUntil: 'networkidle0' })

  const toggle = 'button[aria-controls="mobile-menu"]'
  check('menu is closed on load', (await page.$('#mobile-menu')) === null)

  await page.click(toggle)
  await new Promise((r) => setTimeout(r, 300))

  const box = await page.evaluate(() => {
    const el = document.querySelector('#mobile-menu')
    if (!el) return null
    const r = el.getBoundingClientRect()
    const cs = getComputedStyle(el)
    // Walk up looking for anything that would trap a fixed descendant.
    let trap = null
    for (let n = el.parentElement; n; n = n.parentElement) {
      const s = getComputedStyle(n)
      if (
        s.backdropFilter !== 'none' ||
        s.filter !== 'none' ||
        s.transform !== 'none' ||
        s.perspective !== 'none' ||
        s.willChange === 'transform' ||
        s.contain.includes('paint')
      ) {
        trap = `${n.tagName.toLowerCase()}.${(n.className || '').toString().slice(0, 40)}`
        break
      }
    }
    return {
      w: Math.round(r.width),
      h: Math.round(r.height),
      top: Math.round(r.top),
      visible: cs.display !== 'none' && cs.visibility !== 'hidden' && Number(cs.opacity) > 0,
      links: el.querySelectorAll('a').length,
      trap,
      viewportH: window.innerHeight,
    }
  })

  check('menu exists after tapping the toggle', box !== null)
  if (box) {
    check('menu fills the viewport width', box.w >= 380, `${box.w}px`)
    check(
      'menu extends to the bottom of the viewport',
      box.h > box.viewportH * 0.7,
      `${box.h}px of ${box.viewportH}px`
    )
    check('menu sits below the header', box.top >= 56 && box.top <= 80, `top ${box.top}px`)
    check('menu is visible', box.visible)
    // Top level only: call CTA, 4 nav items, email. Service and city links sit
    // behind the accordions and are checked separately below.
    check('menu shows top-level navigation', box.links >= 5, `${box.links} links`)
    check(
      'no ancestor traps position:fixed',
      box.trap === null,
      box.trap ? `trapped by ${box.trap}` : 'clean'
    )
  }

  // Expanding an accordion should reveal the child links.
  const expanded = await page.evaluate(async () => {
    const btns = [...document.querySelectorAll('#mobile-menu button[aria-expanded]')]
    if (!btns.length) return { groups: 0, before: 0, after: 0 }
    const before = document.querySelectorAll('#mobile-menu a').length
    btns[0].click()
    await new Promise((r) => setTimeout(r, 250))
    return {
      groups: btns.length,
      before,
      after: document.querySelectorAll('#mobile-menu a').length,
      open: btns[0].getAttribute('aria-expanded'),
    }
  })
  check('menu has expandable groups', expanded.groups >= 2, `${expanded.groups} groups`)
  check(
    'expanding a group reveals its links',
    expanded.after > expanded.before,
    `${expanded.before} -> ${expanded.after} links`
  )
  check('expanded group reports aria-expanded="true"', expanded.open === 'true')

  // Toggling closed should remove it again.
  await page.click(toggle)
  await new Promise((r) => setTimeout(r, 300))
  check('menu closes again', (await page.$('#mobile-menu')) === null)

  await page.close()
}

await browser.close()
console.log(failures === 0 ? '\nMobile menu OK.' : `\n${failures} failure(s).`)
process.exit(failures ? 1 : 0)
