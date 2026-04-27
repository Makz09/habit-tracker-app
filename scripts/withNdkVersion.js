const { withProjectBuildGradle } = require('@expo/config-plugins');

/**
 * Expo Config Plugin to force NDK version in android/build.gradle
 * This ensures the fix persists even after running npx expo prebuild.
 */
const withNdkVersion = (config, ndkVersion) => {
  return withProjectBuildGradle(config, (config) => {
    if (config.modResults.language === 'gradle') {
      const contents = config.modResults.contents;
      
      // Check if it's already there to avoid duplicates
      if (!contents.includes('rootProject.ext.ndkVersion =')) {
        config.modResults.contents = contents + `
// Force NDK version (Added by local plugin)
rootProject.ext.ndkVersion = "${ndkVersion}"
`;
      }
    }
    return config;
  });
};

module.exports = withNdkVersion;
