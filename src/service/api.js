// 全局拦截器，全局方法等逻辑
import axios from 'axios';
import { message } from 'antd';

// request请求拦截处理
axios.interceptors.request.use(
  config => {
    if (config.method === 'get') {
      config.params = Object.assign({ t: Date.now() }, config.params);
    }
    config.headers = {
      'X-Requested-With': 'XMLHttpRequest',
      'redirectUrl': location.href
    };
    return config;
  },
  error => Promise.reject(error)
);

// response响应拦截处理
axios.interceptors.response.use(
  res => {
    // 没登录，跳转登录
    if (res.headers['permission-status'] && Number(res.headers['permission-status']) > 0) {
      // window.location.href = res.headers['redirect-url'];
      // return;
    }
    // 请求成功，但是操作不成功时显示后端返回的错误信息
    if (res.data.status != '0') {
      message.error(res.data.message || '网络拥堵，稍后再试', 5);
      return Promise.reject(res.data);
    }
    return res.data;
  },
  err => {
    message.error('网络拥堵，稍后再试', 5);
    return Promise.reject(err);
  }
);

export default axios;
