import {Menu} from "antd";
import './menu.css';
import {useNavigate} from "react-router-dom";
import {menuList} from '../../service/interface';

const menus = [
  {
    key: 'oilUserInfoManager',
    label: '用户信息管理',
  },
  {
    key: 'isCard',
    label: '一级菜单',
    children: [
      {
        key: 'mainCard',
        label: '二级菜单',
      }, {
        key: 'subCard',
        label: '二级菜单',
      },
    ],
  },
];

// 三级菜单以及之内
let getMenuLabel = (keyPath) => {
  let len = keyPath.length;
  let result = '';
  if (len === 1) {
    let menu = menus.filter((item) => {
      return item.key === keyPath[0];
    });
    result = menu[0].label;
  } else if (len === 2) {
    menus.forEach((item) => {
      if (item.children && item.children.length) {
        let menu = item.children.filter((ret) => {
          return ret.key === keyPath[0];
        });
        if (menu[0]?.label) {
          result = menu[0]?.label;
        }
      }
    });
  } else if (len === 3) {
    menus.forEach((item) => {
      if (item.children && item.children.length) {
        item.children.forEach((ret) => {
          if (ret.children && ret.children.length) {
            let menu = ret.children.filter((resp) => {
              return resp.key === keyPath[0];
            });
            if (menu[0]?.label) {
              result = menu[0]?.label;
            }
          }
        });
      }
    });
  } else {
    result = 'newTab';
  }
  return result;
};

let LeftMenu = ({keys, setKeys, activeKey, setActiveKey, tabItems, setTabItems}) => {
  // 使用前端的静态菜单就注释下面两行
  // let [menus, setMenus] = useState([]);
  // useEffect(() => { queryMenu(); }, []);

  const navigate = useNavigate();
  const onClick = ({item, key, keyPath, domEvent}) => {
    console.log('item ', item);
    // console.log('key ', key);
    // console.log('keyPath ', keyPath);
    let label = getMenuLabel(keyPath);
    // console.log('label ', label);
    if (!keys.includes(key)) {
      setTabItems([
        ...tabItems,
        {
          label: label,
          key: key,
        }
      ]);
      setKeys([...keys, key])
    }
    setActiveKey(key);
    navigate(key);
  };

  let deleteEmptyChildren = (arr) => {
    return arr.map(item => {
      if (item.children.length > 0) {
        deleteEmptyChildren(item.children)
      } else {
        delete item.children
      }
      return item;
    })
  }
  // 默认调用接口
  let queryMenu = () => {
    menuList().then((resp) => {
      let menu = deleteEmptyChildren(resp?.data);
      // 使用前端的静态菜单就注释下面一行
      // setMenus(menu)
    });
  };
  return (
    <div className={'left'}>
      <Menu
        onClick={onClick}
        style={{
          width: 255,
        }}
        defaultSelectedKeys={[activeKey]}
        defaultOpenKeys={[activeKey]}
        mode="inline"
        items={menus}
      />
    </div>
  );
}

export default LeftMenu;
