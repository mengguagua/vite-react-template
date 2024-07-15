// 司机副卡管理
import {Input, Button, Table, Modal, Form, Space, Radio, Select, Upload, message} from 'antd';
import {useEffect, useState} from 'react';
// 编程式跳转路由
import { useNavigate } from "react-router-dom";
import {
  oilCardInfoQueryPages,
  oilCardInfoImport,
  subcardGeneration,
  oilUserCompanyInfoList,
  getViceNoByOilCompanyName, oilCardInfoUnbind,
  exportFiles, modifyCardRelation, cardSearch,
  updateCardGeneration, buttonList, oilUserFleetInfoPage,
  fleetAssociation, fleetDisassociation
} from '../../service/interface';
import useOilCompany from "../../hook/useOilCompany";
import {useSelector} from "react-redux";
const { confirm } = Modal;

// 组件外数据
let editFlag = '';
let carColorOption = [
  {
    label: '蓝色',
    value: '0'
  }, {
    label: '黄色',
    value: '1'
  }, {
    label: '黑色',
    value: '2'
  }, {
    label: '白色',
    value: '3'
  }, {
    label: '渐变绿色',
    value: '4'
  }, {
    label: '黄绿双拼色',
    value: '5'
  }, {
    label: '蓝白渐变色',
    value: '6'
  }, {
    label: '其它',
    value: '-1'
  },
];

