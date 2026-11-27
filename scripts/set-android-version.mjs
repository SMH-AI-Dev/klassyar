import fs from "node:fs";

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
const gradleFile = "android/app/build.gradle";
if (!fs.existsSync(gradleFile)) throw new Error("Android app Gradle file was not found.");

const tag = process.env.GITHUB_REF_NAME || "";
const candidate = tag.startsWith("v") ? tag.slice(1) : packageJson.version;
const match = String(candidate).match(/^(\\d+)\\.(\\d+)\\.(\\d+)(?:[-+].*)?$/);
if (!match) throw new Error(`Invalid semantic version: ${candidate}`);

const major = Number(match[1]);
const minor = Number(match[2]);
const patch = Number(match[3]);
const versionCode = major * 10000 + minor * 100 + patch;
if (!Number.isSafeInteger(versionCode) || versionCode < 1 || versionCode > 2100000000) {
  throw new Error(`Calculated Android versionCode is out of range: ${versionCode}`);
}

let gradle = fs.readFileSync(gradleFile, "utf8");
if (!/versionCode\\s+\\d+/.test(gradle)) throw new Error("versionCode declaration was not found.");
if (!/versionName\\s+["'][^"']+["']/.test(gradle)) throw new Error("versionName declaration was not found.");

gradle = gradle.replace(/versionCode\\s+\\d+/, `versionCode ${versionCode}`);
gradle = gradle.replace(/versionName\\s+["'][^"']+["']/, `versionName "${major}.${minor}.${patch}"`);
fs.writeFileSync(gradleFile, gradle, "utf8");
console.log(`Android version set to ${major}.${minor}.${patch} (versionCode ${versionCode}).`);
