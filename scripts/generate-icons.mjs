/**
 * Genera los íconos PNG para la PWA de Shoppr usando sharp.
 * Ejecutar con: node scripts/generate-icons.mjs
 */
import sharp from "sharp";
import { mkdirSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, "../public/icons");

if (!existsSync(iconsDir)) {
  mkdirSync(iconsDir, { recursive: true });
}

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

/**
 * Crea un SVG con la letra "S" de Shoppr sobre fondo verde.
 */
function createSvg(size) {
  const padding = Math.round(size * 0.12);
  const fontSize = Math.round(size * 0.55);
  const borderRadius = Math.round(size * 0.2);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${borderRadius}" ry="${borderRadius}" fill="#16a34a"/>
  <text
    x="50%"
    y="50%"
    dominant-baseline="central"
    text-anchor="middle"
    font-family="Arial, Helvetica, sans-serif"
    font-weight="800"
    font-size="${fontSize}"
    fill="#ffffff"
    letter-spacing="-1"
  >S</text>
</svg>`;
}

async function generateIcons() {
  console.log("Generando íconos PWA para Shoppr...\n");

  for (const size of sizes) {
    const svg = createSvg(size);
    const outputPath = join(iconsDir, `icon-${size}x${size}.png`);

    await sharp(Buffer.from(svg))
      .png()
      .toFile(outputPath);

    console.log(`  ✓ icon-${size}x${size}.png`);
  }

  console.log(`\n✅ ${sizes.length} íconos generados en public/icons/`);
}

generateIcons().catch((err) => {
  console.error("Error generando íconos:", err);
  process.exit(1);
});
