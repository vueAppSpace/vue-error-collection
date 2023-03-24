/*
 * @Description: 文件上传api
 * @Author: IFLS
 * @Date: 2022-06-22 13:43:31
 * @LastEditTime: 2023-03-23 17:45:31
 */
import axios from "@/config/axios";
import { users, xinao } from "@/config/env";

// 上传图片
export const uploadPic = data => axios(`${users}/file/uploadAndGet`, data, "post", "", true);

// 上传文件
export const uploadFile = data => axios(`${users}/file/uploadAndGetByPDF`, data, "post", "", true);

// 添加历史档案
export const addReport = data => axios(`${xinao}/healthhistoricalarchives/insert`, data, "post");

// 修改历史档案
export const updateReport = data => axios(`${xinao}/healthhistoricalarchives/update`, data, "post");

// 查询历史档案
export const queryReport = data => {
  data && (data.orderBy = "archives_date");
  return axios(`${xinao}/healthhistoricalarchives/page`, data, "post");
};
