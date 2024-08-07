import JSEncrypt from "node-jsencrypt";
import md5 from "md5";
import axios from "axios";

const publicKey =
  "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCidgwAP4UvGfZG2TAfS7ookIj/zltg0t3zwgq8qIws7veg8aN4kU8E4Xc+KKefeJ7zcFp5G9Y4s0V7uhgKaZCzotPbqwnNj24qoNQfLkUXfwZSIGEsRFEP1to5b8eFo5IQu8OEt8w4Tz4TgZaXyoLPoMLQYLoud07VlxewrfZdvQIDAQAB";
// uat环境
// 默认用户名：17631807110  密码：Zhaoce@0206
// const userName = "17631807110";
// const password = "Zhaoce@0206";
// dev环境
// const userName = "10104801"; // 李俊宏
// const password = "1a@12345";
const userName = "15510293800";
const password = "1a@12345";

function encrypt(txt: any): string {
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(publicKey); // 设置公钥
  return encryptor.encrypt(txt); // 对需要加密的数据进行加密
}

export async function getEmallInfo(): Promise<string> {
  try {
    const grantCode = await getGrantCode();
    const authTenantId = await getTenantId(grantCode);

    return `grantCode=${grantCode}&authTenantId=${authTenantId}`;
  } catch (err) {
    //console.log(`获取 e商服登录信息 失败: ${err}`);
  }
}

function getGrantCode() {
  const time = Date.now();
  const passwordValue = encrypt(password);
  const md5Value = md5(password + time);

  const reqConfig = {
    // url: "https://authentication-center-2.uat.ennew.com/userCenter/unify/auth/login",
    url: "https://authentication-center.dev.ennew.com/userCenter/unify/auth/login",
    data: {
      userName,
      password: passwordValue,
      time,
      md5: md5Value,
      type: userName.length === 8 ? "ldap" : "userCenter", // 工号对应ldap类型 手机号对应userCenter类型
      appId: "e-business-service",
      terminalType: "APP",
      rememberMe: false,
      needCheckSecond: false
    },
    then(res, resolve, reject) {
      const { data, success, message } = res;
      if (success) {
        resolve(data.ennUnifiedGrantCodeCookie.value);
      } else {
        reject(message);
      }
    }
  };

  return post(reqConfig);
}

function getTenantId(ennUnifiedGrantCode) {
  const reqConfig = {
    // url: "https://authentication-center-2.uat.ennew.com/userCenter/unify/auth/pageAppUserTenantIds",
    url: "https://authentication-center.dev.ennew.com/userCenter/unify/auth/pageAppUserTenantIds",
    data: {
      appId: "e-business-service",
      tenantName: "",
      pageNum: 1,
      pageSize: 10
    },
    config: {
      headers: {
        ennUnifiedGrantCode
      }
    },
    then(res, resolve, reject) {
      const { lastTenantId, success, message } = res;
      if (success) {
        resolve(lastTenantId);
      } else {
        reject(message);
      }
    }
  };

  return post(reqConfig);
}

function post(reqConfig) {
  const { url, data = {}, config = {}, then } = reqConfig;
  return new Promise((resolve, reject) => {
    axios
      .post(url, data, config)
      .then(({ data }) => then(data, resolve, reject))
      .catch(err => reject(err));
  });
}
