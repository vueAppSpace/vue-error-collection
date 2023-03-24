/*
 * @Description: 计算属性
 * @Author: IFLS
 * @Date: 2022-06-17 21:14:53
 * @LastEditTime: 2023-03-23 17:41:36
 */
import { computed } from "@vue/composition-api";
import { formatDate } from "@/utils/commonFun";

export default function (state) {
  const formateTime = computed(() => {
    return (type, val) => {
      const T = {
        year: `${val}年`,
        month: `${val}月`,
        day: `${val}日`
      };
      return T[type];
    };
  });

  const formatBirth = computed(() => {
    const { lk1589863443528: memberBirth } = state.userInfo;
    if (!memberBirth) return "请选择您的出生日期";
    if (typeof memberBirth === "object") {
      return formatDate(memberBirth);
    } else {
      return memberBirth;
    }
  });

  const formatHigh = computed(() => {
    const { XYZBXY001013: high } = state.userInfo;
    if (!high) return "请选择您的身高";
    return `${high}cm`;
  });

  const formatWeight = computed(() => {
    const { XYZBXY001007: weight } = state.userInfo;
    if (!weight) return "请选择您的体重";
    return `${weight}kg`;
  });

  return {
    formateTime,
    formatBirth,
    formatHigh,
    formatWeight
  };
}
