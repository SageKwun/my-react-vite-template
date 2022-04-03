module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "prettier", // 添加`prettier`拓展 用于和`prettier`冲突时覆盖`eslint`规则
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    "react/jsx-filename-extension": [2, { extensions: [".jsx", ".tsx"] }],
    "no-use-before-define": 1,
    "react/react-in-jsx-scope": 0,
  },
};
