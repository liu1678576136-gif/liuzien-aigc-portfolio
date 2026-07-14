import { execFile } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";
import ffmpegPath from "ffmpeg-static";

const run = promisify(execFile);
const root = process.cwd();
const marqueeRoot = join(root, "public", "assets", "marquee");
const previewRoot = join(marqueeRoot, "previews");
const previewDurationSeconds = "4";

const previewVideos = [
  "july-06-motion.mp4",
  "starry-sky-motion.mp4",
  "spring-commercial-motion.mp4",
  "ding4-marquee-motion.mp4",
  "june-07-motion.mp4",
  "skincare-ad-motion.mp4",
  "tech-ecommerce-ad-motion.mp4",
  "x3-poster-motion.mp4",
];

async function createPreview(file) {
  const source = join(marqueeRoot, file);
  const destination = join(previewRoot, file);

  await run(ffmpegPath, [
    "-y",
    "-i",
    source,
    "-t",
    previewDurationSeconds,
    "-map",
    "0:v:0",
    "-an",
    "-c:v",
    "libx264",
    "-preset",
    "medium",
    "-crf",
    "29",
    "-vf",
    "scale=-2:720:force_original_aspect_ratio=decrease:flags=lanczos,scale=trunc(iw/2)*2:trunc(ih/2)*2",
    "-movflags",
    "+faststart",
    destination,
  ]);
}

await mkdir(previewRoot, { recursive: true });

for (const file of previewVideos) {
  await createPreview(file);
}
