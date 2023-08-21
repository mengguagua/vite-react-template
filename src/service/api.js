// 全局拦截器，全局方法等逻辑
import axios from 'axios';
import { message } from 'antd';
// 修改全局状态-loading
import store from '../store/store';
// 通过loading防止重复点击
import { openLoading, closeLoading } from '../store/loadingSlice'

// request请求拦截处理
axios.interceptors.request.use(
  config => {
    store.dispatch(openLoading());
    if (config.method === 'get') {
      config.params = Object.assign({ t: Date.now() }, config.params);
    }
    config.headers = {
      'X-Requested-With': 'XMLHttpRequest',
      'redirectUrl': location.href
    };
    return config;
  },
  error => {
    store.dispatch(closeLoading());
    return Promise.reject(error)
  }
);

// response响应拦截处理
axios.interceptors.response.use(
  res => {
    // debugger
    store.dispatch(closeLoading());
    // 没登录，跳转登录
    if (res.headers['permission-status'] && Number(res.headers['permission-status']) == 1) {
      // window.location.href = res.headers['redirect-url'];
      // return Promise.reject(res.data);
    }
    // 没接口权限
    if (res.headers['permission-status'] && Number(res.headers['permission-status']) == 2) {
      message.warning('无操作权限', 5);
      return Promise.reject(res.data);
    }
    // 文件下载统一处理
    if (res.config.method == 'get' && res.config.params.isBlobRequest) {
      if (res.data.type === 'application/json') {
        // 如果返回的是json格式，说明导出接口报错，将blob数据转为json数据，读取并提示报错信息
        let reader = new FileReader()
        reader.readAsText(res.data, 'utf-8')
        reader.onload = (e) => {
          res.data = JSON.parse(reader.result)
          message.error(res.data.message || '文件下载出错', 5);
        }
        return Promise.reject()
      }
      const fileName = decodeURIComponent(res.headers['content-disposition'].split(';')[1].split('=')[1].split('"').join(''))
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      link.remove()
      return res.data
    }
    // 请求成功，但是操作不成功时显示后端返回的错误信息
    if (res.data.status != '0') {
      let errorMessage = res.data.message;
      if (errorMessage?.length > 60) { // 限制报错提示长度
        errorMessage = res.data.message.slice(0,58) + '...'
        console.log('ERROR：', res.data.message)
      }
      message.error(errorMessage || '网络拥堵，稍后再试', 5);
      return Promise.reject(res.data);
    }
    return res.data;
  },
  err => {
    // debugger
    message.error('网络拥堵，稍后再试', 5);
    store.dispatch(closeLoading());
    return Promise.reject(err);
  }
);

export default axios;
