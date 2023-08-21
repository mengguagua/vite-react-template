// 路由配置
import React from 'react';
// 路由官网：https://reactrouter.com/en/main/start/tutorial
import {createBrowserRouter} from 'react-router-dom';
// 路由的根页面和错误页面
import Root from './root';
import ErrorPage from "../errorPage";
import OilUserInfoManager from '../pages/oilUserInfoManager/index'

const router = createBrowserRouter([
  {
    path: "/ath-oil/",
    element: <Root/>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "oilUserInfoManager",
        element: <OilUserInfoManager />,
      },
    ],
  },
]);
export default router;
