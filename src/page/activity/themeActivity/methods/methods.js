/*
 * @Author: yanghaifengb yanghaifengb@enn.cn
 * @Date: 2022-07-04 15:48:31
 * @LastEditors: YanivWang
 * @LastEditTime: 2023-04-07 10:46:34
 * @FilePath: \lk-xinaohealth-h5\src\page\activity\themeActivity\methods\methods.js
 * @Description: 这是公用的方法，包括：点赞、取消点赞
 */
import { likeInsert, realDelete } from "@/service/activity";
export default function ({ props, state, $nextTick, $el, context, likeInsertCallBack, realDeleteCallBack }) {
  const userStore = JSON.parse(sessionStorage.getItem("userStore"));
  // 点赞
  const likeInsertFn = e => {
    let params = {
      likeType: state.likeType, //点赞
      likeId: e.id,
      memberCode: userStore.userInfo.memberCode,
      likeMemberCode: e.memberCode
    };
    likeInsert(params).then(({ code, data, message }) => {
      if (code === 0) {
        //console.log(context);
        likeInsertCallBack && likeInsertCallBack();
      } else {
        Toast(message);
      }
    });
  };

  // 取消点赞
  const realDeleteFn = e => {
    let params = {
      likeType: state.likeType,
      likeId: e.id,
      memberCode: userStore.userInfo.memberCode
    };
    realDelete(params).then(({ code, data, message }) => {
      if (code === 0) {
        realDeleteCallBack && realDeleteCallBack();
      } else {
        Toast(message);
      }
    });
  };

  return {
    likeInsertFn,
    realDeleteFn
  };
}
