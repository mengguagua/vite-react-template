// 业务接口都写在interface这个文件内
import axios from './api';

// 系统公共接口
// 查询菜单
export function menuList(req) {
  return axios.get(`/ath-oil-web/uct/menuList`, {params: req});
}
// 登出
export function uctLogout(req) {
  return axios.get(`/ath-oil-web/uct/logout`, {params: req});
}
// 文件导出接口方法
export function exportFiles(url, req) {
  return axios.get(url, {params: {...req, isBlobRequest: true}, responseType: 'blob'});
}
// 查询图片前缀
export function oilFileInfoUrlPrefix(req) {
  return axios.get(`/ath-oil-web/oilFileInfo/urlPrefix`, {params: req});
}
// 上传文件
export function oilFileInfoUpload(req) {
  return axios.post(`/ath-oil-web/oilFileInfo/upload`, req, {headers: {'Content-Type': 'multipart/form-data'}});
}

// 用户信息管理
// 查询公司下拉
export function getOilCompanyName(req) {
  return axios.get(`/ath-oil-web/oilCompanyCardInfo/getOilCompanyName`, {params: req});
}
// 查询
export function oilUserPageList(req) {
  return axios.post(`/ath-oil-web/oilUserCompanyInfo/page`, req);
}
// 新增/修改
export function oilUserCompanyInfoAddEdit(req) {
  return axios.post(`/ath-oil-web/oilUserCompanyInfo/customerInput`, req);
}
// 新增主账户
export function xmCustomerInput(req) {
  return axios.post(`/ath-oil-web/oilUserCompanyInfo/xmCustomerInput`, req);
}
// 查询详情
export function getUserCompanyById(req) {
  return axios.get(`/ath-oil-web/oilUserCompanyInfo/getUserCompanyById`, {params: req});
}
// 指派人员
export function assignedPersonnel(req) {
  return axios.get(`/ath-oil-web/oilUserCompanyInfo/assignedPersonnel`, {params: req});
}
// 获取商务经理
export function getSalesStaff(req) {
  return axios.get(`/ath-oil-web/oilUserCompanyInfo/getSalesStaff`, {params: req});
}
// 模糊查询
export function oilServiceConfigPage(req) {
  return axios.post(`/ath-oil-web/oilServiceConfig/page`, req);
}
