import {Row, Col, Table, Space} from 'antd';
import {getQueryStringArgs} from '../../tool/index';
import {useEffect, useState} from "react";
import {oilOperationLogQueryPages} from '../../service/interface';

let detail = () => {
  let [detailData, setDetailData] = useState({});
  let [dataSource, setDataSource] = useState([]);
  useEffect(() => { initData(); }, []);

  // 静态数据
  const columns = [
    {
      title: '操作类型',
      dataIndex: 'operationType',
      render: (_, record) => {
        let operationTypeDic = {
          1: '新增',
          2: '修改',
          3: '删除',
          5: '启用',
          6: '禁用',
        };
        return (<span>{operationTypeDic[record.operationType]}</span>)
      }
    }, {
      title: '操作内容',
      dataIndex: 'content',
    }, {
      title: '操作人',
      dataIndex: 'creatorName',
    }, {
      title: '操作时间',
      dataIndex: 'createTime',
    },
  ];
  const validateTypeDic = {
    0:'未关联',
    1: '已关联'
  };
  const virtualType = {
    1:'实体卡',
    2: '电子卡'
  };
  const typeDic = {
    1: '使用中',
    2: '已禁用',
  };
  let driverAttributeTypeDic = {
    1: '自有',
    2: '外协',
  };
  const goBack = () => {
    history.go(-1);
  };
  // 默认调用
  let initData = async () => {
    let args = getQueryStringArgs();
    let data = JSON.parse(args['record']);
    // debugger
    setDetailData(data);
    // businessType 1.司机副卡2.加油站
    let resp = await oilOperationLogQueryPages({relevanceId: data.id, businessType: 1, pageIndex: 0, pageSize: 2000});
    setDataSource(resp.data);
  }
  return (
    <>
      <div style={{minHeight: '84vh', backgroundColor: '#fff'}}>
        <div className={'normal-menu'}>司机副卡管理 / 查看详情</div>
        <div className={'normal-card'}>
          <div style={{cursor: "pointer", fontWeight: 500}} onClick={goBack}>&nbsp;&nbsp;返 回</div>
          <div className={'normal-title'}>司机副卡信息</div>
          <div className={'normal-head'} style={{padding: '0 40px'}}>
            <Row>
              <Col span={8}>
                <span>副卡状态</span>{typeDic[detailData.usedStatus]}
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <span>司机姓名</span>{detailData.driverName}
              </Col>
              <Col span={8}>
                <span>司机手机号</span>{detailData.phoneNo}
              </Col>
              <Col span={8}>
                <span>车牌号</span>{detailData.carNo} { detailData.plateColorStr? `- ${detailData.plateColorStr}` : '' }
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <span>副卡虚拟户</span>{detailData.virtualAccount}
              </Col>
              <Col span={8}>
                <span>副卡虚户余额</span>{detailData.oilAmount}
              </Col>
              <Col span={8}>
                <span>油品用户名称</span>{detailData.companyName}
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <span>关联油卡类型</span>{virtualType[detailData.virtualType]}
              </Col>
              <Col span={8}>
                <span>小程序登录账号</span>{detailData.phoneNo}
              </Col>
              <Col span={8}>
                <span>关联状态</span>{validateTypeDic[detailData.validateType]}
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <span>司机属性</span>{driverAttributeTypeDic[detailData.driverAttributeType]}
              </Col>
            </Row>
          </div>
        </div>
        <div className={'normal-card'} style={{marginTop: '20px'}}>
          <div className={'normal-title'}>操作日志</div>
          <Table dataSource={dataSource} columns={columns} rowKey="id" size="small" style={{padding: '10px 40px'}}/>
        </div>
      </div>
    </>
  )
}
export default detail;
