import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const generatedFiles = [
  {
    path: "android/capacitor-cordova-android-plugins/build.gradle",
    content: `apply plugin: 'com.android.library'

android {
    namespace "capacitor.cordova.android.plugins"
    compileSdk rootProject.ext.compileSdkVersion

    defaultConfig {
        minSdkVersion rootProject.ext.minSdkVersion
    }
}
`,
  },
  {
    path: "android/capacitor-cordova-android-plugins/cordova.variables.gradle",
    content: "// No Cordova plugins are installed in this app.\n",
  },
  {
    path: "android/capacitor-cordova-android-plugins/src/main/AndroidManifest.xml",
    content: `<manifest xmlns:android="http://schemas.android.com/apk/res/android" />\n`,
  },
];

for (const file of generatedFiles) {
  if (existsSync(file.path)) continue;
  mkdirSync(dirname(file.path), { recursive: true });
  writeFileSync(file.path, file.content, "utf8");
  console.log(`Created missing optional Capacitor module file: ${file.path}`);
}
