import {Menu} from "antd";
import './menu.css';
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {menuList} from '../../service/interface';

const menus = [
  {
    key: 'driverCard',
    label: '示例菜单',
  },
  {
    key: 'driverCard2',
    label: '示例菜单2',
  },
];



let LeftMenu = ({keys, setKeys,setTabActiveKey, tabItems, setTabItems}) => {
  // 使用前端的静态菜单就注释下面两行
  // let [menus, setMenus] = useState([]);
  // useEffect(() => { queryMenu(); }, []);
  useEffect(() => { dealTab() }, [location.href.split('?')[0]]);
  let [activeKey, setActiveKey] = useState([]);

  const navigate = useNavigate();

  let getMenuLabelByKey = (keyPath) => {
    let result = '';
    let menu = menus.filter((item) => {
      return item.key === keyPath[0];
    });
    result = menu[0]?.label;
    if (result) {
      return result;
    }
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
    if (result) {
      return result;
    }
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
    // console.log('result---', result, keyPath, menus)
    if (result) {
      return result;
    } else {
      return '详情'
    }
  }

  // 三级菜单以及之内
  let getMenuLabel = (keyPath) => {
    let len = keyPath.length;
    let result = '';
    if (len === 1) {
      let menu = menus.filter((item) => {
        return item.key === keyPath[0];
      });
      result = menu[0]?.label;
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

  const onClick = ({item, key, keyPath, domEvent, noNavigate}) => {
    // console.log('item ', item);
    // console.log('keyPath ', keyPath);
    let label = '';
    if (!noNavigate) {
      label = getMenuLabel(keyPath);
      // console.log('getMenuLabel ', label, keyPath);
    } else {
      label = getMenuLabelByKey(keyPath);
      // console.log('getMenuLabelByKey ', label, keyPath);
    }
    // console.log('label ', label, key);
    if (!keys.includes(key) && label !== '详情') {
      setTabItems([
        ...tabItems,
        {
          label: label,
          key: key,
        }
      ]);
      setKeys([...keys, key])
    }
    console.log('key ', key);
    setTabActiveKey(key);
    setActiveKey(key);
    if (!noNavigate) {
      navigate(key);
    }
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

  let dealTab = () => {
    // 获取url路径
    let keyPath = location.href.split('?')[0].split('/').slice(-1);
    onClick({item: '', key: keyPath[0], keyPath, domEvent: '', noNavigate: true});
  }
  // 默认调用接口
  let queryMenu = () => {
    menuList().then((resp) => {
      let menu = deleteEmptyChildren(resp?.data);
      // console.log('menu', menu)
      setMenus(menu)
    });
  };
  return (
    <div className={'left'}>
      <Menu
        onClick={onClick}
        style={{
          width: 254,
        }}
        defaultSelectedKeys={[activeKey]}
        defaultOpenKeys={[activeKey]}
        selectedKeys={[activeKey]}
        mode="inline"
        items={menus}
      />
    </div>
  );
}

export default LeftMenu;
