## vite-react
### 技术工具
- react-router-dom：https://reactrouter.com/en/main/start/tutorial
- ant-design：https://ant.design/components/table-cn#components-table-demo-basic
### 目录说明
- index.html: 单页面文件，引入main.jsx
- main.jsx: 程序入口，引入了antd和router配置
- router.jsx: 路由配置文件
- root.jsx: 布局文件，处理头部，菜单，tab页签，右侧内容
- root.css 布局样式，公共样式内容。
> 其它页面开发，如查询栏等，公共内容，不提取组件，通过公共样式实现样式统一
- errorPage：router报错时候的跳转页面
- pages文件夹：业务组件
### 其它约定
- 表格类型默认size="small"
- 查询栏都使用'search-module'统一样式
- 可以在main.jsx的ConfigProvider里定制主题颜色
- 组件命名，业务组件在pages下以文件夹命名，jsx用index命名。公共组件用组件名命名如header；文件小写，但代码里import名字大写开头。
- 取名要求，英文单词，且望文生义(图片名称可加数字区分)。其它如shouye，index2，TABLE，等取名都不允许
