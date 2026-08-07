/**
 * Dev-only full-site audit: crawls every internal link and reports SEO,
 * accessibility, content and Core Web Vitals problems.
 *   node scripts/seo-audit.mjs [baseUrl]
 * Requires the production server running (npm start on :3111).
 */
import puppeteer from 'puppeteer-core'

const BASE = process.argv[2] || 'http://localhost:3111'
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: 'new',
  args: ['--hide-scrollbars', '--disable-gpu'],
})

const seen = new Map()
const queue = ['/']
const externalLinks = new Set()
const findings = []
const add = (sev, area, msg) => findings.push({ sev, area, msg })

const page = await browser.newPage()
await page.setViewport({ width: 1366, height: 900 })

while (queue.length) {
  const path = queue.shift()
  if (seen.has(path)) continue

  const res = await page.goto(BASE + path, { waitUntil: 'networkidle0', timeout: 45000 })
  const status = res.status()

  const data = await page.evaluate(() => {
    const meta = (n) => document.querySelector(`meta[name="${n}"]`)?.content ?? null
    const prop = (p) => document.querySelector(`meta[property="${p}"]`)?.content ?? null

    // Heading order: flag any jump of more than one level.
    const heads = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => ({
      level: Number(h.tagName[1]),
      text: h.textContent.trim().slice(0, 60),
    }))
    const headOrder = []
    let prev = 0
    for (const h of heads) {
      if (prev && h.level > prev + 1) headOrder.push(`h${prev} -> h${h.level} ("${h.text}")`)
      prev = h.level
    }

    // Effective background: walk ancestors until something opaque.
    const bgOf = (el) => {
      let n = el
      while (n && n !== document.documentElement) {
        const c = getComputedStyle(n).backgroundColor
        const m = c.match(/rgba?\(([^)]+)\)/)
        if (m) {
          const p = m[1].split(',').map(Number)
          if (p.length < 4 || p[3] > 0.85) return [p[0], p[1], p[2]]
        }
        n = n.parentElement
      }
      return [255, 255, 255]
    }
    const lum = ([r, g, b]) => {
      const f = (v) => {
        v /= 255
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
      }
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
    }
    const ratio = (a, b) => {
      const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m)
      return (x + 0.05) / (y + 0.05)
    }

    const contrast = []
    for (const el of document.querySelectorAll('body *')) {
      if (!el.childNodes.length) continue
      // SVG <text> paints with `fill`, not CSS `color`, and the placeholder
      // graphics are decorative anyway. aria-hidden subtrees (the honeypot,
      // decorative glyphs) are not exposed to users either.
      if (el instanceof SVGElement) continue
      if (el.closest('[aria-hidden="true"]')) continue
      const direct = [...el.childNodes].some(
        (n) => n.nodeType === 3 && n.textContent.trim().length > 1
      )
      if (!direct) continue
      const cs = getComputedStyle(el)
      if (cs.visibility === 'hidden' || cs.display === 'none' || cs.opacity === '0') continue
      const r = el.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) continue
      const m = cs.color.match(/rgba?\(([^)]+)\)/)
      if (!m) continue
      const p = m[1].split(',').map(Number)
      if (p.length > 3 && p[3] < 0.5) continue
      const fg = [p[0], p[1], p[2]]
      const size = parseFloat(cs.fontSize)
      const weight = Number(cs.fontWeight) || 400
      const large = size >= 24 || (size >= 18.66 && weight >= 700)
      const need = large ? 3 : 4.5
      const cr = ratio(fg, bgOf(el))
      if (cr < need) {
        contrast.push({
          cr: cr.toFixed(2),
          need,
          size: Math.round(size),
          cls: (el.className?.baseVal ?? el.className ?? '').toString().slice(0, 70),
          text: el.textContent.trim().slice(0, 40),
        })
      }
    }

    // Targets below the WCAG 2.5.8 minimum of 24x24.
    const smallTargets = []
    for (const el of document.querySelectorAll('a, button, select, input, textarea, summary')) {
      const r = el.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) continue
      const cs = getComputedStyle(el)
      if (cs.position === 'absolute' && r.left < 0) continue
      if (el.closest('nav, footer, .prose-local')) continue
      // WCAG 2.5.8 "Inline" exception: a link sitting inside a sentence is
      // exempt, because padding it would break the line box. Detect it by
      // looking for sibling text in the parent block.
      const parent = el.parentElement
      const inline =
        cs.display.startsWith('inline') &&
        parent &&
        [...parent.childNodes].some(
          (n) => n.nodeType === 3 && n.textContent.trim().length > 0
        )
      if (inline) continue
      if (r.height < 24 || r.width < 24) {
        smallTargets.push({
          tag: el.tagName.toLowerCase(),
          h: Math.round(r.height),
          w: Math.round(r.width),
          text: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30),
        })
      }
    }

    return {
      title: document.title,
      titleLen: document.title.length,
      desc: meta('description'),
      descLen: (meta('description') || '').length,
      canonical: document.querySelector('link[rel="canonical"]')?.href ?? null,
      robots: meta('robots'),
      ogTitle: prop('og:title'),
      ogImage: prop('og:image'),
      ogUrl: prop('og:url'),
      h1: [...document.querySelectorAll('h1')].map((h) => h.textContent.trim()),
      headOrder,
      words: (document.querySelector('main')?.innerText || '').split(/\s+/).filter(Boolean).length,
      links: [...document.querySelectorAll('a[href]')].map((a) => ({
        href: a.getAttribute('href'),
        abs: a.href,
        text: (a.textContent || a.getAttribute('aria-label') || '').trim().slice(0, 40),
        newTab: a.target === '_blank',
        rel: a.rel,
      })),
      imgs: [...document.querySelectorAll('img')].map((i) => ({
        src: i.getAttribute('src')?.slice(0, 70),
        alt: i.getAttribute('alt'),
        w: i.getAttribute('width'),
        h: i.getAttribute('height'),
        loading: i.getAttribute('loading'),
        fetchpriority: i.getAttribute('fetchpriority'),
      })),
      ids: [...document.querySelectorAll('[id]')].map((e) => e.id),
      jsonLd: [...document.querySelectorAll('script[type="application/ld+json"]')].map(
        (s) => s.textContent
      ),
      contrast,
      smallTargets,
      lang: document.documentElement.lang,
    }
  })

  seen.set(path, { status, ...data })

  for (const l of data.links) {
    const u = new URL(l.abs)
    if (u.origin !== new URL(BASE).origin) {
      if (!/^(tel:|mailto:)/.test(l.href)) externalLinks.add(l.href)
      continue
    }
    const p = u.pathname + (u.hash || '')
    const bare = u.pathname
    if (!seen.has(bare) && !queue.includes(bare)) queue.push(bare)
    // Fragment targets must exist on the page they point at.
    if (u.hash && bare === path && !data.ids.includes(u.hash.slice(1))) {
      add('ERROR', 'links', `${path}: fragment ${u.hash} has no matching id on the same page`)
    }
    void p
  }
}

