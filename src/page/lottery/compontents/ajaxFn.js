/*
 * @Description: 更新奖品状态
 * @Author: IFLS
 * @Date: 2023-02-09 14:15:38
 * @LastEditTime: 2023-03-23 17:37:14
 */
import { updateLottery, lotteryDetail } from "@/service/lottery";
import * as info from "./data";
import { Toast } from "vant";

// 更新奖品状态
export const updateStatus = req => {
  return new Promise(async (resolve, reject) => {
    try {
      const { code, message } = await updateLottery(req);
      if (code === 0) {
        resolve();
      } else {
        console.log("updateLottery", message);
        Toast(message);
        reject(err);
      }
    } catch (err) {
      console.log("updateLottery-err", err);
      Toast("操作异常, 请重试");
      reject(err);
    }
  });
};

// 查询奖品详情
export const queryDetail = async (id, status, type) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { code, data, message } = await lotteryDetail(id);
      if (code === 0) {
        // 虚拟奖品或等待自提奖品
        if (type === "2" || status === "5") {
          const selfLiftingInfo = info.selfLiftingInfoFn(data);
          resolve([selfLiftingInfo, data]);
          return;
        }
        let detailInfo = info.receiveInfoFn(data);
        // 已发货
        if (status === "4") {
          const expressInfo = info.expressInfoFn(data);
          detailInfo = [...detailInfo, ...expressInfo];
        }

        resolve([detailInfo, data]);
      } else {
        console.log("lotteryDetail", message);
        reject(err);
      }
    } catch (err) {
      console.log("lotteryDetail-err", err);
      reject(err);
    }
  });
};
