/*
 * @Description: 保存成功后返回上级页面
 * @Author: IFLS
 * @Date: 2022-06-24 16:03:44
 * @LastEditTime: 2023-03-23 17:33:14
 */
import { Toast } from "vant";

export default function (router) {
  const toastAndGoback = (text = "保存成功") => {
    return new Promise(resolve => {
      Toast({
        type: "success",
        message: text,
        forbidClick: true,
        onClose: () => {
          router && router.go(-1);
          resolve();
        }
      });
    });
  };
  return {
    toastAndGoback
  };
}