await page.close()

/* ---------------------------------------------------------------- analysis */

const pages = [...seen.entries()]

for (const [path, d] of pages) {
  if (d.status !== 200) add('ERROR', 'links', `${path} returned ${d.status}`)
  if (d.h1.length !== 1) add('ERROR', 'headings', `${path}: ${d.h1.length} <h1> elements`)
  for (const j of d.headOrder) add('WARN', 'headings', `${path}: heading jump ${j}`)
  if (!d.canonical) add('ERROR', 'meta', `${path}: no canonical`)
  if (!d.desc) add('ERROR', 'meta', `${path}: no meta description`)
  if (d.titleLen > 62) add('WARN', 'meta', `${path}: title ${d.titleLen} chars (>62 truncates)`)
  if (d.descLen > 158) add('WARN', 'meta', `${path}: description ${d.descLen} chars (>158 truncates)`)
  if (d.descLen && d.descLen < 70) add('WARN', 'meta', `${path}: description only ${d.descLen} chars`)
  if (!d.ogImage) add('WARN', 'meta', `${path}: no og:image`)
  if (d.words < 300) add('WARN', 'content', `${path}: only ${d.words} words in <main> (thin)`)
  if (d.lang !== 'en-US') add('WARN', 'a11y', `${path}: html lang="${d.lang}"`)

  for (const i of d.imgs) {
    if (i.alt === null) add('ERROR', 'images', `${path}: <img> with no alt (${i.src})`)
    if (!i.w || !i.h) add('WARN', 'images', `${path}: <img> without width/height (${i.src}) — CLS risk`)
  }
  for (const c of d.contrast) {
    add('ERROR', 'a11y', `${path}: contrast ${c.cr}:1 (needs ${c.need}) ${c.size}px "${c.text}" .${c.cls}`)
  }
  for (const t of d.smallTargets) {
    add('WARN', 'a11y', `${path}: ${t.tag} target ${t.w}x${t.h}px "${t.text}"`)
  }
  for (const raw of d.jsonLd) {
    try {
      JSON.parse(raw)
    } catch {
      add('ERROR', 'schema', `${path}: invalid JSON-LD`)
    }
  }
  // Canonical should match the URL actually crawled.
  const expect = new URL(path, 'https://kauffmangarage.com').href
  if (d.canonical && d.canonical.replace(/\/$/, '') !== expect.replace(/\/$/, '')) {
    add('ERROR', 'meta', `${path}: canonical mismatch -> ${d.canonical}`)
  }
}

