// 油品用户信息管理
import {Select, Input, DatePicker, Button, Table, Modal, Form, Upload, Space, message} from 'antd';
import {useEffect, useState} from 'react';
import {
  oilUserPageList,
  getSalesStaff,
  assignedPersonnel,
  oilUserCompanyInfoAddEdit,
  oilFileInfoUpload,
  getUserCompanyById,
  xmCustomerInput,
  oilServiceConfigPage, oilFileInfoUrlPrefix,
} from '../../service/interface';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

let file1 = {};
let file2 = {};
let file3 = {};
let file4 = {};

let modalType = '';

let table = () => {
  // hook
  const [messageApi, contextHolder] = message.useMessage();
  let [searchData, setSearchData] = useState({});
  let [dataSource, setDataSource] = useState([]);
  let [salesStaffData, setSalesStaffData] = useState([]);
  let [isModalOpen, setIsModalOpen] = useState(false);
  let [uploading, setUploading] = useState(false);
  let [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  let [isDisabled, setIsDisabled] = useState(false);
  let [apiOptionData, setApiOptionData] = useState([]);
  let [urlPrefix, setUrlPrefix] = useState('');
  let [modalForm] = Form.useForm();
  let [managerForm] = Form.useForm();

  useEffect(() => { queryTable(); queryManager(); queryUrlPrefix(); }, []);
  // 静态数据
  const columns = [
    {
      title: '用户名称',
      dataIndex: 'companyName',
    }, {
      title: '联系手机号码',
      dataIndex: 'contactPhone',
    }, {
      title: '日期',
      dataIndex: 'applyTime',
    }, {
      title: '经理',
      dataIndex: 'applyMan',
    }, {
      title: '模式',
      dataIndex: 'serviceName',
    }, {
      title: '状态',
      dataIndex: 'applyState',
      render: (_, record) => {
        return (
          <Space size="small">
            {applyStateDic[record.applyState]}
          </Space>
        )
      }
    }, {
      title: '操作',
      key: 'action',
      render: (_, record) => {
        return (
          <Space size="small">
            <a onClick={() => {toEdit(record)}} style={{textDecoration: "underline"}} >编辑</a>
            <a onClick={() => {toAssign(record)}} style={record?.applyState == 3? {display: "none"} : {textDecoration: "underline"}} >指派经理</a>
          </Space>
        )
      }
    },
  ];
  const selectData = [
    {
      value: '1',
      label: '申请中',
    }, {
      value: '2',
      label: '跟进中',
    }, {
      value: '3',
      label: '已签约',
    }, {
      value: '4',
      label: '未合作',
    },
  ]
  const applyStateDic = {
    1: '申请中',
    2: '跟进中',
    3: '已签约',
    4: '未合作',
  };
  // 业务方法
  let changeRangDate = (dayjs, dayString) => {
    setSearchData({
      ...searchData,
      startApplyTime: dayString[0],
      endApplyTime: dayString[1],
    });
  };
  let toAssign = (record) => {
    managerForm.setFieldsValue(record)
    setIsAssignModalOpen(true)
  };
  let toMainApply = () => {
    modalType = 'main';
    modalForm.resetFields();
    file1 = {};
    file2 = {};
    file3 = {};
    file4 = {};
    setIsDisabled(false);
    modalForm.setFieldsValue({accountType: 'main'});
    setIsModalOpen(true);
  };
  let toEdit = (record) => {
    modalType = '';
    if (record) {
      // 若已签约，输入置灰
      if (record.applyState == 3) {
        setIsDisabled(true);
      } else {
        setIsDisabled(false);
      }
      getUserCompanyById({id: record.id}).then((resp) => {
        // 新增入口为门户时没有附件，管理后台新增肯定是四个附件
        if (resp.data?.files?.length) {
          file1 = resp.data?.files[0];
          file2 = resp.data?.files[1];
          file3 = resp.data?.files[2];
          file4 = resp.data?.files[3];
        }
        // 转化数据，修改时候要给id
        let applyManUserId = resp.data?.oilUserCompanyInfoVO.applyManUserId;
        let applyMan = resp.data?.oilUserCompanyInfoVO.applyMan;
        let serviceId = resp.data?.oilUserCompanyInfoVO.serviceId;
        let serviceName = resp.data?.oilUserCompanyInfoVO.serviceName;
        modalForm.setFieldsValue({
          ...resp.data?.oilTicketInfoVO,
          ...resp.data?.oilUserCompanyInfoVO,
          oilTicketInfoVOId: resp.data?.oilTicketInfoVO?.id,
          oilUserCompanyInfoVOId: resp.data?.oilUserCompanyInfoVO?.id,
          applyManObj: applyManUserId && applyMan ? `${ applyManUserId}-${ applyMan}` : '',
          serviceObj: serviceId && serviceName ? `${serviceId}-${serviceName}` : '',
        });
        setIsModalOpen(true);
      });
    } else {
      setIsDisabled(false);
      modalForm.resetFields();
      file1 = {};
      file2 = {};
      file3 = {};
      file4 = {};
      setIsModalOpen(true);
    }
    handleSearch('');
  };
  const modalCancel = () => {
    setIsModalOpen(false);
    setIsAssignModalOpen(false)
  };
  let setFile = (file, num) => {
    return {
      id: file.id,
      url: file.url,
      fileName: file.fileName,
      fileType: num,
    };
  };
  /*客户进件*/
  const onFinish = async (values) => {
    console.log('Success:', values);
    let formData = modalForm.getFieldsValue(true); // 获取全部表单数据
    let serviceId = formData?.serviceObj?.split('-')[0];
    let serviceName = formData?.serviceObj?.split('-')[1];
    let applyManUserId = formData?.applyManObj?.split('-')[0]
    let applyMan = formData?.applyManObj?.split('-')[1]
    let data = {
      oilTicketInfoDTO: {
        ...values,
        id: formData.oilTicketInfoVOId || '',
      },
      oilUserCompanyInfoDTO: {
        ...values,
        id: formData.oilUserCompanyInfoVOId || '',
        applyMan: applyMan,
        applyManUserId: applyManUserId,
        serviceId: serviceId,
        serviceName: serviceName,
      },
      // 1营业执照 2经办人身份证正面 3经办人身份证反面 4合作协议
      files: [
        setFile(file1,1),
        setFile(file2,2),
        setFile(file3,3),
        setFile(file4,4),
      ],
    };
    if (formData.accountType === 'main') {
      await xmCustomerInput(data);
      messageApi.success('操作成功');
    } else {
      await oilUserCompanyInfoAddEdit(data);
      messageApi.success('操作成功');
    }
    setIsModalOpen(false);
    await queryTable();
  };
  /*指派商务经理*/
  const onFinishAssign = async (values) => {
    console.log('Success:', values);
    let applyManUserId = values?.applyManObj?.split('-')[0]
    let applyMan = values?.applyManObj?.split('-')[1]
    await assignedPersonnel({...values, applyManUserId: applyManUserId, applyMan: applyMan});
    setIsAssignModalOpen(false)
    await queryTable();
  };
  /* 四个文件上传处理 */
  const uploadPropsFile = (fileItem) => {
    return {
      beforeUpload: (file) => {
        let fileDic = ['image/jpeg','application/pdf', 'image/png', 'image/jpg'];
        if (!fileDic.includes(file.type)) {
          messageApi.warning('请上传类型为jpeg、pdf、png、jpg的文件');
          return false;
        }
        let limitSize = 5 * 1000 * 1000;
        if (file.size > limitSize) {
          messageApi.warning('文件大小不能大于5M');
          return false;
        }
        fileItem.fileName = file.name;
        const formData = new FormData();
        formData.append('file', file);
        setUploading(true);
        oilFileInfoUpload(formData).then((resp) => {
          fileItem.url = resp.data;
          messageApi.success('上传成功');
        }).finally(() => {
          setUploading(false);
        });
        return false;
      },
      showUploadList: false, // 不展示上传后文件列表
      fileList : [],
    }
  };
  /* -------------- */
  // 下拉远程查询
  const handleSearch = (newValue) => {
    oilServiceConfigPage({serviceName: newValue}).then((resp) => {
      if (resp?.data?.length) {
        const optionData = resp.data.map((item) => ({
          value: `${item.id}-${item.serviceName}`,
          text: item.serviceName,
        }));
        setApiOptionData(optionData);
      }
    });
  };
  let openFile = (e) => {
    let url = e?.currentTarget?.dataset?.url;
    window.open(`${urlPrefix}${url}`)
  };
  // 默认调用的方法
  let queryTable = async () => {
    let resp = await oilUserPageList({...searchData, pageIndex:0, pageSize:200});
    setDataSource(resp?.data);
  };
  let queryManager = async () => {
    let resp = await getSalesStaff();
    let temp = resp?.data.map((item) => {
      return {
        value: `${item?.userId}-${item?.userName}`,
        label: item?.userName,
      };
    });
    setSalesStaffData(temp);
  };
  let queryUrlPrefix = async () => {
    let resp = await oilFileInfoUrlPrefix();
    setUrlPrefix(resp?.data);
  };
  // jsx返回内容
  return (
    <>
      {contextHolder}
      <div className={'search-module'}>
        <div className={'search-line'}>
          <div className={'search-item'}>
            <span>用户名称</span>
            <Input placeholder="请输入" allowClear value={searchData.companyName} onChange={(e) => {setSearchData({...searchData,companyName: e.target.value})}}/>
          </div>
          <div className={'search-item'}>
            <span>手机号码</span>
            <Input placeholder="请输入" allowClear value={searchData.contactPhone} onChange={(e) => {setSearchData({...searchData,contactPhone: e.target.value})}}/>
          </div>
          <div className={'search-item'}>
            <span>状态</span>
            <Select
              allowClear
              value={searchData.applyState}
              className={'select-input'}
              placeholder="请选择"
              onChange={(e) => {setSearchData({...searchData,applyState: e})}}
              options={selectData}
            />
          </div>
          <div className={'search-item'}>
            <span>日期</span>
            <RangePicker key={searchData.key} onChange={changeRangDate}/>
          </div>
        </div>
        <div className={'search-btn-line'}>
          <Button type="primary" onClick={queryTable}>查询</Button>
          <Button onClick={() => setSearchData({key: new Date().getTime()})}>重置</Button>
        </div>
      </div>
      <div>
        <Button type="primary" onClick={() => {toEdit('')}} style={{margin: '10px 0'}}>新增</Button>
        <Button type="primary" onClick={() => {toMainApply()}} style={{margin: '10px 4px'}}>一个弹框两用</Button>
        <Table dataSource={dataSource} columns={columns}  rowKey="id" size="small"/>
      </div>
      <Modal title={modalType === 'main'? '非油品用户进件' : '客户进件'} open={isModalOpen} width={'640px'} footer={null} closable={false}>
        <Form
          form={modalForm}
          name="basic"
          onFinish={onFinish}
          autoComplete="off"
        >
          <div style={{display: "none"}}>
            <Form.Item name="oilTicketInfoVOId">
              <Input />
            </Form.Item>
            <Form.Item name="oilUserCompanyInfoVOId">
              <Input />
            </Form.Item>
            <Form.Item name="accountType">
              <Input />
            </Form.Item>
          </div>
          <div className={'form-title'}>基本信息</div>
          <div className={'form-row'}>
            <Form.Item label="用户名称"
                       rules={[
                         // { required: true, message: '必填'},
                         { pattern: /^.{1,30}$/, message: '最大可输入30字符'}
                       ]}
                       className={'label-item'} name="companyName">
              <Input disabled={isDisabled} />
            </Form.Item>
            <Form.Item label="证件类型"
                       rules={[
                         // { required: true, message: '必填'},
                       ]}
                       name="idType">
              <Select
                allowClear
                disabled={isDisabled}
                style={{ width: 180 }}
                options={[
                  { value: '1', label: '统一信用代码证' },
                ]}
              />
            </Form.Item>
          </div>
          <div className={'form-row'}>
            <Form.Item label="证件号码"
                       rules={[
                         // { required: true, message: '必填'},
                         { pattern: /^.{1,20}$/, message: '最大可输入20字符'},
                         { pattern: /^[a-zA-Z0-9]+$/, message: '请输入正确的字符'}
                       ]}
                       name="idNo">
              <Input disabled={isDisabled} style={{ width: 500 }}/>
            </Form.Item>
          </div>
          <div className={'form-row'}>
            <Form.Item label="联系地址"
                       rules={[
                         // { required: true, message: '必填'},
                         { pattern: /^.{1,100}$/, message: '最大可输入100字符'}
                       ]}
                       name="address">
              <Input disabled={isDisabled} style={{ width: 500 }}/>
            </Form.Item>
          </div>
          <div className={'form-row'}>
            <Form.Item label="联系人"
                       rules={[
                         // { required: true, message: '必填'},
                         { pattern: /^.{1,30}$/, message: '最大可输入30字符'}
                       ]}
                       name="contactName">
              <Input />
            </Form.Item>
            <Form.Item label="手机号码"
                       rules={[
                         // { required: true, message: '必填'},
                         {
                           pattern: /^1[3456789]\d{9}$/,
                           message: '请输入正确的手机号格式'
                         }
                       ]}
                       name="contactPhone">
              <Input />
            </Form.Item>
          </div>
          <div className={'form-row'}>
            <Form.Item label="时间" name="applyTime">
              <Input disabled={isDisabled} style={{ width: 500 }} disabled/>
            </Form.Item>
          </div>
          <div className={'form-row'}>
            <Form.Item label="经理" className={'label-item'} name="applyManObj">
              <Select
                allowClear
                style={{ width: 180 }}
                options={salesStaffData}
                disabled={isDisabled}
              />
            </Form.Item>
            <Form.Item label="模式"
                       rules={[
                         // { required: true, message: '必填'},
                       ]}
                       className={'label-item'} name="serviceObj">
              <Select
                allowClear
                showSearch
                placeholder='请输入查询'
                style={{width: '180px'}}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onSearch={handleSearch}
                notFoundContent={null}
                options={(apiOptionData || []).map((d) => ({
                  value: d.value,
                  label: d.text,
                }))}
                disabled={isDisabled}
              />
            </Form.Item>
          </div>
          <div className={'form-row'} >
            <Form.Item label="状态"
                       rules={[
                         { required: true, message: '必填'},
                       ]}
                       className={'label-item'} name="applyState">
              <Select
                allowClear
                style={{ width: 180 }}
                options={[
                  { value: '1', label: '申请中' },
                  { value: '2', label: '商务跟进中' },
                  { value: '3', label: '已签约合作' },
                  { value: '4', label: '未达成合作' },
                ]}
                disabled={isDisabled}
              />
            </Form.Item>
          </div>
          <div className={'form-row'}>
            <Form.Item label="说明"
                       rules={[
                         // { required: true, message: '必填'},
                         { pattern: /^.{1,500}$/, message: '最大可输入500字符'}
                       ]}
                       name="remark">
              <TextArea rows={4} disabled={isDisabled} style={{ width: 500 }}/>
            </Form.Item>
          </div>
          <div className={'form-title'}>附件</div>
          <div style={{display: "flex", alignItems: "baseline", padding: "4px 0"}}>
            <div style={{width: '130px'}}>营业执照:</div>
            <Upload disabled={isDisabled} {...uploadPropsFile(file1)}>
              <Button
                disabled={isDisabled}
                type="primary"
                loading={uploading}>
                {uploading ? 'Uploading' : '上传附件'}
              </Button>
            </Upload>
            <div style={{marginLeft: '12px', color: '#333', textDecoration: "underline", cursor: "pointer"}} data-url={file1.url} onClick={openFile}>{file1.fileName}</div>
          </div>
          <div style={{display: "flex", alignItems: "baseline", padding: "4px 0"}}>
            <div style={{width: '130px'}}>身份证正面:</div>
            <Upload disabled={isDisabled} {...uploadPropsFile(file2)}>
              <Button
                disabled={isDisabled}
                type="primary"
                loading={uploading}>
                {uploading ? 'Uploading' : '上传附件'}
              </Button>
            </Upload>
            <div style={{marginLeft: '12px', color: '#333', textDecoration: "underline", cursor: "pointer"}} data-url={file2.url} onClick={openFile}>{file2.fileName}</div>
          </div>
          <div style={{display: "flex", alignItems: "baseline", padding: "4px 0"}}>
            <div style={{width: '130px'}}>身份证反面:</div>
            <Upload disabled={isDisabled} {...uploadPropsFile(file3)}>
              <Button
                disabled={isDisabled}
                type="primary"
                loading={uploading}>
                {uploading ? 'Uploading' : '上传附件'}
              </Button>
            </Upload>
            <div style={{marginLeft: '12px', color: '#333', textDecoration: "underline", cursor: "pointer"}} data-url={file3.url} onClick={openFile}>{file3.fileName}</div>
          </div>
          <div style={{display: "flex", alignItems: "baseline", padding: "4px 0"}}>
            <div style={{width: '130px'}}>合作协议:</div>
            <Upload disabled={isDisabled} {...uploadPropsFile(file4)}>
              <Button
                disabled={isDisabled}
                type="primary"
                loading={uploading}>
                {uploading ? 'Uploading' : '上传附件'}
              </Button>
            </Upload>
            <div style={{marginLeft: '12px', color: '#333', textDecoration: "underline", cursor: "pointer"}} data-url={file4.url} onClick={openFile}>{file4.fileName}</div>
          </div>
          <div className={'modal-footer'}>
            <Button type="primary" htmlType="submit"> 确认提交 </Button>
            <Button onClick={modalCancel}> 取消 </Button>
          </div>
        </Form>
      </Modal>

      <Modal title="指派商务经理" open={isAssignModalOpen} width={'640px'} footer={null} closable={false}>
        <Form
          form={managerForm}
          name="assign"
          onFinish={onFinishAssign}
          autoComplete="off"
        >
          <div style={{display: "none"}}>
            <Form.Item name="id">
              <Input />
            </Form.Item>
          </div>
          <div className={'form-row'}>
            <Form.Item label="商务经理" name="applyManObj">
              <Select
                allowClear
                style={{ width: 180 }}
                options={salesStaffData}
              />
            </Form.Item>
          </div>
          <div className={'modal-footer'}>
            <Button type="primary" htmlType="submit"> 确认提交 </Button>
            <Button onClick={modalCancel}> 取消 </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};
export default table;
