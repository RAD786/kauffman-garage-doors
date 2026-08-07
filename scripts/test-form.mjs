/**
 * Dev-only end-to-end check of the lead form server action.
 *   node scripts/test-form.mjs
 * Verifies validation errors render, and that a valid submission reaches the
 * server and returns the success state.
 */
import puppeteer from 'puppeteer-core'

const BASE = 'http://localhost:3111'
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: 'new',
  args: ['--hide-scrollbars', '--disable-gpu'],
})

const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 1000 })
await page.goto(`${BASE}/contact`, { waitUntil: 'networkidle0' })

const form = 'form[action]'
const submit = 'button[data-cta="form-submit"]'

// --- 1. Empty submit should surface server-side validation errors ----------
await page.click(submit)
await page.waitForSelector('[role="alert"]', { timeout: 15000 })
const errors = await page.$$eval('p.text-brand-red-600', (ps) =>
  ps.map((p) => p.textContent.trim()).filter(Boolean)
)
console.log('1) empty submit -> field errors:')
errors.forEach((e) => console.log(`     - ${e}`))
console.log(`   ${errors.length >= 4 ? 'PASS' : 'FAIL'} (expected >= 4)`)

// --- 2. Bad phone should be rejected specifically -------------------------
await page.type('input[name="name"]', 'Test Homeowner')
await page.type('input[name="phone"]', '12345')
await page.type('input[name="location"]', 'Gainesville')
await page.select('select[name="service"]', 'garage-door-spring-replacement')
await page.select('select[name="urgency"]', 'today-tomorrow')
await page.click(submit)
await new Promise((r) => setTimeout(r, 2500))
const phoneErr = await page.$eval(
  'input[name="phone"]',
  (el) => el.getAttribute('aria-invalid')
)
console.log(`\n2) bad phone -> aria-invalid="${phoneErr}"  ${phoneErr === 'true' ? 'PASS' : 'FAIL'}`)

// --- 3. Values should be preserved across a failed submit -----------------
// Regression guard: React 19 resets the form after a server action, and a
// <select> reset ignores React's defaultValue -- so the dropdowns used to blank
// out here while the text inputs survived. Assert both kinds of field.
const kept = await page.evaluate(() => ({
  name: document.querySelector('input[name="name"]').value,
  location: document.querySelector('input[name="location"]').value,
  service: document.querySelector('select[name="service"]').value,
  urgency: document.querySelector('select[name="urgency"]').value,
}))
const retained =
  kept.name === 'Test Homeowner' &&
  kept.location === 'Gainesville' &&
  kept.service === 'garage-door-spring-replacement' &&
  kept.urgency === 'today-tomorrow'
console.log(`3) values retained after error -> ${JSON.stringify(kept)}`)
console.log(`   ${retained ? 'PASS' : 'FAIL'} (text inputs AND selects must survive)`)

// --- 4. Valid submission --------------------------------------------------
await page.$eval('input[name="phone"]', (el) => (el.value = ''))
await page.type('input[name="phone"]', '(770) 555-0142')
await page.type(
  'textarea[name="notes"]',
  'Automated test submission — loud bang, door will not lift. Double door.'
)
const post = page.waitForResponse(
  (r) => r.request().method() === 'POST' && r.url().includes('/contact'),
  { timeout: 20000 }
)
await page.click(submit)
const res = await post
await page.waitForFunction(() => document.body.innerText.includes('Got it'), { timeout: 20000 })
console.log(`\n4) valid submit -> action POST ${res.status()}, success state rendered  PASS`)

// --- 5. Honeypot should be invisible to users but present in the DOM -------
await page.goto(`${BASE}/contact`, { waitUntil: 'networkidle0' })
const honeypot = await page.$eval('input[name="company"]', (el) => {
  const r = el.getBoundingClientRect()
  return { onScreen: r.right > 0 && r.left < window.innerWidth, tabIndex: el.tabIndex }
})
console.log(
  `\n5) honeypot offscreen=${!honeypot.onScreen} tabIndex=${honeypot.tabIndex}  ${
    !honeypot.onScreen && honeypot.tabIndex === -1 ? 'PASS' : 'FAIL'
  }`
)

await browser.close()
