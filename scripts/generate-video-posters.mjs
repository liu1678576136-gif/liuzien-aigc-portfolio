import { execFile } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { promisify } from "node:util";
import ffmpegPath from "ffmpeg-static";

const run = promisify(execFile);
const root = process.cwd();
const assetRoot = process.argv[2] ? join(root, process.argv[2], "assets") : join(root, "public", "assets");
const marqueeVideos = [
  "starry-sky-motion.mp4",
  "spring-commercial-motion.mp4",
  "ding4-marquee-motion.mp4",
  "june-07-motion.mp4",
  "skincare-ad-motion.mp4",
  "tech-ecommerce-ad-motion.mp4",
  "x3-poster-motion.mp4",
];
const seasonVideos = ["spring.mp4", "summer.mp4", "autumn.mp4", "winter.mp4"];

async function createPoster(source, destination) {
  await mkdir(dirname(destination), { recursive: true });
  await run(ffmpegPath, [
    "-y",
    "-ss",
    "0.6",
    "-i",
    source,
    "-frames:v",
    "1",
    "-vf",
    "scale=1280:-2:force_original_aspect_ratio=decrease",
    "-q:v",
    "4",
    destination,
  ]);
}

await Promise.all([
  ...marqueeVideos.map((file) =>
    createPoster(join(assetRoot, "marquee", file), join(assetRoot, "marquee", "posters", file.replace(/\.mp4$/i, ".jpg"))),
  ),
  ...seasonVideos.map((file) =>
    createPoster(join(assetRoot, "season-carousel", file), join(assetRoot, "season-carousel", "posters", file.replace(/\.mp4$/i, ".jpg"))),
  ),
]);
