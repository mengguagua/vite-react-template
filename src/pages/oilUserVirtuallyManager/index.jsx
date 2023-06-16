import { Select, Input, DatePicker, Button, Table, Modal, Form } from 'antd';
import { useState } from 'react';
import './index.css'

const { RangePicker } = DatePicker;

const selectData = [
  {
    value: '1',
    label: '杭州银行',
  },
  {
    value: '2',
    label: '招商银行',
  },
  {
    value: '3',
    label: '台州银行',
  },
]
// 冷知识：空值合并操作符：??
// 是一个逻辑操作符，当左侧的操作数为 null 或者 undefined 时，返回其右侧操作数，否则返回左侧操作数。
// 冷知识：可选链接运算符：?. （ES2020语法）
// data?.children?.[0]?.title; 等价于 if (data && data.children && data.children[0] && data.children[0].title){}
// 判断左侧对象不是null 或者 undefined就去取下一个属性
let table = () => {
  let [searchData, setSearchData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  let changeRangDate = (dayjs,dayString) => {

  };
  let toApply = () => {
    setIsModalOpen(true);
  };
  const modalCancel = () => {
    setIsModalOpen(false);
  };
  const onFinish = (values) => {
    console.log('Success:', values);
    setIsModalOpen(false);
  };
  let dataSource = [
    {
      id: 1,
      name: '92汽油',
      age: 158373765652,
      address: '你猜你猜你猜猜猜1',
    },
    {
      id: 2,
      name: '95汽油',
      age: 158373765651,
      address: '你猜你猜你猜猜猜2',
    },
  ];
  const columns = [
    {
      title: '油品用户名称',
      dataIndex: 'name',
    }, {
      title: '联系手机号码',
      dataIndex: 'age',
    }, {
      title: '虚拟账户',
      dataIndex: 'address',
    }, {
      title: '虚户开户银行',
      dataIndex: 'address2',
      key: 'address2',
    }, {
      title: '开户日期',
      dataIndex: 'address3',
      key: 'address3',
    }, {
      title: '账户余额',
      dataIndex: 'address4',
      key: 'address4',
    }, {
      title: '中石化积分余额',
      dataIndex: 'address5',
      key: 'address5',
    }, {
      title: '中石油积分余额',
      dataIndex: 'address6',
      key: 'address6',
    },
  ];
  return (
    <>
      <div className={'title-money'}>
        资金汇总账户余额 ¥ 340000
      </div>
      <div className={'search-module'}>
        <div className={'search-line'}>
          <div className={'search-item'}>
            <span>油品用户名称</span>
            <Input placeholder="请输入" allowClear value={searchData.aa} onChange={(e) => {setSearchData({...searchData,aa: e.target.value})}}/>
          </div>
          <div className={'search-item'}>
            <span>虚拟账户</span>
            <Input placeholder="请输入" allowClear value={searchData.bb} onChange={(e) => {setSearchData({...searchData,bb: e.target.value})}}/>
          </div>
          <div className={'search-item'}>
            <span>手机号码</span>
            <Input placeholder="请输入" allowClear value={searchData.cc} onChange={(e) => {setSearchData({...searchData,cc: e.target.value})}}/>
          </div>
          <div className={'search-item'}>
            <span>虚户开户银行</span>
            <Select
              className={'select-input'}
              showSearch
              placeholder="请选择"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              onChange={(e) => {setSearchData({...searchData,dd: e})}}
              options={selectData}
            />
          </div>
          <div className={'search-item'}>
            <span>开户日期</span>
            <RangePicker onChange={changeRangDate}/>
          </div>
        </div>
        <div className={'search-btn-line'}>
          <Button type="primary">查询</Button>
          <Button>重置</Button>
        </div>
      </div>
      <div>
        <Button type="primary" onClick={toApply} style={{margin: '10px 0'}}>提现申请</Button>
        <Table dataSource={dataSource} columns={columns}  rowKey="id" size="small"/>
      </div>
      <Modal title="提现申请" open={isModalOpen} width={'600px'} footer={null} closable={false}>
        <Form
          name="basic"
          labelCol={{ span: 8,}}
          wrapperCol={{ span: 16,}}
          style={{}}
          initialValues={{}}
          onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <div className={'form-row'}>
            <Form.Item
              label="客户名称"
              name="username"
              rules={[
                {
                  required: true,
                  message: 'Please input your username!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="业务类型"
              name="username"
            >
              <Input />
            </Form.Item>
          </div>
          <div className={'modal-footer'}>
            <Button type="primary" htmlType="submit"> 确认 </Button>
            <Button onClick={modalCancel}> 取消 </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};
export default table;
