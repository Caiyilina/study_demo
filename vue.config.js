/** @type {import('@vue/cli-service').ProjectOptions} */
const path = require("path");

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  },
  css: {
    loaderOptions: {
      sass: {
        implementation: require("sass"),
      },
    },
  },
};

const { defineConfig } = require("@vue/cli-service");
const loader = require("sass-loader");
module.exports = defineConfig({
  transpileDependencies: true,
});
