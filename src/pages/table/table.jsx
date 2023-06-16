import { Select, Input, DatePicker, Button, Table } from 'antd';
import { useState } from 'react';
import './table.css'

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
  let changeRangDate = (dayjs,dayString) => {

  };
  let dataSource = [
    {
      name: '92汽油',
      age: 15837376565,
      address: '你猜你猜你猜猜猜',
    },
    {
      name: '95汽油',
      age: 15837376565,
      address: '你猜你猜你猜猜猜',
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
    }, {
      title: '开户日期',
      dataIndex: 'address3',
    }, {
      title: '账户余额',
      dataIndex: 'address4',
    }, {
      title: '中石化积分余额',
      dataIndex: 'address5',
    }, {
      title: '中石油积分余额',
      dataIndex: 'address6',
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
        <Table dataSource={dataSource} columns={columns} size="small"/>
      </div>
    </>
  );
};
export default table;
