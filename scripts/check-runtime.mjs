/**
 * Loads every route in a real browser and reports console errors/warnings,
 * failed network requests, and any image placeholders still rendering.
 *   node scripts/check-runtime.mjs
 */
import puppeteer from 'puppeteer-core'

const BASE = 'http://localhost:3111'
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'

const ROUTES = [
  '/', '/services', '/service-areas', '/contact', '/about', '/privacy', '/accessibility',
  ...['garage-door-repair','garage-door-installation','garage-door-openers','garage-door-spring-replacement',
      'new-garage-doors','custom-wooden-garage-doors','garage-door-removal-and-haul-away',
      'carport-to-garage-conversion'].map((s) => `/services/${s}`),
  ...['gainesville','flowery-branch','oakwood','buford','cumming','hoschton','jefferson',
      'dawsonville','cleveland','atlanta'].map((c) => `/service-areas/${c}`),
]

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: 'new',
  args: ['--hide-scrollbars', '--disable-gpu'],
})

let issues = 0
const placeholders = []

for (const route of ROUTES) {
  const page = await browser.newPage()
  await page.setViewport({ width: 1366, height: 900 })
  const msgs = []
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') msgs.push(`${m.type()}: ${m.text()}`)
  })
  page.on('pageerror', (e) => msgs.push(`pageerror: ${e.message}`))
  page.on('requestfailed', (r) => msgs.push(`requestfailed: ${r.url()} ${r.failure()?.errorText}`))
  page.on('response', (r) => {
    if (r.status() >= 400) msgs.push(`http ${r.status()}: ${r.url()}`)
  })

  await page.goto(BASE + route, { waitUntil: 'networkidle0', timeout: 45000 })

  // Placeholders render as an <svg role="img" aria-label="Image placeholder: ...">
  const ph = await page.$$eval('svg[role="img"][aria-label^="Image placeholder"]', (els) =>
    els.map((e) => e.getAttribute('aria-label').replace('Image placeholder: ', ''))
  )
  if (ph.length) placeholders.push([route, ph])

  const real = msgs.filter((m) => !/Images loaded lazily|Download the .* DevTools/i.test(m))
  if (real.length) {
    issues += real.length
    console.log(`\n${route}`)
    for (const m of real) console.log('  ' + m)
  }
  await page.close()
}

await browser.close()

console.log(issues === 0 ? '\nNo console errors, page errors, failed requests or 4xx/5xx.' : `\n${issues} runtime issue(s).`)

if (placeholders.length) {
  console.log(`\nPlaceholders still rendering on ${placeholders.length} route(s):`)
  for (const [route, ph] of placeholders) console.log(`  ${route}\n    - ${ph.join('\n    - ')}`)
} else {
  console.log('\nNo image placeholders remaining.')
}
