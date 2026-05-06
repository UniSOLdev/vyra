import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dir = path.join(__dirname, "../public/products")
const SIZE = 2048
/** Matches studio spec (#0f0f0f) for letterboxing */
const bg = { r: 15, g: 15, b: 15 }

const files = fs.readdirSync(dir).filter((f) => f.endsWith(".png"))

for (const f of files) {
  const input = path.join(dir, f)
  const tmp = path.join(dir, `.tmp-${f}`)
  await sharp(input)
    .rotate()
    .resize(SIZE, SIZE, { fit: "contain", background: bg })
    .png({ compressionLevel: 9, adaptiveFiltering: true, effort: 10 })
    .toFile(tmp)
  fs.renameSync(tmp, input)
  process.stdout.write(`optimized ${f}\n`)
}
