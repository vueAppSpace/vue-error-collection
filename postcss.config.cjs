const autoprefixer = require("autoprefixer");
const pxtorem = require("postcss-pxtorem");

module.exports = {
  plugins: [
    autoprefixer(),
    pxtorem({
      // rootValue({ file }) {
      //   return file.indexOf('node_modules/vant') !== -1 ? 37.5 : 45
      // },
      rootValue: 100,
      unitPrecision: 5,
      propList: ["*"],
      selectorBlackList: [".ignore", "keep-px"], // 排除选择器
      propBlackList: ["border"], // 属性黑名单
      exclude: [/node_module|utils/], // 排除目录
      minPixelValue: 1,
      mediaQuery: false
    })
  ]
};
