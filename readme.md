## 管理后台-vite-react
### 技术工具
- react-router-dom：https://reactrouter.com/en/main/start/tutorial
- ant-design：https://ant.design/components/table-cn#components-table-demo-basic
### 目录说明
- public // 静态资源，如供下载的文件模板
- src // 主目录
  - hook // 自定义hook，抽象公共的代码
  - page // 业务页面
    - Index.jsx // 页面jsx代码
    - xxx.css // css文件，以业务文件夹命名，样式格式：业务文件夹名-样式名称
  - routes
    - header // 头部
    - menu // 左侧菜单
    - root // 总体布局
    - router // 路由配置
  - tools // 工具方法
  - service
    - api // 报错拦截、鉴权、文件流处理、防抖等全局处理逻辑
    - interface // 接口定义
  - store // redux全局state切片文件
    - store.js // 注册文件
    - xxxSlice.js // 切片对象逻辑
  - errorPage.jsx // 报错页面
  - index.css // 全局样式
  - main.jsx // 入口文件，导入各种配置如：路由、UI中文配置、redux、主题颜色
- index.html // 单页面入口
- package.json // 依赖配置
- readme.md // 项目注意事项
- vite.config.js // vite配置文件
> 其它页面开发，如查询栏等，公共内容，不提取组件，通过公共样式实现样式统一

### 添加页面操作顺序
1、pages里新建带业务名称的文件夹A，在文件夹内新建index.jsx
2、src/routes/router.jsx 文件内引入index.jsx，且声明路由
3、src/routes/menu/menu.jsx 文件内声明新页面的菜单(若调用接口，则在数据库内添加)
### 添加redux全局状态顺序
1、在src/store下新增一个xxxSlice.js的状态切片(可参考loadingSlice) // 命名规则xxx为state状态名字
2、在src/store/store.js添加reducer
3、获取state：可参考src/routes/root.jsx Spin组件
    ```jsx
    // 导入hook
    import { useSelector } from 'react-redux'
    // 组件内部获取全局加载状态
    let loadingType = useSelector(state => state.loading.value)
    ```
4、触发action修改state
    ```jsx
    // 导入触发hook
    import { useDispatch } from 'react-redux'
    // 导入redux切片的reducers
    import { openLoading, closeLoading } from '../store/loadingSlice'
    // 业务逻辑里触发action
    const dispatch = useDispatch()
    dispatch(openLoading())
    ```
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
    例如：注意 initialValues 不能被 setState 动态更新，你需要用 setFieldsValue 来更新。另外提供useWatch 允许你监听字段变化，同时仅当该字段变化时重新渲染
    可参考代码：src/pages/discountConfig/userDiscount/index.jsx
- 冷知识：空值合并操作符：??
  是一个逻辑操作符，当左侧的操作数为 null 或者 undefined 时，返回其右侧操作数，否则返回左侧操作数。
- 冷知识：可选链接运算符：?. （ES2020语法）
  data?.children?.[0]?.title; 等价于 if (data && data.children && data.children[0] && data.children[0].title){}
  判断左侧对象不是null 或者 undefined就去取下一个属性
- 查询栏，RangePicker数据怎么清除？RangePicker增加一个key属性，在点'重置'按钮后给key设置个new Date().getTime()，这样组件就会重置。
- antd的日期使用dayjs 所以日期反显要转化一下。 import * as dayjs from 'dayjs'; modalForm.setFieldsValue({...record, scoreTime: dayjs(record.scoreTime || new Date())});
- 假如有页面加载慢，可以使用退路方案（fallback），类似图片的预加载框效果。参考：https://zh-hans.react.dev/reference/react/Suspense
### 其它约定
> 以 `src/pages/oilUserVirtuallyManager/index.jsx` 为例子
- 默认进页面要执行的方法，写在`return` html上面和业务代码下面。如例子的 queryTable()
- jsx里有Modal等不用遵守html顺序的，一律写jsx标签内的最下面。如例子的<Modal>
- Modal弹框默认宽度640，一行两列，下拉和input默认180px
- jsx的类html代码写文件最下方
- 组件上方写明组件中文名字
- 表格类型默认size="small"
- 查询栏都使用'search-module'统一样式
- 组件命名，业务组件在pages下以文件夹命名，jsx用index命名。公共组件用组件名命名如header；文件小写，但代码里import名字大写开头。
- 取名要求，英文单词，且望文生义(图片名称可加数字区分)。其它如shouye，index2，TABLE，等取名都不允许
- 全局变量使用redux规则处理，具体处理逻辑使用Redux Toolkit封装一层的写法。要求阅读一下快速开始示例和redux原则
    > https://cn.redux.js.org/tutorials/quick-start // 加全局参数步骤
    > https://cn.redux.js.org/understanding/thinking-in-redux/three-principles
    > https://cn.redux.js.org/tutorials/essentials/part-1-overview-concepts // 刚写react再看下这个基础，有一些概念和约定
- 表单校验都使用正则,如下（建议使用chatGPT快速生成）
```jsx
<Form.Item label="证件号码"
   rules={[
     {
       pattern: /^\d{18}$/,
       message: '请输入18位数字'
     }
   ]}
   name="idNo">
<Input disabled={isDisabled} style={{ width: 500 }}/>
```
- 自定义hook，意思就是带react hook的普通js方法，特点是可以用来触发页面刷新。一些公共的逻辑可以封装进去，返回一个state。

### 常见警告和报错
1、react.development.js:209 Warning: Each child in a list should have a unique "key" prop.
- 这是 antd Table 组件需要给一个rowKey，作为每一行的唯一标识。取接口返回的一个唯一值就行，一般是id
2、加了上下文之后，测试环境访问次级路由出现404
- nginx修改配置: try_files $uri $uri/ /上下文地址/index.html;
3、升级时候菜单记得切换成调用接口，不要取本地
