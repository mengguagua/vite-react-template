import { Menu, Tabs } from 'antd';
import { useState } from 'react';
import { AppstoreOutlined } from '@ant-design/icons';
import { Outlet, Link } from "react-router-dom";
import './root.css';
import Header from './header/header';
// 编程式跳转路由
import { useNavigate } from "react-router-dom";

const menus = [
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
let keys = [];
let Root = () => {
  const navigate = useNavigate();
  // tab标签和菜单的联动操作
  const [activeKey, setActiveKey] = useState('');
  const [tabItems, setTabItems] = useState([]);
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
      keys = [...keys, key];
    }
    setActiveKey(key);
    navigate(key);
  };
  const onEdit = (targetKey, action) => {
    if (action === 'remove') {
      keys = keys.filter((key) => key !== targetKey);
      const tabs = tabItems.filter((tab) => tab.key !== targetKey);
      setTabItems(tabs);
      if (keys.length) {
        navigate(keys.slice(-1)[0]);
        setActiveKey(keys.slice(-1)[0]);
      }
    }
  };
  const onChange = (key) => {
    setActiveKey(key);
    navigate(key);
  };
  return (
    <div>
      <Header/>
      <div className={'main'}>
        <div className={'left'}>
          <Menu
            onClick={onClick}
            style={{
              width: 254,
            }}
            defaultSelectedKeys={['table']}
            defaultOpenKeys={['table']}
            mode="inline"
            items={menus}
          />
        </div>
        <div className={'right'}>
          { keys.length ?
          <Tabs
            hideAdd
            size="small"
            onChange={onChange}
            onEdit={onEdit}
            activeKey={activeKey}
            type="editable-card"
            items={tabItems}
          /> : <div></div>
          }
          <Outlet />
        </div>
      </div>
    </div>
  );
}
export default Root;
