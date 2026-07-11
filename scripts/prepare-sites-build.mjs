import { copyFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const outputDirectory = resolve(root, "dist", "server");

await mkdir(outputDirectory, { recursive: true });
await copyFile(resolve(root, "src", "sites-worker.js"), resolve(outputDirectory, "index.js"));
