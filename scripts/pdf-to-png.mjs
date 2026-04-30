// One-off: convert /public/AMBROSONI/*.pdf → /public/AMBROSONI/depto-N-plano.png
// Renders via headless Chromium + pdf.js (CDN) onto a canvas, screenshots it,
// then trims white margins with sharp so the plano fills its frame in the card.

import { chromium } from "playwright"
import sharp from "sharp"
import { readFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import path from "node:path"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.join(__dirname, "..", "public", "AMBROSONI")

const jobs = [
  { pdf: "Depto 1 Ambrosoni.pdf", out: "depto-1-plano.png" },
  { pdf: "depto 2 Ambrosoni.pdf", out: "depto-2-plano.png" },
  { pdf: "depto 3 Ambrosoni.pdf", out: "depto-3-plano.png" },
]

const html = `<!doctype html>
<html><head><meta charset="utf-8"><style>
  html,body { margin:0; padding:0; background:#fff; }
  #c { display:block; }
</style></head><body>
<canvas id="c"></canvas>
<script type="module">
  import * as pdfjs from "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.6.82/build/pdf.min.mjs"
  pdfjs.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.6.82/build/pdf.worker.min.mjs"
  window.renderPdf = async (base64) => {
    const bin = atob(base64)
    const bytes = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
    const doc = await pdfjs.getDocument({ data: bytes }).promise
    const page = await doc.getPage(1)
    const scale = 2.5
    const viewport = page.getViewport({ scale })
    const canvas = document.getElementById("c")
    canvas.width = Math.ceil(viewport.width)
    canvas.height = Math.ceil(viewport.height)
    const ctx = canvas.getContext("2d")
    ctx.fillStyle = "#fff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    await page.render({ canvasContext: ctx, viewport }).promise
    return { w: canvas.width, h: canvas.height }
  }
</script>
</body></html>`

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 2400, height: 3200 } })
const page = await ctx.newPage()
await page.setContent(html, { waitUntil: "load" })
await page.waitForFunction(() => typeof window.renderPdf === "function", null, { timeout: 30000 })

for (const job of jobs) {
  const pdfPath = path.join(publicDir, job.pdf)
  const outPath = path.join(publicDir, job.out)
  const buf = readFileSync(pdfPath)
  const b64 = buf.toString("base64")
  console.log(`→ rendering ${job.pdf} (${(buf.length / 1024).toFixed(0)} KB)`)
  const { w, h } = await page.evaluate(async (b64) => window.renderPdf(b64), b64)
  await page.setViewportSize({ width: w, height: h })
  const canvasHandle = await page.$("#c")
  const rawPng = await canvasHandle.screenshot({ omitBackground: false })

  // The PDFs have a faint page-border outline that defeats sharp's trim().
  // Detect bounds by scanning for "real" content — pixels darker than 200
  // on any channel — which captures the plano walls + dimensions but ignores
  // the page outline. Pad 80px so the plano isn't flush against the card.
  const { data, info } = await sharp(rawPng).raw().toBuffer({ resolveWithObject: true })
  const W = info.width, H = info.height, C = info.channels
  // Row/column is "content" if it has at least MIN_DARK pixels darker than
  // the DARK threshold. The PDF page border is a single-pixel faint line, so
  // requiring >= 5 dark pixels filters it out and only catches real plano
  // strokes (walls, dimension text, dots).
  // Row/column is "content" if it has at least MIN_DARK pixels darker than
  // the DARK threshold. The PDF page border is a single-pixel faint line, so
  // requiring >= 5 dark pixels filters it out and only catches real plano
  // strokes (walls, dimension text, dots).
  let top = H, bottom = 0, left = W, right = 0
  const DARK = 100
  const MIN_DARK = 5
  const rowDark = new Int32Array(H)
  const colDark = new Int32Array(W)
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * C
      if (data[i] < DARK || data[i + 1] < DARK || data[i + 2] < DARK) {
        rowDark[y]++
        colDark[x]++
      }
    }
  }
  for (let y = 0; y < H; y++) if (rowDark[y] >= MIN_DARK) { top = y; break }
  for (let y = H - 1; y >= 0; y--) if (rowDark[y] >= MIN_DARK) { bottom = y; break }
  for (let x = 0; x < W; x++) if (colDark[x] >= MIN_DARK) { left = x; break }
  for (let x = W - 1; x >= 0; x--) if (colDark[x] >= MIN_DARK) { right = x; break }
  const PAD = 80
  const cropLeft = Math.max(0, left - PAD)
  const cropTop = Math.max(0, top - PAD)
  const cropW = Math.min(W - cropLeft, right - left + PAD * 2)
  const cropH = Math.min(H - cropTop, bottom - top + PAD * 2)
  const trimmed = await sharp(rawPng)
    .extract({ left: cropLeft, top: cropTop, width: cropW, height: cropH })
    .png({ compressionLevel: 9 })
    .toBuffer()
  const meta = await sharp(trimmed).metadata()

  writeFileSync(outPath, trimmed)
  console.log(`  ✓ ${job.out} (${meta.width}×${meta.height}, ${(trimmed.length / 1024).toFixed(0)} KB)`)
}

await browser.close()
console.log("done.")
