import './header.css'
import {Modal, Input, message} from 'antd';
import {useEffect, useState} from 'react';
import {
  uctLogout, getUserInfo, changePwd
} from '../../service/interface';
import {rsaEncypt} from  '../../tool/index';
import { useDispatch } from 'react-redux';
import { fetchAuthBtn } from '../../store/authBtnSlice';

let Header = () => {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({});
  const [errorText, setErrorText] = useState('');
  const [user, setUser] = useState({});
  useEffect(() => { toGetUserInfo();  dispatch(fetchAuthBtn()); }, []); // fetchAuthBtn获取按钮权限集合

  let logout = () => {
    uctLogout().then((resp) => {
      location.href = resp?.message;
    });
  }

  let toGetUserInfo = ()=> {
    getUserInfo().then((resp) => {
      setUser(resp?.data)
    })
  }

  let editPassword = () => {
    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.secondNewPassword) {
      setErrorText('tip:不能为空');
      return false;
    } else if (passwordData.newPassword !== passwordData.secondNewPassword) {
      setErrorText('tip:新密码和新密码二次确认不一致');
      return false;
    } else {
      setErrorText('');
    }
    let oldP = dealPassword(passwordData.oldPassword);
    let newP = dealPassword(passwordData.newPassword);
    console.log(oldP, '----', newP)
    changePwd({
      oldPassword: oldP,
      newPassword: newP,
    }).then((resp) => {
      if (resp.data.status == 1) {
        messageApi.error(resp.data.message || '网络拥堵，稍后再试');
      } else {
        messageApi.success('修改成功');
        setPasswordModalOpen(false);
      }
    });
  }

  let dealPassword = (password) => {
    let p1 = encodeURIComponent(password);
    const rsaContext = rsaEncypt(p1);
    // console.log(p1, '----', rsaContext)
    return rsaContext;
  }

  return (
    <div className={'header-top'}>
      {contextHolder}
      <div style={{marginLeft: '20px'}}>业务管理系统</div>
      <div className={'header-right'}>
        <div>{user.userName}</div>
        <div onClick={() => {setPasswordModalOpen(true)}} style={{marginRight: '10px'}}>密码修改</div>
        <div onClick={() => {setIsModalOpen(true)}}>登出</div>
        <Modal title="提示" open={isModalOpen} width={'300px'} onOk={logout} onCancel={() => {setIsModalOpen(false)}}>
          <p>确定登出吗？</p>
        </Modal>
        <Modal title="修改密码" open={passwordModalOpen} width={'400px'} onOk={editPassword} onCancel={() => {setPasswordModalOpen(false)}}>
          <div>
            <span style={{color: 'red'}}>*</span>老密码
            <Input.Password placeholder="请输入" allowClear onChange={(e) => {setPasswordData({...passwordData,oldPassword: e.target.value})}}/>
          </div>
          <div>
            <span style={{color: 'red'}}>*</span>新密码
            <Input.Password placeholder="请输入" allowClear onChange={(e) => {setPasswordData({...passwordData,newPassword: e.target.value})}}/>
          </div>
          <div>
            <span style={{color: 'red'}}>*</span>新密码二次确认
            <Input.Password placeholder="请输入" allowClear onChange={(e) => {setPasswordData({...passwordData,secondNewPassword: e.target.value})}}/>
          </div>
          <div style={{color: 'red',marginTop: '4px'}}>{errorText}</div>
        </Modal>
      </div>
    </div>
  );
};
export default Header;
