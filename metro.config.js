const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Enable support for the "exports" field in package.json
config.resolver.unstable_enablePackageExports = true;

// Ensure .js and .mjs are handled correctly for ESM packages
config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs', 'cjs'];

// Custom resolver to handle explicit .js extensions in lucide-react-native
const defaultResolve = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    context.originModulePath.includes('lucide-react-native') &&
    (moduleName.startsWith('./') || moduleName.startsWith('../')) &&
    moduleName.endsWith('.js')
  ) {
    const modifiedModuleName = moduleName.replace(/\.js$/, '');
    return context.resolveRequest(context, modifiedModuleName, platform);
  }
  return defaultResolve ? defaultResolve(context, moduleName, platform) : context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
