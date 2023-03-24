/*
 * @Description: 正则
 * @Author: IFLS
 * @Date: 2021-09-18 15:58:28
 * @LastEditTime: 2023-03-23 17:46:41
 */

export default {
  mobile: function (val) {
    // 手机号
    const reg = /^1[0-9]{10}$/;
    return reg.test(val);
  },
  email: function (val) {
    // 邮箱
    const reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    return reg.test(val);
  },
  money: function (val) {
    // 金额，最多两位小数
    const reg = /^([0-9]*)+(.[0-9]{1,2})?$/;
    return reg.test(val);
  },
  number: function (val) {
    // 整数数字
    const reg = /^[0-9]*$/;
    return reg.test(val);
  },
  date: function (val) {
    // 日期yyyy-MM-dd
    const reg = /^\d{4}-\d{1,2}-\d{1,2}/;
    return reg.test(val);
  },
  telephone: function (val) {
    // 国内电话
    const reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
    return reg.test(val);
  },
  zipcode: function (val) {
    // 邮编
    const reg = /[1-9]\d{5}(?!\d)/;
    return reg.test(val);
  },
  idCard: function (val) {
    // 身份证
    const reg =
      /^[1-9]\d{5}(18|19|2([0-9]))\d{2}((01|0[3-9]|10|11|12)((0([1-9])|([1-2][0-9])|30|31))|((02)(0([1-9])|([1-2][0-9]))))\d{3}[0-9Xx]$/;
    return reg.test(val);
  },
  characters: function (val) {
    // 汉字
    const reg = /^[u4e00-u9fa5],{0,}$/;
    return reg.test(val);
  },
  tel: function (val) {
    // 手机号和座机
    const reg =
      /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/;
    return reg.test(val);
  },
  intPositive: function (val) {
    // 正整数，大于0的整数
    const reg = /^[1-9]\d*$/;
    return reg.test(val);
  },
  name: function (val) {
    // 姓名（中文+英文）
    const reg = /^[\u4e00-\u9fa5_a-zA-Z]+$/;
    return reg.test(val);
  },
  normal: function (val) {
    // 常规（中、英、数字）
    const reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
    return reg.test(val);
  },
  userName: function (val) {
    // 只能输入英文、数字、下划线，减号
    const reg = /^[a-zA-Z0-9_-]{4,16}$/;
    return reg.test(val);
  },
  password: function (val) {
    // 只能输入6至18位英文、数字、!、@#$^'
    const reg = /^[0-9a-zA-Z!@#$^]{6,20}$/;
    return reg.test(val);
  },
  bankCard: function (val) {
    // 银行卡号
    const reg = /^[0-9]{16,19}$/;
    return reg.test(val);
  },
  link: function (val) {
    // 链接地址
    const reg = /(http|https):\/\/([\w.]+\/?)\S*/;
    return reg.test(val);
  }
};
