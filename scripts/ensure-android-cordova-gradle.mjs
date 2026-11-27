import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const variablesFile = "android/capacitor-cordova-android-plugins/cordova.variables.gradle";

if (!existsSync(variablesFile)) {
  mkdirSync(dirname(variablesFile), { recursive: true });
  writeFileSync(
    variablesFile,
    "// No Cordova plugins are installed in this app. This placeholder keeps Capacitor's generated Gradle include valid.\n",
    "utf8",
  );
  console.log("Created empty Capacitor Cordova Gradle variables file.");
} else {
  console.log("Capacitor Cordova Gradle variables file already exists.");
}
