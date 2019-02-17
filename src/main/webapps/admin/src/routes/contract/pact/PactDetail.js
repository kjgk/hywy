import React from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'dva'
import classNames from 'classnames'
import {Modal, Skeleton} from 'antd'
import NumberFormat from 'react-number-format'
import DateFormatter from '../../../compoment/DateFormatter'
import DocumentTitle from '../../../compoment/DocumentTitle'
import PaymentModal from "./PaymentModal"
import AttachModal from "./AttachModal"
import {contentPath} from "../../../utils/config"
import './pact.css'

const Component = ({
                     location, dispatch, pactForm, pactDetail, payment, loading,
                   }) => {

  const {execStates} = pactForm
  const {pact, tabActive, attachList, attachModalVisible, attachProgress} = pactDetail
  const {currentItem, modalVisible, modalType, list: paymentList} = payment
  const {pactNo} = pact

  const showPayment = pact.payType !== 0

  const paymentModalProps = {
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects[`payment/${modalType}`],
    title: modalType === 'create' ? `添加付款信息` : `编辑付款信息`,
    onOk(data) {
      dispatch({
        type: `payment/${modalType}`,
        payload: {
          ...data,
          pactNo,
        },
      }).then(() => {
        refreshPactDetail()
        refreshPaymentList()
      })
    },
    onCancel() {
      dispatch({
        type: `payment/hideModal`,
      })
    },
  }

  const attachModalProps = {
    visible: attachModalVisible,
    maskClosable: false,
    confirmLoading: loading.effects[`pactDetail/saveAttach`],
    title: '上传扫描页',
    attachProgress,
    onOk() {
      dispatch({
        type: `pactDetail/saveAttach`,
        payload: {
          pactNo,
        },
      }).then(refreshAttachList)
    },
    onCancel() {
      dispatch({
        type: `pactDetail/hideAttachModal`,
      })
    },
    onChange(payload) {
      dispatch({
        type: `pactDetail/onAttachUploadChange`,
        payload,
      })
    },
  }

  const getExecStateName = () => {
    for (let {id, name} of execStates) {
      if (id === pact.execState) {
        return name
      }
    }
  }

  const refreshPactDetail = () => {
    dispatch({
      type: `pactDetail/getPactDetail`,
      payload: {
        pactNo,
      },
    })
  }

  const refreshPaymentList = () => {
    dispatch({
      type: 'payment/query',
      payload: {
        pactNo,
        pageSize: 2000,
      },
    })
  }

  const refreshAttachList = () => {
    dispatch({
      type: 'pactDetail/getAttachList',
      payload: {
        pactNo,
        pageSize: 2000,
      },
    })
  }

  const handleShowPayment = () => {
    dispatch({
      type: 'pactDetail/showPayment',
    })
  }

  const handleShowAttach = () => {
    dispatch({
      type: 'pactDetail/showAttach',
    })
  }

  const handleAddPayment = () => {
    dispatch({
      type: 'payment/showModal',
      payload: {
        modalType: 'create',
      },
    })
  }

  const handleEditPayment = (item) => {
    dispatch({
      type: 'payment/showModal',
      payload: {
        modalType: 'update',
        currentItem: item,
      },
    })
  }

  const handleDeletePayment = (item) => {
    Modal.confirm({
      title: '信息提示',
      content: '确定要删除该付款信息吗?',
      okType: 'danger',
      onOk() {
        dispatch({
          type: `payment/delete`,
          payload: item.payNo,
        }).then(() => {
          refreshPactDetail()
          refreshPaymentList()
        })
      },
    })
  }

  const handleAddAttach = () => {
    dispatch({
      type: 'pactDetail/showAttachModal',
      payload: {},
    })
  }

  const handleDeleteAttach = (item) => {
    Modal.confirm({
      title: '信息提示',
      content: '确定要删除该附件吗?',
      okType: 'danger',
      onOk() {
        dispatch({
          type: `pactDetail/deleteAttach`,
          payload: item.attachNo,
        }).then(refreshAttachList)
      },
    })
  }

  return (
    <DocumentTitle title='合同管理'>
      <section className="projectList">
        <div className="container">
          <ol className="breadcrumb">
            <li>当前位置：</li>
            <li>
              <Link to="/contract">合同管理</Link>
            </li>
            <li className="active">合同详情页</li>
          </ol>
          <div className="row">
            <div className="col-xs-12 whiteBg">
              <Skeleton loading={loading.effects[`pactDetail/getPactDetail`]}>
                <h2 className="contractDetailTitle">
                  {pact.projectName + ' ' + pact.name}
                  <Link to={`/contract/pact/${pactNo}/edit`} className="btnEdit">
                    <i className="fa fa-edit"/> 编辑项目 </Link>
                  <Link to={`/contract/pact/${pactNo}/preview`} target="_blank" className="btnEdit">
                    <i className="fa fa-print"/> 打印项目 </Link>
                </h2>
                <div className="contractDetial">
                  <table className="table table-bordered table-striped">
                    <tbody>
                    <tr>
                      <th width="15%">合同代码：</th>
                      <td width="35%">{pact.pactNumber}</td>
                      <th width="15%">档案代码：</th>
                      <td width="35%">{pact.pactNo}</td>
                    </tr>
                    <tr>
                      <th>合同编号：</th>
                      <td>{pact.serialNo + ' ' + (pact.serialCode || '')}</td>
                      <th>
                        {/*序号：*/}
                      </th>
                      <td></td>
                    </tr>
                    <tr>
                      <th>名称：</th>
                      <td>{pact.name}</td>
                      <th>主要内容：</th>
                      <td>{pact.subject}</td>
                    </tr>
                    <tr>
                      <th>甲方：</th>
                      <td>{pact.signA}</td>
                      <th>履行评价：</th>
                      <td>{pact.remark}</td>
                    </tr>
                    <tr>
                      <th>乙方：</th>
                      <td>{pact.signB}</td>
                      <th>变更、解除、纠纷情况</th>
                      <td>{pact.updateNote}</td>
                    </tr>
                    <tr>
                      <th>日期：</th>
                      <td>
                        <DateFormatter pattern="Y-MM-DD" value={pact.signDate}/> ~ <DateFormatter pattern="Y-MM-DD" value={pact.signDate2}/>
                      </td>
                      <th></th>
                      <td></td>
                    </tr>
                    <tr>
                      <th>经办人：</th>
                      <td>{pact.transactor1 + ' ' + pact.transactor2}</td>
                      <th></th>
                      <td></td>
                    </tr>
                    </tbody>
                  </table>
                  {
                    showPayment && <table className="table table-bordered table-striped projectAmount">
                      <tbody>
                      <tr>
                        <th>项目名称</th>
                        <th>金额</th>
                        <th>审核金额</th>
                        <th>已付</th>
                        <th>余额</th>
                        <th>百分比</th>
                        <th>执行状态</th>
                      </tr>
                      <tr>
                        <td>{pact.name}</td>
                        <td className="money">
                          <NumberFormat value={pact.pactSum} displayType={'text'} thousandSeparator={true} prefix={'￥'}/>
                        </td>
                        <td className="money">
                          <NumberFormat value={pact.auditSum} displayType={'text'} thousandSeparator={true} prefix={'￥'}/>
                        </td>
                        <td className={classNames({money: true, 'payment-status-1': pact.payType === 1, 'payment-status-2': pact.payType === 2})}>
                          <NumberFormat value={pact.auditSum - pact.balance} displayType={'text'} thousandSeparator={true} prefix={'￥'}/>
                        </td>
                        <td className="money">
                          <NumberFormat value={pact.balance} displayType={'text'} thousandSeparator={true} prefix={'￥'}/>
                        </td>
                        <td className="money">
                          <NumberFormat value={100.0 * (pact.auditSum - pact.balance) / pact.auditSum} decimalScale={2} displayType={'text'} suffix={'%'}/>
                        </td>
                        <td>{getExecStateName()}</td>
                      </tr>
                      </tbody>
                    </table>
                  }
                </div>
              </Skeleton>
              <ul className="nav nav-tabs contractDetialTabs">
                {showPayment && <li className={classNames({active: tabActive === 'payment'})}>
                  <a href="javascript:;" onClick={handleShowPayment}>付款信息表</a>
                </li>}
                <li className={classNames({active: tabActive === 'attach'})}>
                  <a href="javascript:;" onClick={handleShowAttach}>扫描页</a>
                </li>
              </ul>
              <div className="tab-content contractDetialContent">
                <div role="tabpanel" className={classNames({'tab-pane': true, active: tabActive === 'payment'})}>
                  <div className="operationBtn">
                    <button className="btn btn-default btnAdd" type="button" onClick={handleAddPayment}>
                      <i className="fa fa-file-text-o"/>新增付款信息
                    </button>
                  </div>
                  <div className="panel panel-default contractL">
                    <table className="table">
                      <thead>
                      <tr>
                        <th>序号</th>
                        <th>日期</th>
                        <th>凭证</th>
                        <th>类型</th>
                        <th>金额</th>
                        <th>备注</th>
                        <th>操作</th>
                        <th>打印表单</th>
                      </tr>
                      </thead>
                      <tbody>
                      {paymentList.map((item, index) =>
                        <tr key={item.payNo}>
                          <td>{index + 1}</td>
                          <td><DateFormatter pattern="Y-MM-DD" value={item.payDate}/></td>
                          <td>{item.warrant}</td>
                          <td>
                            {item.payType === 1 ? '收款' : '退款'}
                          </td>
                          <td>
                            <NumberFormat value={item.payCount} displayType={'text'} thousandSeparator={true} prefix={'￥'}/>
                          </td>
                          <td>
                            {item.remark}
                          </td>
                          <td className="operateBtn">
                            <a onClick={() => handleEditPayment(item)}><i className="fa fa-edit"/>编辑</a>
                            <a onClick={() => handleDeletePayment(item)}><i className="fa fa-trash-o"/>删除</a>
                          </td>
                          <td className="operateBtn">
                            <Link to={`/contract/payment/${item.payNo}/preview`} target="_blank"><i className="fa fa-print"/>付款审核表</Link>
                          </td>
                        </tr>
                      )}
                      {paymentList.length === 0 && <tr>
                        <td colSpan={8} style={{padding: 20, color: '#999999'}}>无付款信息</td>
                      </tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div role="tabpanel" className={classNames({'tab-pane': true, active: tabActive === 'attach'})}>
                  <div className="operationBtn">
                    <button className="btn btn-default btnAdd" type="button" onClick={handleAddAttach}>
                      <i className="fa fa-cloud-upload"/>上传扫描页
                    </button>
                  </div>
                  <div className="panel panel-default contractL">
                    <table className="table">
                      <thead>
                      <tr>
                        <th width="50">序号</th>
                        <th width="700">文件名称</th>
                        <th width="150">上传日期</th>
                        <th width="150">操作</th>
                      </tr>
                      </thead>
                      <tbody>
                      {attachList && attachList.map((item, index) =>
                        <tr key={item.attachNo}>
                          <td>{index + 1}</td>
                          <td>
                            <a target="_blank" href={contentPath + item.link}>{item.filename}</a>
                          </td>
                          <td>
                            <DateFormatter pattern="Y-MM-DD HH:mm" value={item.uploadTime}/>
                          </td>
                          <td className="operateBtn">
                            <a onClick={() => handleDeleteAttach(item)}><i className="fa fa-trash-o"/>删除</a>
                          </td>
                        </tr>
                      )}
                      {!attachList || attachList.length === 0 && <tr>
                        <td colSpan={8} style={{padding: 20, color: '#999999'}}>无附件信息</td>
                      </tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {modalVisible && <PaymentModal {...paymentModalProps} />}
        {attachModalVisible && <AttachModal {...attachModalProps} />}
      </section>
    </DocumentTitle>
  )
}

export default connect((models) => {
  return {
    pactForm: models.pactForm,
    pactDetail: models.pactDetail,
    payment: models.payment,
    loading: models.loading,
  }
})(Component)
