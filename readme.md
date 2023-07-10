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
### 添加页面操作顺序
1、pages里新建带业务名称的文件夹A，在文件夹内新建index.jsx
2、src/routes/router.jsx 文件内引入index.jsx，且声明路由
3、src/routes/menu/menu.jsx 文件内声明新页面的菜单(若调用接口，则在数据库内添加)
### 其它注意
- useState() 属于异步函数, setState()后值不会立刻变化。
- key和path要一致且唯一。
    说明：navigate(key): 菜单跳转通过api实现，key对应的是src/routes/router.jsx的`path`和src/routes/menu/menu.jsx的`key`。这两个值一致就可以，若二三级菜单，和前缀路径无关。
- react没有scoped，样式会相互影响。可选方案是css module和css in js。但实际都不好用。为了避免样式冲突，我们认为约定：
    1、公共样式+组件覆盖样式都统一在src/routes/root.css
    2、jsx样式在同目录的index.css内写，以`业务文件夹名-css样式名`规则命名。(业务文件夹名不可重复的)
- React.StrictMode会有意地双调用，所以会看见接口调用了两次。（严格模式检查只在开发模式下运行，不会与生产模式冲突）
- 可以在main.jsx的ConfigProvider里定制主题颜色
- jsx里引用的组件一定要首字母大写
- antDesign form表单特殊要求：https://ant.design/components/form-cn
    例如：注意 initialValues 不能被 setState 动态更新，你需要用 setFieldsValue 来更新
- 冷知识：空值合并操作符：??
  是一个逻辑操作符，当左侧的操作数为 null 或者 undefined 时，返回其右侧操作数，否则返回左侧操作数。
- 冷知识：可选链接运算符：?. （ES2020语法）
  data?.children?.[0]?.title; 等价于 if (data && data.children && data.children[0] && data.children[0].title){}
  判断左侧对象不是null 或者 undefined就去取下一个属性
- 查询栏，RangePicker数据怎么清除？RangePicker增加一个key属性，在点'重制'按钮后给key设置个new Date().getTime()，这样组件就会重置。
### 其它约定
> 以 `src/pages/oilUserVirtuallyManager/index.jsx` 为例子
- 默认进页面要执行的方法，写在`return` html上面和业务代码下面。
- jsx里有Modal等不用遵守html顺序的，一律写jsx标签内的最下面。
- Modal弹框默认宽度640，一行两列，下拉和input默认180px
- jsx的类html代码写文件最下方
- 组件上方写明组件中文名字
- 表格类型默认size="small"
- 查询栏都使用'search-module'统一样式
- 组件命名，业务组件在pages下以文件夹命名，jsx用index命名。公共组件用组件名命名如header；文件小写，但代码里import名字大写开头。
- 取名要求，英文单词，且望文生义(图片名称可加数字区分)。其它如shouye，index2，TABLE，等取名都不允许

### 常见警告和报错
1、react.development.js:209 Warning: Each child in a list should have a unique "key" prop.
- 这是 antd Table 组件需要给一个rowKey，作为每一行的唯一标识。取接口返回的一个唯一值就行，一般是id
