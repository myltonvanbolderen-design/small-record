import puppeteer from 'puppeteer'
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

const URL = process.env.CAROUSEL_URL || 'http://localhost:3000/carousel/'
const OUT_DIR = resolve(process.cwd(), 'public/carousel-export')
const SLIDE_W = 1080
const SLIDE_H = 1350
const TOTAL_SLIDES = 7

await mkdir(OUT_DIR, { recursive: true })

const browser = await puppeteer.launch({
  headless: true,
  protocolTimeout: 180000,
  defaultViewport: { width: 1280, height: 1400, deviceScaleFactor: 2 },
})

try {
  const page = await browser.newPage()
  page.setDefaultTimeout(120000)

  console.log(`→ Loading ${URL}`)
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 120000 })

  await page.waitForSelector('[data-slide="7"]', { timeout: 60000 })

  console.log('→ Waiting for images...')
  await page.evaluate(
    () =>
      new Promise((res) => {
        const imgs = Array.from(document.images)
        if (imgs.length === 0) return res()
        let remaining = imgs.length
        const done = () => {
          remaining -= 1
          if (remaining <= 0) res()
        }
        imgs.forEach((img) => {
          if (img.complete) return done()
          img.addEventListener('load', done, { once: true })
          img.addEventListener('error', done, { once: true })
        })
        setTimeout(res, 30000)
      }),
  )

  await new Promise((r) => setTimeout(r, 1500))

  for (let i = 1; i <= TOTAL_SLIDES; i++) {
    const selector = `[data-slide="${i}"]`
    const element = await page.$(selector)
    if (!element) {
      console.warn(`⚠ Slide ${i} not found (${selector})`)
      continue
    }
    const file = resolve(OUT_DIR, `slide-${String(i).padStart(2, '0')}.png`)
    await element.screenshot({
      path: file,
      type: 'png',
      captureBeyondViewport: true,
      clip: undefined,
    })
    console.log(`✓ slide-${String(i).padStart(2, '0')}.png (${SLIDE_W}×${SLIDE_H})`)
  }

  console.log(`\n✅ Exported ${TOTAL_SLIDES} slides to ${OUT_DIR}`)
} finally {
  await browser.close()
}
