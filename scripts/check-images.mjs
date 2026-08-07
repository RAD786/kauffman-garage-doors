/**
 * Verifies every image referenced in the data files exists in /public and that
 * its declared width/height match the real file. Catches typos, missing
 * leading slashes and stale dimensions before they hit a page.
 *   node scripts/check-images.mjs
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

/** `--fix` rewrites declared width/height to the file's real dimensions. */
const FIX = process.argv.includes('--fix')

/** Minimal PNG/JPEG header reader -- avoids pulling in an image library. */
function dimensions(file) {
  const b = readFileSync(file)
  if (b.length > 24 && b.readUInt32BE(0) === 0x89504e47) {
    return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) }
  }
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2
    while (i < b.length) {
      if (b[i] !== 0xff) { i++; continue }
      const marker = b[i + 1]
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) }
      }
      i += 2 + b.readUInt16BE(i + 2)
    }
  }
  return null
}

const files = ['src/data/services.ts', 'src/data/cities.ts']
const referenced = new Set()
let problems = 0

for (const file of files) {
  let src = readFileSync(file, 'utf8')
  const rewrites = []
  // Match each image block: src / width / height in order.
  const re = /src:\s*'([^']+)',\s*\n\s*width:\s*(\d+),\s*\n\s*height:\s*(\d+),/g
  let m
  while ((m = re.exec(src))) {
    const [, path, w, h] = m
    const line = src.slice(0, m.index).split('\n').length
    const label = `${file}:${line}`

    if (!path.startsWith('/')) {
      console.log(`FAIL ${label}  "${path}" is missing a leading slash`)
      problems++
      continue
    }
    referenced.add(path)

    const onDisk = join('public', path)
    if (!existsSync(onDisk)) {
      console.log(`FAIL ${label}  "${path}" does not exist in /public`)
      problems++
      continue
    }

    const d = dimensions(onDisk)
    if (!d) {
      console.log(`WARN ${label}  "${path}" -- could not read dimensions`)
      continue
    }
    if (d.w !== Number(w) || d.h !== Number(h)) {
      if (FIX) {
        rewrites.push([m[0], m[0].replace(/width:\s*\d+/, `width: ${d.w}`).replace(/height:\s*\d+/, `height: ${d.h}`)])
        console.log(`FIXED ${label}  ${path}  ${w}x${h} -> ${d.w}x${d.h}`)
      } else {
        console.log(
          `FAIL ${label}  "${path}" declared ${w}x${h} but file is ${d.w}x${d.h} -- causes layout shift`
        )
        problems++
      }
      continue
    }
    console.log(`ok   ${label}  ${path}  ${d.w}x${d.h}`)
  }

  if (FIX && rewrites.length) {
    for (const [from, to] of rewrites) src = src.replace(from, to)
    writeFileSync(file, src)
  }
}

// Also scan page/component files for hard-coded <Image src="/images/..."> so the
// "unreferenced" list below does not raise false alarms.
function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) walk(p)
    else if (/\.(tsx|ts)$/.test(e.name)) {
      for (const mm of readFileSync(p, 'utf8').matchAll(/['"](\/images\/[^'"]+)['"]/g)) {
        referenced.add(mm[1])
      }
    }
  }
}
walk('src')

// Photos sitting in /public/images that nothing references yet.
const used = new Set([...referenced].map((p) => p.replace('/images/', '')))
const extra = readdirSync('public/images').filter(
  (f) => !used.has(f) && !/^(logo|logo-mark|logo-schema|hero)\.png$/.test(f)
)
if (extra.length) {
  console.log(`\nIn /public/images but not referenced yet (${extra.length}):`)
  for (const f of extra) console.log('  ' + f)
}

console.log(problems === 0 ? '\nAll referenced images OK.' : `\n${problems} problem(s).`)
process.exit(problems ? 1 : 0)
