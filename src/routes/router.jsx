// 路由配置
import React from 'react';
// 路由官网：https://reactrouter.com/en/main/start/tutorial
import {createBrowserRouter} from 'react-router-dom';
// 路由的根页面和错误页面
import Root from './root';
import ErrorPage from "../errorPage";

import DriverCard from '../pages/driverCard/index';
import DriverCardDetail from '../pages/driverCard/detail';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "driverCard",
        element: <DriverCard />,
      }, {
        path: "driverCardDetail",
        element: <DriverCardDetail />,
      }, {
        path: "driverCard2",
        element: <DriverCard />,
      },
    ],
  },
]);
export default router;
