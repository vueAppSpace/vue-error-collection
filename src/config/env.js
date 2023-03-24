import { showVconsole, loadVconsole } from "@/utils/vconsoleUtil";

const environment = process.env.VITE_ENV;
let platform = process.env.VITE_APP_API_URL;

// 为icome提供环境key
const DEFAULT_ENV_KEY = "__APP_ENV__";

// 第三方接入链接
if (environment.includes(["emallpro", "icomepro"])) {
  // 生产环境
  window[DEFAULT_ENV_KEY] = "product";
  var hUrl = "https://c.op.laikang.com/platform/";
  var healthBookingUrl = "https://mirror.laikang.com/lktoolsh5/icome-healthy/icome-healthy.html#/examine"; // 体检预约
  // 点餐宝地址
  var orderLunchUrl = "https://icome-dingtalk-h5.ennew.com/transit?redirect_uri=";
  var dianCanUrl = "https://imeal-h5.ennew.com/mealDetail";
  //  大脑问卷评估
  var danaoQuestionUrl = "https://lk-m-questionnaire-pro.op.laikang.com/#/cover";
  //  大脑智能问诊（高血压）
  var danaoConsulationUrl = "https://m.laikang.com/pro/consultation/#/question";
  //  大脑综合报告
  var danaoComprehensiveUrl = "https://m.laikang.com/pro/multipleReport/#";
  //  大脑健康档案
  var danaoHealthReport = "https://m.laikang.com/pro/healthRecordH5/#/report";
  //  健身房系统
  var sportGym = "https://gym-console-pro.op.laikang.com/customer/";
  // icome 头像挂件
  var pendantCenter = "https://h5.dingtalk.com/h5-pendant-center/index.html";
  // 大脑功法课程详情
  var gongfaUrl = "https://m.laikang.com/pro/sportsCours/#/gfdetails";
  var exerciseCourseDetail = "https://m.laikang.com/pro/sportsCours/#/personality";
  // 积分商城
  var eMall = "https://air.ennew.com/e-mall";
  // 大脑课程相关
  var sportsCours = "https://m.laikang.com/pro/sportsCours/#";
  //快快小程序-正式版id
  var kuaikuaiWeachtId = "gh_720b7a957143";
  //生产环境-加载vconsole不显示
  loadVconsole();
} else if (environment.includes(["icomeqa", "emallqa"])) {
  // 测试环境相关地址
  window[DEFAULT_ENV_KEY] = "pre";
  var hUrl = "https://c-qa.op.laikang.com/platform/";
  var healthBookingUrl = "https://mirror-test.v.laikang.com/lktoolsh5/icome-healthy/icome-healthy.html#/examine"; // 体检预约
  // 点餐宝地址
  var orderLunchUrl = "https://icome-dingtalk-h5.uat.ennew.com/transit?redirect_uri=";
  var dianCanUrl = "https://imeal-h5.uat.ennew.com/mealDetail";
  //  大脑问卷评估
  var danaoQuestionUrl = "https://m.op.laikang.com/qa/Questionnaire/#/cover";
  //  大脑智能问诊（高血压）
  var danaoConsulationUrl = "https://m.laikang.com/qa/consultation/#/question";
  //  大脑综合报告
  var danaoComprehensiveUrl = "https://m.laikang.com/qa/multipleReport/#";
  //  大脑健康档案
  var danaoHealthReport = "https://m.laikang.com/qa/healthRecordH5/#/report";
  //  健身房系统
  var sportGym = "https://c-gym-qa.op.laikang.com/customer/";
  // icome 头像挂件
  var pendantCenter = "https://h5.dingtalk.com/h5-pendant-center/index.html";
  // 大脑功法课程详情
  var gongfaUrl = "https://m.laikang.com/qa/sportsCours/#/gfdetails";
  // 通用课程推荐详情
  var exerciseCourseDetail = "https://m.laikang.com/qa/sportsCours/#/personality";
  // 积分商城
  var eMall = "https://air.uat.ennew.com/e-mall";
  // 大脑课程相关
  var sportsCours = "https://m.laikang.com/qa/sportsCours/#";
  //快快小程序-测试版id
  var kuaikuaiWeachtId = "gh_ea6b88abd3b4";
  //测试环境-加载并立即显示vconsole
  showVconsole();
} else {
  // 开发环境相关地址
  window[DEFAULT_ENV_KEY] = "pre";
  platform = "https://cloud-qa.op.laikang.com/v1";
  var hUrl = "https://c-qa.op.laikang.com/platform/";
  var healthBookingUrl = "https://mirror-test.v.laikang.com/lktoolsh5/icome-healthy/icome-healthy.html#/examine"; // 体检预约
  // 点餐宝地址
  var orderLunchUrl = "https://icome-dingtalk-h5.uat.ennew.com/transit?redirect_uri=";
  var dianCanUrl = "https://imeal-h5.uat.ennew.com/mealDetail";
  //  大脑问卷评估
  var danaoQuestionUrl = "https://m.op.laikang.com/qa/Questionnaire/#/cover";
  //  大脑智能问诊（高血压）
  var danaoConsulationUrl = "https://m.laikang.com/qa/consultation/#/question";
  //  大脑综合报告
  var danaoComprehensiveUrl = "https://m.laikang.com/qa/multipleReport/#";
  //  健身房系统
  var sportGym = "https://c-gym-qa.op.laikang.com/customer/";
  //  大脑健康档案
  var danaoHealthReport = "https://m.laikang.com/qa/healthRecordH5/#/report";
  // icome 头像挂件
  var pendantCenter = "https://h5.dingtalk.com/h5-pendant-center/index.html";
  // 功法详情
  var gongfaUrl = "https://m.laikang.com/qa/sportsCours/#/gfdetails";
  // 通用推荐课程详情
  var exerciseCourseDetail = "https://m.laikang.com/qa/sportsCours/#/personality";
  // 积分商城
  var eMall = "https://air.uat.ennew.com/e-mall";
  // 大脑课程相关
  var sportsCours = "https://m.laikang.com/qa/sportsCours/#";
  //快快小程序-测试版id
  var kuaikuaiWeachtId = "gh_ea6b88abd3b4";
}

// 后台地址环境
const userUrl = platform + "/user";
const users = platform + "/user";
const configUrl = platform + "/config";
const healthUrlRecommend = platform + "/api/health";
const xinao = platform + "/xinaohealth";

// companyId
// const companyId = 240;

export const user = {
  // qa环境 测试账号
  loginType: 4,
  memberPwd: "123456",
  userName: "15045065864"
};

export {
  users,
  userUrl,
  platform,
  // companyId,
  configUrl,
  healthUrlRecommend,
  xinao,
  hUrl,
  healthBookingUrl,
  orderLunchUrl,
  danaoQuestionUrl,
  danaoComprehensiveUrl,
  danaoConsulationUrl,
  dianCanUrl,
  danaoHealthReport,
  sportGym,
  pendantCenter,
  gongfaUrl,
  exerciseCourseDetail,
  eMall,
  sportsCours,
  kuaikuaiWeachtId
};
