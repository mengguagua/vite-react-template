import './header.css'
import { Modal } from 'antd';
import { useState } from 'react';
import {
  uctLogout,
} from '../../service/interface';

let Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  let logout = () => {
    uctLogout().then((resp) => {
      location.href = resp?.message;
    });
  }

  return (
    <div className={'header-top'}>
      <div style={{marginLeft: '20px'}}>后台管理系统</div>
      <div className={'header-right'}>
        <div onClick={() => {setIsModalOpen(true)}}>登出</div>
        <Modal title="提示" open={isModalOpen} width={'300px'} onOk={logout} onCancel={() => {setIsModalOpen(false)}}>
          <p>确定登出吗？</p>
        </Modal>
      </div>
    </div>
  );
};
export default Header;
