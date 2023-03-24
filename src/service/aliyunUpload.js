import axios from "../config/axios";
import { userUrl } from "../config/env";

// 获取视频上传凭证
export const createUploadVideo = data => axios(userUrl + "/aliyun/createUploadVideo", data, "post");

// 刷新凭证
export const refreshUploadVideo = data => axios(userUrl + "/aliyun/refreshUploadVideo", data, "post");

// 获取阿里云视频播放地址
export const getVideoUrl = data => axios(userUrl + "/aliyun/getVideoUrl", data, "post");
