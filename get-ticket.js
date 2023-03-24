/*
 * @Description:
 * @Author:
 * @Date: 2023-03-23 14:33:05
 * @LastEditTime: 2023-03-24 13:48:15
 */
import https from "https";
import os from "os";
import { exec } from "child_process";
const osEnv = os.type();
const isWebpack = process.env.npm_package_version; // 是否为webpack打包环境
const defaultLoginName = 10057859; //夏高飞 icome 工号
// 正式环境 获取 ticket 接口
// hostname = "icome-dingtalk-h5.ennew.com";
// path = "/icome/usercenter/getTicket";

async function getTicket(loginName = defaultLoginName) {
  const token = await getToken(loginName);

  const options = {
    protocol: "https:",
    hostname: "icome-front-zuul.uat.ennew.com",
    path: "/usercenter/getTicket",
    headers: {
      token
    }
  };

  let ticket;
  try {
    ticket = await new Promise((resolve, reject) => {
      const request = https.get(options, res => {
        let chunks = [];
        res.on("data", chunk => {
          chunks.push(chunk);
        });

        res.on("end", () => {
          const { code, message, data } = JSON.parse(String(Buffer.concat(chunks)));
          if (code === 200) {
            resolve(data.ticket);
          } else {
            reject(message);
          }
        });
      });

      request.on("error", e => {
        reject(e);
      });
    });
  } catch (error) {
    console.log(`get ${loginName} ticket error:`, error);
  }

  return ticket;
}

async function getToken(loginName) {
  const postData = JSON.stringify({
    loginName,
    password: "123"
  });

  const options = {
    protocol: "https:",
    hostname: "icome-front-zuul.uat.ennew.com",
    path: "/usercenter/debug/login",
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      "Content-Length": postData.length
    }
  };

  let token;
  try {
    token = await new Promise((resolve, reject) => {
      const request = https.request(options, res => {
        let chunks = "";
        res.on("data", chunk => {
          chunks += chunk;
        });
        res.on("end", () => {
          const { code, message, data } = JSON.parse(chunks);
          if (code === 200) {
            resolve(data.token);
          } else {
            reject(message);
          }
        });
      });

      request.write(postData);

      request.on("error", e => {
        reject(e);
      });
    });
  } catch (error) {
    console.log(`get ${loginName} token error:`, error);
  }

  return token;
}

export function getIPAddress() {
  const interfaces = os.networkInterfaces();
  let IPAddress = "";
  for (const devName in interfaces) {
    const iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (alias.family === "IPv4" && alias.address !== "127.0.0.1" && !alias.internal) {
        IPAddress = alias.address;
        break;
      }
    }
  }
  return IPAddress;
}

async function pasteTicketToClipboard() {
  const [, , loginName = defaultLoginName] = process.argv;
  const ticket = await getTicket(loginName);
  if (osEnv === "Darwin") {
    exec("pbcopy").stdin.end(ticket); // mac
  } else {
    exec("clip").stdin.end(ticket); // windows
  }
  console.log("\x1B[36mticket已复制到剪切板\x1B[0m");
}

!isWebpack && pasteTicketToClipboard();

export { getTicket };
