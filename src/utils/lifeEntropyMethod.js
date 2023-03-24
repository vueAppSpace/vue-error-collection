/*
 * @Description: 跳转到大脑预处理函数(中间需要先调生命熵，问卷等相关逻辑)
 * @Author: WANGCHENGAE
 * @Date: 2022-12-19 11:00:30
 * @LastEditTime: 2023-03-23 17:46:21
 */
import { isEntropy } from "@/utils/permissions";
import jumpToDanao from "@/utils/jumpToDanao";
import { setStorage, getStorage, removeStorage } from "@/utils/myStorage";
import { JUMP_REPORT_DATA } from "@/constants/commonConst";
import useQuestions from "@/hooks/useQuestions";
import useEntropy from "@/page/meals/components/useEntropy";
import { Toast } from "vant";

//问卷页面(答题完成) "生命熵逻辑处理"
//如果当前问卷是从点击"三济健康报告 "三济健康档案"导航过来的 jumpReportData一定存在
export function evaluatePageMethodForLifeEntropy() {
  const jumpReportData = getStorage(JUMP_REPORT_DATA);
  if (jumpReportData) {
    jumpReportData.fullfilled = true;
    setStorage(JUMP_REPORT_DATA, jumpReportData);
  }
}

//判断是否需要跳转到大脑
export function judgeNeedToJumpToDanao() {
  const { type, code, fullfilled } = getStorage(JUMP_REPORT_DATA) || {};
  if (fullfilled) {
    resetJumpReportData();
    jumpToDanaoInner(type, code);
  }
}

//“首页”，“我的”：页面点击"三济健康报告" "三济健康档案" 按钮得处理方法
export async function jumpToDanaoPretreat(type, code, router) {
  //1.当前用户是生命熵测试用户
  if (isEntropy()) {
    //1.1.先调生命熵看是否存在
    const toast = Toast.loading({
      duration: 0,
      forbidClick: true
    });
    const { status } = await useEntropy();
    if (status === 200) {
      toast.clear();

      //1.2.存在生命熵直接跳转大脑
      jumpToDanaoInner(type, code);
    } else {
      //1.3 不存在，导航到问卷
      //1.3.1 查询问卷是否存在
      const { queryQuestions } = useQuestions();
      const { status: status1, seqNo, inquiryNo } = await queryQuestions();
      if (status1 === 1) {
        toast.clear();

        //1.4 存在问卷导航到问卷(forEntropy 告知“问卷页”，此次是为了生命熵测试)
        router.push({
          path: "/evaluate",
          query: { seqNo, inquiryNo, forEntropy: true }
        });

        //1.5 暂存(导航到大脑的跳转参数 type code) 数据
        setStorage(JUMP_REPORT_DATA, {
          type,
          code,
          fullfilled: false //问卷是否答完
        });
      } else {
        toast.clear();
        Toast("未获取到生命熵题目, 请重试");
      }
    }
  } else {
    //2.不是生命熵测试用户，直接跳转大脑
    jumpToDanaoInner(type, code);
  }
}

export function resetJumpReportData() {
  removeStorage(JUMP_REPORT_DATA);
}

function jumpToDanaoInner(type, code) {
  jumpToDanao(type, code, `&display=${isEntropy()}`);
}
