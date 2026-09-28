// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*", "node_modules/*"],
    settings: {
      // "@env" is provided by react-native-dotenv at build time
      "import/core-modules": ["@env"],
    },
    rules: {
      "import/no-unresolved": ["error", { ignore: ["^@env$"] }],
    },
  },
]);
