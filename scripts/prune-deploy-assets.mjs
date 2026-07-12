import { rm } from "node:fs/promises";
import { join } from "node:path";

const outputRoot = join(process.cwd(), "dist", "assets");
const unusedAssets = [
  "project-vi-youxin-brand-book.pdf",
  join("marquee", "cancer-cake-motion.gif"),
  "scroll-sequence",
  "season-gallery",
];

await Promise.all(unusedAssets.map((asset) => rm(join(outputRoot, asset), { force: true, recursive: true })));
