import { Tabs } from 'antd';
import { useState } from 'react';
import { Outlet } from "react-router-dom";
import './root.css';
import Header from './header/header';
import LeftMenu from './menu/menu';
// 编程式跳转路由
import { useNavigate } from "react-router-dom";
// 加载框
import { Spin } from 'antd'
import { useSelector } from 'react-redux'

let Root = () => {
  // 获取全局加载状态
  let loadingType = useSelector(state => state.loading.value)

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
        navigate(tabs.slice(-1)[0]?.key);
        setActiveKey(tabs.slice(-1)[0]?.key);
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
            activeKey={activeKey}
            setActiveKey={setActiveKey}
            tabItems={tabItems}
            setTabItems={setTabItems}
          />
        </div>
        <Spin style={{zIndex: '2000', maxHeight: '100%'}} spinning={loadingType}>
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
        </Spin>
      </div>
    </div>
  );
}
export default Root;