let table = () => {
  const btnCodeList = useSelector((state) => state.authBtn.btnCodeList);
  const navigate = useNavigate();
  // hook
  let [messageApi, contextHolder] = message.useMessage();
  let [searchData, setSearchData] = useState({});
  let [fileList, setFileList] = useState([]);
  let [uploading, setUploading] = useState(false);
  let [dataSource, setDataSource] = useState([]);
  let [currentRow, setCurrentRow] = useState({});
  let [isModalOpen, setIsModalOpen] = useState(false);
  let [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  let [virtualTypeFlag, setVirtualTypeFlag] = useState('');
  let [modalForm] = Form.useForm();
  let [teamModalForm] = Form.useForm();
  let [apiOptionData, setApiOptionData] = useState([]);
  let [teamApiOptionData, setTeamApiOptionData] = useState([]);
  let [oilCardNoOption, setOilCardNoOption] = useState([]);
  let {oilCompanyOption} = useOilCompany(); // 自定义hook，查询关联石油公司下拉 1实体卡 2电子油卡
  let oilEntity = useOilCompany(1); // 自定义hook，查询关联石油公司下拉 1实体卡 2电子油卡
  let oilEntityCompanyOption = oilEntity?.oilCompanyOption;
  useEffect(() => { queryTable(); }, []);
  // 静态数据
  const columns = [
    {
      title: '名称',
      dataIndex: 'fleetName',
    }, {
      title: '状态',
      dataIndex: 'usedStatus',
      render: (_, record) => {
        let typeDic = {
          1: '使用中',
          2: '已禁用',
        };
        return (
          <Space size="small">
            {
              record.usedStatus == 1 ?
                <span style={{color: "green"}}>{typeDic[record.usedStatus]}</span> :
                <span style={{color: "red"}}>{typeDic[record.usedStatus]}</span>
            }
          </Space>
        )
      }
    }, {
      title: '用户名称',
      dataIndex: 'companyName',
    }, {
      title: '姓名',
      dataIndex: 'driverName',
    }, {
      title: '手机号码',
      dataIndex: 'phoneNo',
    }, {
      title: '账户余额',
      dataIndex: 'amount',
    }, {
      title: '关联状态',
      dataIndex: 'validateType',
      render: (_, record) => {
        let validateTypeDic = {
          0: '未关联',
          1: '已关联',
        };
        return (
          <Space size="small">
            {validateTypeDic[record.validateType]}
          </Space>
        )
      }
    }, {
      title: '公司',
      dataIndex: 'oilCompanyName',
    }, {
      title: '类型',
      dataIndex: 'virtualType',
      render: (_, record) => {
        let virtualTypeDic = {
          1: '实体',
          2: '电子',
        };
        return (
          <Space size="small">
            {virtualTypeDic[record.virtualType]}
          </Space>
        )
      }
    }, {
      title: '属性',
      dataIndex: 'driverAttributeType',
      render: (_, record) => {
        let driverAttributeTypeDic = {
          1: '自有',
          2: '外协',
        };
        return (
          <Space size="small">
            {driverAttributeTypeDic[record.driverAttributeType]}
          </Space>
        )
      }
    }, {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => {
        return (
          <Space size="small">
            {
              record.usedStatus == 2 ? "" :
                <a onClick={() => {setCurrentRow(record); modalForm.setFieldsValue(record);  toEdit(record)}} style={{textDecoration: "underline"}} >编辑</a>
            }
            <a onClick={() => {goDetailPage(record)}} style={{textDecoration: "underline"}} >详情</a>
            {
              record.usedStatus == 1 ?
                <a onClick={() => {doClose(record)}} style={{textDecoration: "underline", color: "red"}} >禁用</a>:
                <a onClick={() => {doOpen(record)}} style={{textDecoration: "underline", color: "green"}} >启用</a>
            }
            {
              record.virtualType == 1 && btnCodeList.includes('ath-oil-web:oilCardInfo:unbind') ?
                <a onClick={() => {overBind(record)}} style={{textDecoration: "underline", color: "green"}} >解绑</a>: ''
            }
            {
              record.fleetId ?  <a onClick={() => {unRelationTeam(record)}} style={{textDecoration: "underline"}} >解除关联</a> :
                <a onClick={() => {setCurrentRow(record); relationTeam(record)}} style={{textDecoration: "underline"}} >关联车队</a>
            }
          </Space>
        )
      }
    },
  ];
  // 业务方法
  let unRelationTeam = (record) => {
    confirm({
      title: '确定要解除关联吗？',
      content: '',
      onOk() {
        let values = {id: record.id,  companyId:record.companyId};
        fleetDisassociation(values).then((resp) => {
          queryTable();
        });
      },
    });
  };
  let relationTeam = (record) => {
    setIsTeamModalOpen(true);
    teamHandleSearch('', record.companyId);
  };
  const teamOnFinish = async (values) => {
    console.log('Success--:', values);
    fleetAssociation({
      ...values,
      id: currentRow.id,
      companyId: currentRow.companyId,
    }).then(() => {
      modalCancel();
      queryTable();
    });
  }
  let toAdd = () => {
    handleSearch('');
    setCurrentRow( {});
    modalForm.resetFields();
    editFlag = 'add';
    setIsModalOpen(true);
  };
  let toEdit = (record) => {
    handleSearch(record.companyName);
    setVirtualTypeFlag(record.validateType);
    editFlag = 'edit';
    setIsModalOpen(true);
  };
  let doClose = (record) => {
    confirm({
      title: '确定要禁用？',
      content: '禁用后，数据将不会在企业端展示，请谨慎操作！',
      onOk() {
        let values = {...record,id: record.id, driverIdNo: record.idNo, driverCarNo:record.carNo, usedStatus: 2};
        modifyCardRelation(values).then((resp) => {
          console.log('ok');
          queryTable();
        });
      },
    });
  };
  let overBind = (record) => {
    confirm({
      title: '确定要解绑？',
      content: '解绑操作前，请确认未实际使用，否则将影响数据的关联和，请确认是否继续解绑？',
      onOk() {
        oilCardInfoUnbind({id: record.id}).then((resp) => {
          queryTable();
        });
      },
    });
  };
  let doOpen = (record) => {
    confirm({
      title: '确定要启用？',
      content: '启用后，数据将会在企业端展示，请谨慎操作',
      onOk() {
        let values = {...record,id: record.id, driverIdNo: record.idNo, driverCarNo:record.carNo, usedStatus: 1};
        modifyCardRelation(values).then((resp) => {
          console.log('ok');
          queryTable();
        });
      },
    });
  };
  let goDetailPage = (record) => {
    navigate(`/ath-oil-web-front/driverCardDetail?record=${JSON.stringify(record)}`)
  };
  const modalCancel = () => {
    modalForm.resetFields();
    teamModalForm.resetFields();
    setIsModalOpen(false);
    setIsTeamModalOpen(false);
  };
  const onFinish = async (values) => {
    console.log('Success--:', values);
    values = {
      ...values,
      freeMonth: currentRow.freeMonth,
      freeAmount: currentRow.freeAmount,
      freeState: currentRow.freeState,
      usedStatus: 1,
    };
    let resp = await cardSearch({
      companyId: values.companyId,
      phone: values.phoneNo,
      virtualType: values.virtualType,
      id: currentRow.id,
      searchCardNo: values.cardNo? values.cardNo : '',
    })
    if (editFlag === 'add') {
      if (resp.data && resp.data.usedStatus == 1) {
        confirm({
          title: '重要提示',
          content: '手机号已存在，请确认后重新输入',
          okText: '我知道了',
          cancelText: '',
          cancelButtonProps: {
            style: {display: 'none'},
          },
        });
      } else if (resp.data && resp.data.usedStatus == 2) {
        confirm({
          title: '重要提示',
          content: '手机号已存在但被禁用，请问是否启用并更新数据',
          okText: '启用',
          onOk: () => {
            values = {...values,id: resp.data.id, driverIdNo: values.idNo, driverCarNo:values.carNo, usedStatus: 1};
            modifyCardRelation(values).then((resp) => {
              queryTable();
              setIsModalOpen(false);
            });
          },
        });
      } else {
        await subcardGeneration(values);
        messageApi.success('操作成功');
        setIsModalOpen(false);
        await queryTable();
      }
    } else if (editFlag === 'edit') {
      if (!resp.data) { // 接口返回null，就是手机号没被修改
        values = {...values, id: currentRow.id};
        await updateCardGeneration(values);
        messageApi.success('操作成功');
        setIsModalOpen(false);
        await queryTable();
      } else if (resp.data && resp.data.usedStatus == 1) {
        confirm({
          title: '重要提示',
          content: '手机号已存在，请确认后重新输入',
          okText: '我知道了',
          cancelText: '',
          cancelButtonProps: {
            style: {display: 'none'},
          },
        });
      } else if (resp.data && resp.data.usedStatus == 2) {
        confirm({
          title: '重要提示',
          content: '手机号已存在但被禁用，请问是否启用并更新数据',
          okText: '启用',
          onOk: () => {
            values = {...values,id: resp.data.id, driverIdNo: values.idNo, driverCarNo:values.carNo, usedStatus: 1};
            modifyCardRelation(values).then((resp) => {
              queryTable();
              setIsModalOpen(false);
            });
          },
        });
      }
    }
  };
  const uploadProps = {
    beforeUpload: (file) => {
      const formData = new FormData();
      formData.append('file', file);
      setUploading(true);
      oilCardInfoImport(formData).then((resp) => {
        messageApi.success('导入成功');
        queryTable();
        setFileList([]);
      }).finally(() => {
        setUploading(false);
      });
      return false;
    },
    showUploadList: false, // 不展示上传后文件列表
    fileList,
    accept: '.xlsx,.xls',
  };
  // 下拉远程查询
  const handleSearch = (newValue) => {
    // applyState 3 已签约合作
    oilUserCompanyInfoList({companyName: newValue, applyState: '3'}).then((resp) => {
      if (resp?.data?.length) {
        const optionData = resp.data.map((item) => ({
          value: `${item.id}`,
          text: item.companyName,
          idTypeName: item.idTypeName,
          companyNo: item.idNo,
        }));
        setApiOptionData(optionData.slice(0,200)); // 最大下拉200条
      } else {
        setApiOptionData([]);
      }
    });
  };
  // 下拉远程查询车队
  const teamHandleSearch = (newValue, companyId) => {
    console.log('newValue', newValue, '=====', companyId)
    oilUserFleetInfoPage({companyId: companyId || currentRow.companyId, fleetName: newValue, pageIndex:0, pageSize:200}).then((resp) => {
      if (resp?.data?.length) {
        const optionData = resp.data.map((item) => ({
          value: `${item.id}`,
          text: item.fleetName,
        }));
        setTeamApiOptionData(optionData);
      } else {
        setTeamApiOptionData([]);
      }
    });
  };
  let handleChange = (newValue) => {
    let data =apiOptionData.filter((item) => {
      if (newValue == item.value) {
        return {
          idTypeName: item.idTypeName,
          companyNo: item.companyNo,
        }
      }
    });
    modalForm.setFieldsValue({...currentRow,...data[0]} );
  };
  let handleChangeCompany = (newValue) => {
    modalForm.setFieldsValue({cardNo: ''} );
    getViceNoByOilCompanyName({oilCompanyName: newValue}).then((resp) => {
      if (resp?.data?.length) {
        const optionData = resp.data.map((item) => ({
          value: item,
          text: item,
        }));
        setOilCardNoOption(optionData.slice(0,200)); // 最大下拉200条
      } else {
        setOilCardNoOption([]);
      }
    });
  };
  let toExport = () => {
    exportFiles('/ath-oil-web/oilCardInfo/export', {...searchData});
  }
  let getTemplate = () => {
    window.open('./sjfk-template.xlsx'); // 线上环境需要相对路径
  };
  let changeVirtualType = (e) => {
    if (e.target.value == 1) { // 实体卡
      setVirtualTypeFlag('1');
    } else { // 电子卡
      setVirtualTypeFlag('2');
    }
  };
  // 默认调用的方法
  let queryTable = async () => {
    console.log('queryData:', searchData)
    let resp = await oilCardInfoQueryPages({...searchData, pageIndex:0, pageSize:200});
    setDataSource(resp?.data);
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
            <Input placeholder="请输入" allowClear value={searchData.phoneNo} onChange={(e) => {setSearchData({...searchData,phoneNo: e.target.value})}}/>
          </div>
          <div className={'search-item'}>
            <span>关联状态</span>
            <Select
              allowClear
              placeholder="请选择"
              value={searchData.validateType}
              className={'select-input'}
              onChange={(e) => {setSearchData({...searchData, validateType: e})}}
              options={[
                { value: '1', label: '已关联' },
                { value: '0', label: '未关联' },
              ]}
            />
          </div>
          <div className={'search-item'}>
            <span style={{width: '130px'}}>关联公司</span>
            <Select
              allowClear
              style={{width: '280px'}}
              className={'select-input'}
              value={searchData.oilCompanyName}
              placeholder="请选择"
              onChange={(e) => {setSearchData({...searchData, oilCompanyName: e})}}
              options={oilCompanyOption}
            />
          </div>
          <div className={'search-item'}>
            <span>类型</span>
            <Select
              allowClear
              placeholder="请选择"
              value={searchData.virtualType}
              className={'select-input'}
              onChange={(e) => {setSearchData({...searchData, virtualType: e})}}
              options={[
                { value: '1', label: '实体卡' },
                { value: '2', label: '电子卡' },
              ]}
            />
          </div>
          <div className={'search-item'}>
            <span>状态</span>
            <Select
              allowClear
              placeholder="请选择"
              value={searchData.usedStatus}
              className={'select-input'}
              onChange={(e) => {setSearchData({...searchData, usedStatus: e})}}
              options={[
                { value: '', label: '全部' },
                { value: '1', label: '使用中' },
                { value: '2', label: '已禁用' },
              ]}
            />
          </div>
        </div>
        <div className={'search-btn-line'}>
          <Button type="primary" onClick={queryTable}>查询</Button>
          <Button onClick={() => setSearchData({})}>重置</Button>
        </div>
      </div>
      <div style={{display: 'flex'}}>
        <Button type="primary" onClick={toAdd} style={{margin: '10px 0'}}>生成卡</Button>
        <Upload {...uploadProps}>
          <Button
            type="primary"
            style={{margin: '10px 4px'}}
            loading={uploading}>
            {uploading ? 'Uploading' : 'excel导入生成卡'}
          </Button>
        </Upload>
        <Button type="primary" onClick={getTemplate} style={{margin: '10px 4px'}}>卡模板下载</Button>
        <Button type="primary" onClick={toExport} style={{margin: '10px 0'}}>导出</Button>
      </div>
      <Table dataSource={dataSource} columns={columns} rowKey="id" size="small" scroll={{x: 2000,}}/>
      <Modal title="副卡" open={isModalOpen} width={'700px'} footer={null} closable={false}>
        <Form
          form={modalForm}
          name="basic"
          onFinish={onFinish}
          autoComplete="off"
        >
          <div className={'form-row'}>
            <Form.Item label="用户名称"
                       rules={[
                         { required: true, message: '必填'},
                       ]}
                       className={'label-item'} name="companyId">
              <Select
                allowClear
                disabled={currentRow.validateType == 1}
                showSearch
                placeholder='请输入查询'
                style={{width: '172px'}}
                defaultActiveFirstOption={false}
                filterOption={false}
                onSearch={handleSearch}
                onChange={handleChange}
                notFoundContent={null}
                options={(apiOptionData || []).map((d) => ({
                  value: d.value,
                  label: d.text,
                }))}
              />
            </Form.Item>
            <Form.Item label="证件类型"
                       className={'label-item'} name="idTypeName">
              <Input disabled />
            </Form.Item>
          </div>
          <div className={'form-row'}>
            <Form.Item label="证件号码" className={'label-item'} name="companyNo">
              <Input disabled style={{width: '502px'}} />
            </Form.Item>
          </div>
          <div className={'form-row'}>
            <Form.Item label="车牌号"
                       rules={[
                         { required: true, message: '必填'},
                       ]}
                       className={'label-item'} name="plateColor">
              <Select
                placeholder="请选择"
                style={{width: '120px'}}
                options={carColorOption}
              />
            </Form.Item>
            <Form.Item label=""
                       rules={[
                         { required: true, message: '必填'},
                         { pattern: /^.{1,12}$/, message: '最大可输入12位'}
                       ]}
                       className={'label-item'} name="carNo">
              <Input style={{width: '160px'}} />
            </Form.Item>
            <Form.Item label="姓名"
                       rules={[
                         { required: true, message: '必填'},
                         { pattern: /^.{1,20}$/, message: '最大可输入20字符'}
                       ]}
                       className={'label-item'} name="driverName">
              <Input />
            </Form.Item>
          </div>
          <div className={'form-row'}>
            <Form.Item label="身份证号"
                       rules={[
                         { required: true, message: '必填'},
                         { pattern: /(^\d{15}$)|(^\d{17}([0-9]|X)$)/, message: '身份证格式不符合'}
                       ]}
                       className={'label-item'} name="idNo">
              <Input />
            </Form.Item>
            <Form.Item label="手机号码"
                       rules={[
                         { required: true, message: '必填'},
                         { pattern: /^.{1,15}$/, message: '最大可输入15字符'},
                         { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的字符'},
                       ]}
                       className={'label-item'} name="phoneNo">
              <Input />
            </Form.Item>
          </div>
          <div className={'form-row'}>
            <Form.Item label="属性"
                       rules={[
                         { required: true, message: '必填'},
                       ]}
                       className={'label-item'} name="driverAttributeType">
              <Select
                placeholder="请选择"
                style={{width: '120px'}}
                options={[
                  {
                    label: '自有',
                    value: '1',
                  }, {
                    label: '外协',
                    value: '2',
                  }
                ]}
              />
            </Form.Item>
          </div>
          <div className={'form-row'}>
            <Form.Item label="关联卡类型"
                       rules={[
                         { required: true, message: '必填'},
                       ]}
                       className={'label-item'} name="virtualType">
              <Radio.Group disabled={currentRow.validateType == 1} onChange={changeVirtualType}>
                <Radio value={'1'}>实体卡</Radio>
                <Radio value={'2'}>电子卡</Radio>
              </Radio.Group>
            </Form.Item>
          </div>
          {virtualTypeFlag === '1'?
            <div className={'form-row'}>
              <Form.Item label="关联公司"
                         rules={[
                           { required: true, message: '必填'},
                         ]}
                         className={'label-item'} name="oilCompanyName">
                <Select
                  disabled={currentRow.validateType == 1}
                  placeholder="请选择"
                  style={{width: '180px'}}
                  onChange={handleChangeCompany}
                  options={oilEntityCompanyOption}
                />
              </Form.Item>
              <Form.Item label="关联卡号"
                         rules={[
                           { required: true, message: '必填'},
                         ]}
                         className={'label-item'} name="cardNo">
                <Select
                  showSearch
                  disabled={currentRow.validateType == 1}
                  allowClear
                  placeholder="请选择"
                  options={oilCardNoOption}
                  style={{width: '220px'}}
                  filterOption={(input, option) =>
                    (option?.text ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            </div>
            :
            <div></div>
          }
          <div className={'modal-footer'}>
            <Button type="primary" htmlType="submit"> 确认提交 </Button>
            <Button onClick={modalCancel}> 取消 </Button>
          </div>
        </Form>
      </Modal>
      <Modal title="关联车队" open={isTeamModalOpen} width={'500px'} footer={null} closable={false}>
        <Form
          form={teamModalForm}
          name="basic"
          onFinish={teamOnFinish}
          autoComplete="off"
        >
          <div className={'form-row'}>
            <Form.Item label="车队名称"
                       rules={[
                         { required: true, message: '必填'},
                       ]}
                       className={'label-item'} name="fleetId">
              <Select
                allowClear
                showSearch
                placeholder='请输入查询'
                style={{width: '300px'}}
                defaultActiveFirstOption={false}
                filterOption={false}
                onSearch={teamHandleSearch}
                notFoundContent={null}
                options={(teamApiOptionData || []).map((d) => ({
                  value: d.value,
                  label: d.text,
                }))}
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
