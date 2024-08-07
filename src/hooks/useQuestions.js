/*
 * @Description: 查询问题
 * @Author: IFLS
 * @Date: 2022-07-04 16:48:34
 * @LastEditTime: 2023-04-06 15:01:35
 */
// import { Toast } from "vant";
import { useUserStore, storeToRefs } from "@/pinia";
import { queryAndSaveAnswer } from "@/service/evaluate";

export default function (router) {
  const userStore = useUserStore();
  const { userInfo } = storeToRefs(userStore);

  const queryQuestions = () => {
    return new Promise((resolve, reject) => {
      const req = {
        phrId: userInfo.value.phrId,
        questionCode: "",
        optionsCode: [],
        optionNames: [],
        answer: "",
        seqNo: "",
        inquiryNo: ""
      };
      // 查询是否存在问卷
      queryAndSaveAnswer(req)
        .then(({ code, message, data }) => {
          if (code === 0) {
            if (data && data.nextQuestionResult) {
              const { seqNo } = data.nextQuestionResult;
              const { inquiryNo } = data;
              if (router) {
                return router.push({
                  path: "/evaluate",
                  query: { seqNo, inquiryNo }
                });
              }
              // 有题
              resolve({ status: 1, msg: null, seqNo, inquiryNo });
            } else {
              // 无题
              resolve({ status: 0, msg: null });
            }
          } else {
            // Toast(message);
            //console.log("queryAndSaveAnswer", message);
            reject({ status: -1, msg: "问卷查询失败" });
          }
        })
        .catch(err => {
          console.warn(err);
          reject({ status: -1, msg: "问卷查询失败" });
        });
    });
  };
  return {
    queryQuestions
  };
}
