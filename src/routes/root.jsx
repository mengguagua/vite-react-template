import { Tabs } from 'antd';
import { useState } from 'react';
import { Outlet } from "react-router-dom";
import './root.css';
import Header from './header/header';
import LeftMenu from './menu/menu';
// 编程式跳转路由
import { useNavigate } from "react-router-dom";

let Root = () => {
  const navigate = useNavigate();
  // tab标签和菜单的联动操作
  const [keys, setKeys] = useState('');
  const [activeKey, setActiveKey] = useState('');
  const [tabItems, setTabItems] = useState([]);
  const onEdit = (targetKey, action) => {
    if (action === 'remove') {
      setKeys(keys.filter((key) => key !== targetKey));
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
          <LeftMenu
            keys={keys}
            setKeys={setKeys}
            setActiveKey={setActiveKey}
            tabItems={tabItems}
            setTabItems={setTabItems}
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
