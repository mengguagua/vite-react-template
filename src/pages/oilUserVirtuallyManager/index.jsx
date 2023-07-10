// 油品用户虚户管理
import {Select, Input, DatePicker, Button, Table, Modal, Form, notification, Space, message, Upload} from 'antd';
import { useState, useEffect } from 'react';
import './index.css';
// import {
//   oilVirtualQueryPageList,
//   withdrawalApplication,
//   balanceInquiry,
//   withdrawalAccountNumber,
//   oilFileInfoUpload
// } from '../../service/interface';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

let file1 = {};

// 冷知识：空值合并操作符：??
// 是一个逻辑操作符，当左侧的操作数为 null 或者 undefined 时，返回其右侧操作数，否则返回左侧操作数。
// 冷知识：可选链接运算符：?. （ES2020语法）
// data?.children?.[0]?.title; 等价于 if (data && data.children && data.children[0] && data.children[0].title){}
// 判断左侧对象不是null 或者 undefined就去取下一个属性
let table = () => {
  // hook
  const [notificationApi, contextHolder] = notification.useNotification();
  const [messageApi, messageContextHolder] = message.useMessage();
  let [searchData, setSearchData] = useState({});
  let [uploading, setUploading] = useState(false);
  let [amount, setAmount] = useState('');
  let [dataSource, setDataSource] = useState([]);
  let [loading, setLoading] = useState(false);
  let [isModalOpen, setIsModalOpen] = useState(false);
  let [bankOptionData, setBankOptionData] = useState([]);
  let [fromData, setFromData] = useState({});
  let [modalForm] = Form.useForm();

  useEffect(() => { queryTable(); }, []);
  // 静态数据和声明
  const columns = [
    {
      title: '用户名称',
      dataIndex: 'companyName',
    }, {
      title: '联系手机号码',
      dataIndex: 'contactPhone',
    }, {
      title: '账户',
      dataIndex: 'virtualAccount',
    }, {
      title: '开户银行',
      dataIndex: 'bankName',
    }, {
      title: '开户日期',
      dataIndex: 'bankDate',
    }, {
      title: '账户余额',
      dataIndex: 'amount',
    }, {
      title: 'xx积分余额',
      dataIndex: 'scoreCnpc',
    }, {
      title: 'yy积分余额',
      dataIndex: 'scoreSinopec',
    }, {
      title: '操作',
      key: 'action',
      render: (_, record) => {
        return (
          <Space size="small">
            <a onClick={
              () => {
                // 后端接口定义有点变扭，accountId取行id，展示的虚拟账户是virtualAccount
                modalForm.setFieldsValue({applyName:record.companyName, accountIdStr: record.virtualAccount, accountId:record.id});
                toEdit(record)
              }
            } style={{textDecoration: "underline"}} >提现申请</a>
            <a onClick={ () => { balanceQuery(record) } } style={{textDecoration: "underline"}} >余额查询</a>
          </Space>
        )
      }
    },
  ];
  // 目前只支持一个银行 2023-06
  const selectData = [
    {
      value: 'xx银行',
      label: 'xx银行',
    },
  ];
  // 业务逻辑方法
  let changeRangDate = (dayjs,dayString) => {
    setSearchData({
      ...searchData,
      startBankDate: dayString[0],
      endBankDate: dayString[1],
    });
  };
  let balanceQuery = (row) => {
    // balanceInquiry({id: row.id}).then((resp) => {
      const key = `open${Date.now()}`;
      const btn = (
        <>
          <Button type="primary" size="small" onClick={() => notificationApi.destroy(key)}>
            我知道了
          </Button>
        </>
      );
      notificationApi.open({
        message: '信息',
        description:
          '同步刷新成功！请重新查询结果',
        btn,
        key,
        // onClose: close,
      });
    // });
  };
  let toEdit = (row) => {
    let resp = {
      data: [
        {
          "bankAccountName": "高xx",
          "bankName": "杭州银行",
          "bankNo": "984132165123188",
          "companyName": "",
          "id": 1,
          "topUpState": "1",
          "tradeAmount": 100.00,
          "tradeTime": "2023-06-07 14:54:33",
          "virtualAccount": ""
        }
      ],
    };
    // withdrawalAccountNumber({id: row.id}).then((resp) => {
      let bankOptionData = [];
      if (resp?.data?.length) {
        resp?.data.forEach((item) => {
          bankOptionData.push({
            value: item.bankNo,
            label: `${item.bankName}-${item.bankNo}`,
            bankAccountName: item.bankAccountName,
            bankName: item.bankName,
          });
        });
        setBankOptionData(bankOptionData);
        setIsModalOpen(true);
      } else {
        messageApi.warning('该用户没有符合要求的银行卡账户');
      }
    // });
  };
  const modalCancel = () => {
    modalForm.resetFields();
    setIsModalOpen(false);
  };
  let setOtherForm = (newValue) => {
    let data =bankOptionData.map((item) => {
      if (newValue == item.value) {
        return {
          bankAccountName: item.bankAccountName,
          bankName: item.bankName,
        }
      }
    });
    modalForm.setFieldsValue({...data}[0] );
  };
  const onFinish = (values) => {
    console.log('form表单数据:', values);
    // withdrawalApplication({
    //   ...values,
    //   files: [
    //     {
    //       url: file1.url,
    //       fileName: file1.fileName,
    //       fileType: 5, // 提现申请材料
    //     },
    //   ]
    // }).then(() => {
      setIsModalOpen(false);
      messageApi.success('已申请，请等待审核');
      queryTable();
    // });
  };
  const uploadProps = {
    beforeUpload: (file) => {
      file1.fileName = file.name;
      const formData = new FormData();
      formData.append('file', file);
      setUploading(true);
      // oilFileInfoUpload(formData).then((resp) => {
      //   file1.url = resp.data;
        messageApi.success('导入成功');
        setUploading(false);
      // }).finally(() => {
      //   setUploading(false);
      // });
      return false;
    },
    showUploadList: false, // 不展示上传后文件列表
    fileList: [],
  };
  // 默认调用的方法
  let queryTable = async () => {
    setLoading(true);
    // let resp = await oilVirtualQueryPageList({...searchData});
    let resp = [
      {
        "amount": 0.00,
        "bankDate": "2023-07-03 14:52:07",
        "bankName": "xx银行",
        "companyName": "xx公司",
        "contactPhone": "13213334444",
        "id": 5,
        "scoreCnpc": 0.00,
        "scoreSinopec": 0.00,
        "virtualAccount": "3301040160500307809-000054"
      },
    ];
    setLoading(false);
    setDataSource(resp);
  };
  // jsx返回内容
  return (
    <>
      {contextHolder}
      {messageContextHolder}
      <div className={'search-module'}>
        <div className={'search-line'}>
          <div className={'search-item'}>
            <span>用户名称</span>
            <Input placeholder="请输入" allowClear value={searchData.companyName} onChange={(e) => {setSearchData({...searchData,companyName: e.target.value})}}/>
          </div>
          <div className={'search-item'}>
            <span>账户</span>
            <Input placeholder="请输入" allowClear value={searchData.virtualAccount} onChange={(e) => {setSearchData({...searchData,virtualAccount: e.target.value})}}/>
          </div>
          <div className={'search-item'}>
            <span>手机号码</span>
            <Input placeholder="请输入" allowClear value={searchData.contactPhone} onChange={(e) => {setSearchData({...searchData,contactPhone: e.target.value})}}/>
          </div>
          <div className={'search-item'}>
            <span>开户银行</span>
            <Select
              className={'select-input'}
              showSearch
              value={searchData.bankName}
              placeholder="请选择"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              onChange={(e) => {setSearchData({...searchData, bankName: e})}}
              options={selectData}
            />
          </div>
          <div className={'search-item'}>
            <span>开户日期</span>
            <RangePicker key={searchData.key} onChange={changeRangDate}/>
          </div>
        </div>
        <div className={'search-btn-line'}>
          <Button type="primary" onClick={queryTable}>查询</Button>
          <Button onClick={() => setSearchData({key: new Date().getTime()})}>重置</Button>
        </div>
      </div>
      <div>
        <Table dataSource={dataSource} columns={columns} loading={loading}  rowKey="id" size="small"/>
      </div>
      <Modal title="提现申请" open={isModalOpen} width={'640px'} footer={null} closable={false}>
        <Form
          form={modalForm}
          name="basic"
          onFinish={onFinish}
          autoComplete="off"
        >
          <div style={{display: "none"}}>
            <Form.Item label="" name="accountId">
              <Input disabled />
            </Form.Item>
          </div>
          <div className={'form-row'}>
            <Form.Item label="客户名称" name="applyName">
              <Input disabled />
            </Form.Item>
            <Form.Item label="业务类型" name="tradeType">
              <Select
                style={{ width: 180 }}
                onChange={(e) => {setFromData({...fromData, tradeType: e})}}
                options={[
                  { value: '1', label: '提现' },
                  { value: '2', label: '充值' },
                  { value: '3', label: '合作解除提现' },
                  { value: '4', label: '账户名不符退款' },
                ]}
              />
            </Form.Item>
          </div>
          <div className={'form-row'}>
            <Form.Item label="子账户" name="accountIdStr">
              <Input disabled style={{ width: 503 }} />
            </Form.Item>
          </div>
          <div className={'form-row'}>
            <Form.Item label="提现账号" name="bankNo">
              <Select
                onChange={setOtherForm}
                style={{ width: 503 }}
                options={bankOptionData}
              />
            </Form.Item>
          </div>
          <div className={'form-row'}>
            <Form.Item label="提现户名" name="bankAccountName">
              <Input disabled/>
            </Form.Item>
            <Form.Item label="开户行" name="bankName">
              <Input disabled/>
            </Form.Item>
          </div>
          <div className={'form-row'}>
            <Form.Item label="提现金额" name="tradeAmount">
              <Input/>
            </Form.Item>
          </div>
          <div className={'form-row'}>
            <Form.Item label="提现原因" name="reason">
              <Input style={{ width: 500 }}/>
            </Form.Item>
          </div>
          <div className={'form-row'}>
            <Form.Item label="备注" name="remark">
              <TextArea rows={4} style={{ width: 500 }}/>
            </Form.Item>
          </div>
          <div style={{display: "flex", alignItems: "baseline", padding: "4px 0"}}>
            <div style={{width: '94px'}}>申请材料:</div>
            <Upload {...uploadProps}>
              <Button
                type="primary"
                style={{margin: '10px 0'}}
                loading={uploading}>
                {uploading ? 'Uploading' : '点击上传'}
              </Button>
            </Upload>
            <div style={{marginLeft: '12px', color: '#333'}}>{file1.fileName}</div>
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
