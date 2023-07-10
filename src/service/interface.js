// 业务接口都写在interface这个文件内
import axios from './api';

// 接口模块备注
// 查询post
export function oilVirtualQueryPageList(req) {
  return axios.post(`api-prefix/oilVirtualAccountInfo/queryPageList`, req);
}
// 查询get
export function masterBalanceInquiry(req) {
  return axios.get(`/api-prefix/oilVirtualAccountInfo/masterBalanceInquiry`, {params: req});
}
