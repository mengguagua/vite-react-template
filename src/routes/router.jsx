// 路由配置
import React from "react";
// 路由官网：https://reactrouter.com/en/main/start/tutorial
import {createBrowserRouter} from "react-router-dom";
// 路由的根页面和错误页面
import Root from "./root";
import ErrorPage from "../errorPage";
import OilUserVirtuallyManager from '../pages/oilUserVirtuallyManager/index'
import Table from "../pages/table/table";
import Table2 from "../pages/table2/table2";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "oilUserVirtuallyManager",
        element: <OilUserVirtuallyManager />,
      }, {
        path: "table",
        element: <Table />,
      }, {
        path: "table2",
        element: <Table2 />,
      },
    ],
  },
]);
export default router;
