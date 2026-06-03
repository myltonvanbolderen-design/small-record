import puppeteer from 'puppeteer'

const browser = await puppeteer.launch({
  headless: true,
  protocolTimeout: 180000,
  defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 1 },
})
const page = await browser.newPage()
page.setDefaultTimeout(60000)
await page.goto('http://localhost:3000/v2/', { waitUntil: 'domcontentloaded', timeout: 60000 })

// Wait for fonts + images
await page.evaluate(
  () =>
    new Promise((res) => {
      const imgs = Array.from(document.images)
      if (imgs.length === 0) return res()
      let r = imgs.length
      const done = () => {
        r -= 1
        if (r <= 0) res()
      }
      imgs.forEach((img) => {
        if (img.complete) return done()
        img.addEventListener('load', done, { once: true })
        img.addEventListener('error', done, { once: true })
      })
      setTimeout(res, 20000)
    }),
)
await new Promise((r) => setTimeout(r, 1500))

// Scroll to bottom slowly to trigger all whileInView animations
await page.evaluate(async () => {
  const total = document.documentElement.scrollHeight
  const step = window.innerHeight * 0.5
  for (let y = 0; y < total; y += step) {
    window.scrollTo(0, y)
    await new Promise((r) => setTimeout(r, 250))
  }
  window.scrollTo(0, 0)
  await new Promise((r) => setTimeout(r, 500))
})

// Full page screenshot
await page.screenshot({ path: '/tmp/v2-full.png', fullPage: true })
console.log('full page → /tmp/v2-full.png')

// Above-the-fold
await page.screenshot({ path: '/tmp/v2-fold.png' })
console.log('above-fold → /tmp/v2-fold.png')

await browser.close()
