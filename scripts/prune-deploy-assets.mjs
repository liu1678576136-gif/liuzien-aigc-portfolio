import { rm } from "node:fs/promises";
import { join } from "node:path";

const outputRoot = join(process.cwd(), "dist", "assets");
const unusedAssets = [
  "hero-background.mp4",
  "portrait-panel.svg",
  "professional-portrait-base.png",
  "project-aigc.svg",
  "project-brand.svg",
  "project-ecommerce.svg",
  "project-exhibition.svg",
  "project-vi-identity-board.png",
  "project-vi-youxin-board.png",
  "project-vi-youxin-brand-book-cover.jpg",
  join("marquee", "break-algorithm-poster.png"),
  "project-vi-youxin-brand-book.pdf",
  join("marquee", "cancer-cake-motion.gif"),
  join("marquee", "running-hoarding-poster.jpg"),
  "scroll-sequence",
  "season-gallery",
];

await Promise.all(unusedAssets.map((asset) => rm(join(outputRoot, asset), { force: true, recursive: true })));
