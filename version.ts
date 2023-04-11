/*
 * @Description: 版本打标
 * @Author: WANGCHENGAE
 * @Date: 2022-12-2 18:00:30
 * @LastEditTime: 2023-03-24 11:54:42
 */
import dayjs from "dayjs";
import { execSync } from "child_process";

const checkEnv = (env: Partial<ImportMetaEnv>) => {
  try {
    const branch = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
    const commit = execSync("git show --format=%h --no-patch").toString().trim();
    const author = execSync("git show --format=%cn --no-patch").toString().trim();
    const email = execSync("git show --format=%ce --no-patch").toString().trim();
    const message = execSync("git show --format=%s --no-patch").toString().trim();
    const cDateStr = execSync("git show --format=%ci --no-patch").toString().trim();
    const date = cDateStr.split(/\s+/).splice(0, 2).join(" ");
    const timeStamp = new Date(cDateStr).getTime();
    const node_version = execSync("node -v").toString().trim();
    const lkProject = {
      ENV: env,
      BUILD_TIME: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      NODE_VERSION: "nodeJS_" + node_version,
      VERSION: {
        branch,
        commit,
        message,
        author,
        email,
        date,
        timeStamp
      }
    };
    //console.log("LK_PROJECT", lkProject);
    return lkProject;
  } catch {
    // if there is no git repository will be cause error
    return {};
  }
};

export default checkEnv;
