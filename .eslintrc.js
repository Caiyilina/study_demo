module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/essential"],
  parserOptions: {
    parser: "@babel/eslint-parser",
    requireConfigFile: false,
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    quotes: ["error", "double"],
    semi: ["error", "always"],
    indent: ["error", 2],
    "vue/multi-word-component-names": "off", // 关闭此规则
    "vue/no-unused-components": "off",
    "vue/valid-v-bind": "off", // 新增这行
    "vue/valid-v-style": "off", // 新增这行
  },
};
