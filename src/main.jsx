import React from 'react'
import ReactDOM from 'react-dom/client'
// 路由官网：https://reactrouter.com/en/main/start/tutorial
import { RouterProvider, } from 'react-router-dom';
import { ConfigProvider } from 'antd';
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import zhCN from 'antd/locale/zh_CN';
import 'antd/dist/reset.css';
// 全局样式
import './index.css'
// 路由配置文件
import router from './routes/router';

dayjs.locale('zh-cn');
ReactDOM.createRoot(document.getElementById('root')).render(
  // React.StrictMode说明：https://blog.csdn.net/yuey0809/article/details/126177570
  <React.StrictMode>
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#f09c39',
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  </React.StrictMode>,
)
