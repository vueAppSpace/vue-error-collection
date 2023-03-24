/*
 * @Description: 自提信息
 * @Author: IFLS
 * @Date: 2023-02-08 11:44:47
 * @LastEditTime: 2023-03-23 17:37:17
 */

export const selfLiftingInfoFn = data => {
  return [
    {
      title: "自提地点",
      content: data.selfReceiveAddress
    },
    {
      title: "自提时间",
      content: data.selfReceiveTime
    },
    {
      title: "咨询电话",
      content: data.selfReceivePhone
    }
  ];
};

export const receiveInfoFn = data => {
  return [
    {
      title: "收货人",
      content: data.receiveName
    },
    {
      title: "联系电话",
      content: data.receivePhone
    },
    {
      title: "收货地址",
      content: data.receiveAddress
    }
  ];
};

export const expressInfoFn = data => {
  return [
    {
      title: "物流公司",
      content: data.logisticsCompanyName,
      blue: true
    },
    {
      title: "物流单号",
      content: data.logisticsNo,
      blue: true
    }
  ];
};

export const titleInfoFn = status => {
  const val = new Map([
    ["1", ["", "", "领取"]], // 待领取
    ["3", ["查看物流", "请耐心等待，暂未发货", ""]], // 待发货
    ["4", ["查看物流", "请耐心等待，正在快马加鞭", "收到"]], // 已发货
    ["5", ["等待自提", "自提前请电话联系，确保奖品已备好", "领取"]] // 待自提
  ]);
  return val.get(status) || [];
};
