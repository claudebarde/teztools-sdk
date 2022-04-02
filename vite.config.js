const path = require("path");
const { defineConfig } = require("vite");

module.exports = defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      formats: ["es", "cjs"],
      name: "TezTools SDK",
      fileName: format => `teztools-sdk.${format}.js`
    }
  }
});
