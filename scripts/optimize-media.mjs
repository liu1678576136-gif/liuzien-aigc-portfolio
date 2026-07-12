import { execFile } from "node:child_process";
import { readdir, rename, rm, stat } from "node:fs/promises";
import { promisify } from "node:util";
import { join, parse } from "node:path";
import ffmpegPath from "ffmpeg-static";
import sharp from "sharp";

const run = promisify(execFile);
const assetsDirectory = process.argv[2]
  ? join(process.cwd(), process.argv[2])
  : join(process.cwd(), "public", "assets");

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const filePath = join(directory, entry.name);
      return entry.isDirectory() ? walk(filePath) : [filePath];
    }),
  );

  return files.flat();
}

async function optimizeImage(filePath, extension) {
  const temporaryPath = `${filePath}.optimized${extension}`;
  const image = sharp(filePath, { animated: false }).resize({
    width: 1800,
    withoutEnlargement: true,
  });

  if (extension === ".jpg" || extension === ".jpeg") {
    await image.jpeg({ quality: 78, mozjpeg: true, progressive: true }).toFile(temporaryPath);
  } else {
    await image.png({ compressionLevel: 9, palette: true, quality: 82 }).toFile(temporaryPath);
  }

  await rename(temporaryPath, filePath);
}

async function optimizeVideo(filePath) {
  const temporaryPath = `${filePath}.optimized.mp4`;
  await rm(temporaryPath, { force: true });
  await run(ffmpegPath, [
    "-y",
    "-i",
    filePath,
    "-map",
    "0:v:0",
    "-an",
    "-c:v",
    "libx264",
    "-preset",
    "slow",
    "-crf",
    "28",
    "-vf",
    "scale=-2:720:force_original_aspect_ratio=decrease:flags=lanczos,scale=trunc(iw/2)*2:trunc(ih/2)*2",
    "-movflags",
    "+faststart",
    temporaryPath,
  ]);
  await rename(temporaryPath, filePath);
}

const files = await walk(assetsDirectory);
for (const filePath of files) {
  const extension = parse(filePath).ext.toLowerCase();
  const size = (await stat(filePath)).size;

  if ((extension === ".jpg" || extension === ".jpeg" || extension === ".png") && size > 450_000) {
    await optimizeImage(filePath, extension);
  }

  if (extension === ".mp4" && size > 750_000) {
    await optimizeVideo(filePath);
  }
}

await Promise.all(
  (await walk(assetsDirectory))
    .filter((filePath) => filePath.includes(".optimized"))
    .map((filePath) => rm(filePath, { force: true })),
);
