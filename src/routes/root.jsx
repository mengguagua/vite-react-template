import { Tabs } from 'antd';
import {useRef, useState} from 'react';
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
  const [isOpen, setIsOpen] = useState(true);
  const [keys, setKeys] = useState('');
  const [tabActiveKey, setTabActiveKey] = useState('');
  const [tabItems, setTabItems] = useState([]);
  let menuActiveKey = useRef('');

  const onEdit = (targetKey, action) => {
    if (action === 'remove') {
      setKeys(keys.filter((key) => key !== targetKey));
      const tabs = tabItems.filter((tab) => tab.key !== targetKey);
      setTabItems(tabs);
      if (keys.length) {
        navigate(tabs.slice(-1)[0]?.key);
        menuActiveKey.current = tabs.slice(-1)[0]?.key;
      }
    }
  };
  const onChange = (key) => {
    menuActiveKey.current = key;
    navigate(key);
    console.log('menuActiveKey', menuActiveKey.current);
  };
  let openCloseMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div>
      <Header/>
      <div className={'main'}>
        <div className={'icon-park-solid--exchange-four'} style={isOpen ? {left: '238px'} : {left: '4px'}} onClick={openCloseMenu}/>
        {/*<div className={'left'}>*/}
        <div className={isOpen ? 'root-left' : 'close-root-left'}>
          <LeftMenu
            keys={keys}
            setKeys={setKeys}
            setTabActiveKey={setTabActiveKey}
            tabItems={tabItems}
            setTabItems={setTabItems}
          />
        </div>
        <Spin style={{zIndex: '2000', maxHeight: '100%'}} spinning={loadingType}>
          <div className={isOpen ? 'right' : 'close-right'}>
            {/* financialReconciliation: 财务对账不展示tab */}
            { keys.length && menuActiveKey.current != 'financialReconciliation' ?
              <Tabs
                hideAdd
                size="small"
                onChange={onChange}
                onEdit={onEdit}
                activeKey={tabActiveKey}
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