// Duplicate titles / descriptions.
for (const key of ['title', 'desc']) {
  const byVal = new Map()
  for (const [p, d] of pages) {
    const v = d[key]
    if (!v) continue
    if (!byVal.has(v)) byVal.set(v, [])
    byVal.get(v).push(p)
  }
  for (const [v, ps] of byVal) {
    if (ps.length > 1)
      add('ERROR', 'meta', `duplicate ${key} on ${ps.join(', ')} -> "${v.slice(0, 60)}..."`)
  }
}

/*
 * Near-duplicate detection, boilerplate-aware.
 *
 * Comparing raw <main> text is misleading: the CTA band, lead form, trust bar
 * and sidebar are template chrome that legitimately repeats sitewide, and a
 * search engine discounts it. So first collect every block-level text node,
 * count how many pages each one appears on, drop anything appearing on more
 * than half the site, and only then compare what is left. That is the actual
 * editorial duplication.
 */
const shingles = (t) => {
  const w = t.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean)
  const s = new Set()
  for (let i = 0; i + 6 <= w.length; i++) s.add(w.slice(i, i + 6).join(' '))
  return s
}

const blockPage = await browser.newPage()
const pageBlocks = []
for (const [path] of pages) {
  await blockPage.goto(BASE + path, { waitUntil: 'domcontentloaded' })
  const blocks = await blockPage.evaluate(() =>
    [...document.querySelectorAll('main p, main li, main h1, main h2, main h3, main dd, main summary')]
      .map((el) => el.innerText.trim())
      .filter((t) => t.length > 25)
  )
  pageBlocks.push([path, blocks])
}
await blockPage.close()

const blockFreq = new Map()
for (const [, blocks] of pageBlocks) {
  for (const b of new Set(blocks)) blockFreq.set(b, (blockFreq.get(b) || 0) + 1)
}
const boilerplateCut = Math.max(2, Math.floor(pages.length * 0.5))
const editorial = pageBlocks.map(([path, blocks]) => [
  path,
  shingles(blocks.filter((b) => blockFreq.get(b) < boilerplateCut).join(' ')),
])

const chromeBlocks = [...blockFreq.values()].filter((n) => n >= boilerplateCut).length
console.log(
  `\nBoilerplate filter: ${chromeBlocks} text blocks appear on >=${boilerplateCut} of ${pages.length} pages and were excluded from duplicate detection.`
)

for (let i = 0; i < editorial.length; i++) {
  for (let j = i + 1; j < editorial.length; j++) {
    const [pa, sa] = editorial[i]
    const [pb, sb] = editorial[j]
    if (sa.size < 50 || sb.size < 50) continue
    let shared = 0
    for (const s of sa) if (sb.has(s)) shared++
    const pct = shared / Math.min(sa.size, sb.size)
    if (pct > 0.25)
      add('WARN', 'content', `${(pct * 100).toFixed(0)}% editorial overlap: ${pa} vs ${pb}`)
  }
}
for (const [path, s] of editorial) {
  if (s.size < 120)
    add('WARN', 'content', `${path}: only ~${s.size} unique 6-grams after boilerplate removal`)
}

/* ------------------------------------------------------- Core Web Vitals */

