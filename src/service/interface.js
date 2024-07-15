// 业务接口都写在interface这个文件内
import axios from './api';

// 查询菜单
export function menuList(req) {
  return axios.get(`/ath-oil-web/uct/menuList`, {params: req});
}
// 查询菜单
export function changePwd(req) {
  return axios.post(`/ath-oil-web/uct/changePwd`, req);
}
// 按钮权限
export function buttonList(req) {
  return axios.get(`/ath-oil-web/uct/buttonList`, {params: req});
}
// 查询用户信息
export function getUserInfo(req) {
  return axios.get(`/ath-oil-web/uct/getUserInfo`, {params: req});
}
// 登出
export function uctLogout(req) {
  return axios.get(`/ath-oil-web/uct/logout`, {params: req});
}
// 文件导出接口方法
export function exportFiles(url, req) {
  return axios.get(url, {params: {...req, isBlobRequest: true}, responseType: 'blob'});
}
// 查询操作日志
export function oilOperationLogQueryPages(req) {
  return axios.post(`/ath-oil-web/oilOperationLog/queryPages`, req);
}
// 查询油品类型
export function selectGetOilCodeList(req) {
  return axios.post(`/ath-oil-web/auto/select/getOilCodeList`, req);
}

// 下拉查询
export function oilUserCompanyInfoList(req) {
  return axios.post(`/ath-oil-web/oilUserCompanyInfo/list`, req);
}
// 查询石油公司
export function getOilCompanyName(req) {
  return axios.get(`/ath-oil-web/oilCompanyCardInfo/getOilCompanyName`, {params: req});
}
// 司机副卡管理
// 查询
export function oilCardInfoQueryPages(req) {
  return axios.post(`/ath-oil-web/oilCardInfo/queryPages`, req);
}
// 新增前查询信息，判断是否"开启"状态
export function cardSearch(req) {
  return axios.get(`/ath-oil-web/oilCardInfo/cardSearch`, {params: req});
}
// 新增
export function subcardGeneration(req) {
  return axios.post(`/ath-oil-web/oilCardInfo/subcardGeneration`, req);
}
// 修改
export function updateCardGeneration(req) {
  return axios.post(`/ath-oil-web/oilCardInfo/updateCardGeneration`, req);
}
// 实体卡解绑
export function oilCardInfoUnbind(req) {
  return axios.get(`/ath-oil-web/oilCardInfo/unbind`, {params: req});
}
// 修改启用/禁用
export function modifyCardRelation(req) {
  return axios.post(`/ath-oil-web/oilCardInfo/modifyCardRelation`, req);
}
// 导入
export function oilCardInfoImport(req) {
  return axios.post(`/ath-oil-web/oilCardInfo/import`, req, {headers: {'Content-Type': 'multipart/form-data'}});
}
// 关联车队
export function fleetAssociation(req) {
  return axios.get(`/ath-oil-web/oilCardInfo/fleetAssociation`, {params: req});
}
// 解除关联车队
export function fleetDisassociation(req) {
  return axios.get(`/ath-oil-web/oilCardInfo/fleetDisassociation`, {params: req});
}
// 根据石油公司名称获取副卡卡号
export function getViceNoByOilCompanyName(req) {
  return axios.get(`/ath-oil-web/oilCompanyCardInfo/getViceNoByOilCompanyName`, {params: req});
}
// 企业子车队
// 查询
export function oilUserFleetInfoPage(req) {
  return axios.post(`/ath-oil-web/oilUserFleetInfo/page`, req);
}

