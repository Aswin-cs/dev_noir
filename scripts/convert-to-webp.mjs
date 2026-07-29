/**
 * Script to convert all PNG assets to WebP format across all quality tiers.
 * Run with: node scripts/convert-to-webp.mjs
 */
import sharp from "sharp";
import { readdir, stat } from "fs/promises";
import { join, parse } from "path";

const PUBLIC_DIR = "./public";
const QUALITY_DIRS = ["assets_high", "assets_medium", "assets_low", "assets_lowest"];

// WebP quality settings per tier (higher = better quality, larger file)
const WEBP_QUALITY = {
  assets_high: 90,
  assets_medium: 80,
  assets_low: 65,
  assets_lowest: 45,
};

async function convertDirectory(dirName) {
  const dirPath = join(PUBLIC_DIR, dirName);
  const quality = WEBP_QUALITY[dirName] || 80;

  let files;
  try {
    files = await readdir(dirPath);
  } catch {
    console.warn(`⚠ Directory not found: ${dirPath}`);
    return;
  }

  const pngFiles = files.filter((f) => f.endsWith(".png"));

  if (pngFiles.length === 0) {
    console.log(`  ⤷ No PNG files in ${dirName}`);
    return;
  }

  for (const file of pngFiles) {
    const inputPath = join(dirPath, file);
    const { name } = parse(file);
    const outputPath = join(dirPath, `${name}.webp`);

    const inputStats = await stat(inputPath);

    await sharp(inputPath).webp({ quality }).toFile(outputPath);

    const outputStats = await stat(outputPath);
    const savings = (
      ((inputStats.size - outputStats.size) / inputStats.size) *
      100
    ).toFixed(1);

    console.log(
      `  ✓ ${file} → ${name}.webp (${(inputStats.size / 1024).toFixed(0)} KB → ${(outputStats.size / 1024).toFixed(0)} KB, -${savings}%)`
    );
  }
}

async function main() {
  console.log("🔄 Converting PNG assets to WebP...\n");

  for (const dir of QUALITY_DIRS) {
    console.log(`📁 ${dir}/`);
    await convertDirectory(dir);
    console.log();
  }

  console.log("✅ All conversions complete!");
}

main().catch(console.error);
