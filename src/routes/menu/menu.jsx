import {Menu} from "antd";
import './menu.css';
import {AppstoreOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";

const menus = [
  {
    key: 'oilUserVirtuallyManager',
    label: '油品用户虚户管理',
  },
  {
    key: 'oilUserInfoManager',
    label: '油品用户信息管理',
  },
  {
    key: 'index1',
    icon: <AppstoreOutlined/>,
    label: '一级菜单',
    children: [
      {
        key: 'table',
        label: '二级菜单',
      }, {
        key: 'table2',
        label: '二级菜单2',
      }, {
        key: 'table3',
        label: '二级菜单3',
        children: [
          {
            key: 'table3-1',
            label: '三级菜单',
          }
        ],
      }
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
        result = menu[0].label;
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
            result = menu[0].label;
          }
        });
      }
    });
  } else {
    result = 'newTab';
  }
  return result;
};
let LeftMenu = ({keys, setKeys, setActiveKey, tabItems, setTabItems}) => {
  const navigate = useNavigate();
  const onClick = ({item, key, keyPath, domEvent}) => {
    // console.log('item ', item);
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
  return (
    <div className={'left'}>
      <Menu
        onClick={onClick}
        style={{
          width: 254,
        }}
        defaultSelectedKeys={['oilUserVirtuallyManager']}
        defaultOpenKeys={['oilUserVirtuallyManager']}
        mode="inline"
        items={menus}
      />
    </div>
  );
}

export default LeftMenu;
