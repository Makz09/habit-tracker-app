/**
 * sync-version.js
 * 
 * Reads the latest git tag and updates app.json's version field.
 * Run manually with: npm run version-sync
 * Runs automatically before: npm start, npm run android
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const appJsonPath = path.resolve(__dirname, '..', 'app.json');

try {
  // Get the latest git tag (e.g., "v1.2.0", "HabitTrackerMobAppv1.0.0")
  const rawTag = execSync('git describe --tags --abbrev=0', { encoding: 'utf8' }).trim();
  
  // Extract semver from tag (handles "v1.2.0", "HabitTrackerMobAppv1.0.0", "1.2.0", etc.)
  const match = rawTag.match(/(\d+\.\d+\.\d+)/);
  if (!match) {
    console.warn(`⚠ Could not extract version from tag: "${rawTag}". Skipping.`);
    process.exit(0);
  }
  const version = match[1];


  // Read current app.json
  const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
  const oldVersion = appJson.expo.version;

  if (oldVersion === version) {
    console.log(`✔ App version already up to date: ${version}`);
    process.exit(0);
  }

  // Update version
  appJson.expo.version = version;
  fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2) + '\n');

  console.log(`✔ App version synced: ${oldVersion} → ${version} (from tag: ${rawTag})`);
} catch (error) {
  if (error.message && error.message.includes('No names found')) {
    console.warn('⚠ No git tags found. Skipping version sync.');
  } else {
    console.warn('⚠ Version sync skipped:', error.message);
  }
  process.exit(0); // Don't block the build
}