const cwvPage = await browser.newPage()
const cwv = []
for (const target of ['/', '/services/garage-door-repair', '/service-areas/gainesville', '/contact']) {
  for (const [label, vp] of [
    ['mobile', { width: 390, height: 844, isMobile: true, deviceScaleFactor: 2 }],
    ['desktop', { width: 1366, height: 900, deviceScaleFactor: 1 }],
  ]) {
    await cwvPage.setViewport(vp)
    await cwvPage.goto(BASE + target, { waitUntil: 'networkidle0' })
    const m = await cwvPage.evaluate(
      () =>
        new Promise((resolve) => {
          const out = { lcp: 0, cls: 0, lcpEl: '' }
          new PerformanceObserver((l) => {
            const e = l.getEntries().at(-1)
            out.lcp = e.startTime
            out.lcpEl = e.element ? e.element.tagName + '.' + (e.element.className || '').slice(0, 40) : e.url || ''
          }).observe({ type: 'largest-contentful-paint', buffered: true })
          new PerformanceObserver((l) => {
            for (const e of l.getEntries()) if (!e.hadRecentInput) out.cls += e.value
          }).observe({ type: 'layout-shift', buffered: true })
          const nav = performance.getEntriesByType('navigation')[0]
          out.ttfb = nav?.responseStart ?? 0
          out.domSize = document.querySelectorAll('*').length
          out.transferKB = Math.round(
            performance.getEntriesByType('resource').reduce((a, r) => a + (r.transferSize || 0), 0) / 1024
          )
          setTimeout(() => resolve(out), 1200)
        })
    )
    cwv.push({ target, label, ...m })
    if (m.cls > 0.1) add('ERROR', 'cwv', `${target} [${label}] CLS ${m.cls.toFixed(3)} (>0.1)`)
    if (m.lcp > 2500) add('WARN', 'cwv', `${target} [${label}] LCP ${Math.round(m.lcp)}ms (>2500)`)
    if (m.domSize > 1500) add('WARN', 'cwv', `${target} [${label}] DOM ${m.domSize} nodes (>1500)`)
  }
}
await cwvPage.close()
await browser.close()

/* ------------------------------------------------------------------ report */

console.log(`\nCrawled ${pages.length} pages from ${BASE}\n`)
console.log('URL                                          status  words  title  desc  links')
for (const [p, d] of pages) {
  console.log(
    `${p.padEnd(44)} ${String(d.status).padEnd(6)} ${String(d.words).padEnd(6)} ${String(d.titleLen).padEnd(6)} ${String(d.descLen).padEnd(5)} ${d.links.length}`
  )
}

console.log('\nCore Web Vitals (local prod build, no network throttling):')
for (const c of cwv) {
  console.log(
    `  ${c.target.padEnd(34)} ${c.label.padEnd(8)} LCP ${String(Math.round(c.lcp)).padStart(5)}ms  CLS ${c.cls.toFixed(3)}  TTFB ${String(Math.round(c.ttfb)).padStart(4)}ms  DOM ${String(c.domSize).padStart(4)}  ${c.transferKB}KB`
  )
}

if (externalLinks.size) {
  console.log('\nExternal links:')
  for (const l of externalLinks) console.log('  ' + l)
} else {
  console.log('\nExternal links: none')
}

// Most findings repeat on every page (shared header/footer/form). Collapse them
// to one line per distinct issue with a count, so the real list is readable.
const norm = (m) =>
  m
    .replace(/^\/[^:]*: /, '')
    .replace(/\/service-areas\/[a-z-]+/g, '/service-areas/*')
    .replace(/\/services\/[a-z-]+/g, '/services/*')
    .replace(/"[^"]*"/g, '"…"')
    .replace(/\d+×\d+|\d+ × \d+/g, 'NxN')

const grouped = new Map()
for (const f of findings) {
  const key = `${f.sev}|${f.area}|${norm(f.msg)}`
  if (!grouped.has(key)) grouped.set(key, { ...f, count: 0, sample: f.msg })
  grouped.get(key).count++
}
const list = [...grouped.values()]
const order = { ERROR: 0, WARN: 1 }
list.sort((a, b) => order[a.sev] - order[b.sev] || a.area.localeCompare(b.area) || b.count - a.count)

console.log(`\n${findings.length} raw findings -> ${list.length} distinct issues\n`)
let lastArea = ''
for (const f of list) {
  const k = f.sev + f.area
  if (k !== lastArea) {
    console.log(`\n[${f.sev}] ${f.area}`)
    lastArea = k
  }
  console.log(`  (x${String(f.count).padStart(2)}) ${f.sample}`)
}
