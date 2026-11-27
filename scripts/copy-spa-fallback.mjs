import { copyFileSync, existsSync } from "node:fs";

const source = "dist/index.html";
const destination = "dist/404.html";

if (!existsSync(source)) {
  throw new Error(`Build output not found: ${source}`);
}

copyFileSync(source, destination);
console.log(`Created ${destination} for SPA route fallback.`);
