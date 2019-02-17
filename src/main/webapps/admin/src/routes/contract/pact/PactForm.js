import React from 'react'
import classNames from 'classnames'
import {Link} from 'react-router-dom'
import {connect} from 'dva'
import {Form, DatePicker, Button, Radio} from 'antd'
import moment from 'moment'
import SimpleSelect from '../../../compoment/SimpleSelect'
import ProjectSelect from '../../../compoment/ProjectSelect'
import AccCodeSelect from '../../../compoment/AccCodeSelect'
import CompanySelect from '../../../compoment/CompanySelect'
import DocumentTitle from '../../../compoment/DocumentTitle'
import NumberFormat from 'react-number-format'
import {getMoneyValue, getPercentValue, getTextInitialValue} from "../../../utils/util"
import './pact.css'

const RadioGroup = Radio.Group

const Component = ({
                     location, dispatch, model, loading,
                     form: {
                       getFieldDecorator,
                       validateFields,
                       getFieldsValue,
                       getFieldError,
                       resetFields,
                     },
                   }) => {

  const {execStates, payTypes, payModes, pact, payType, payMode} = model
  const isEdit = pact.pactNo !== undefined
  const payElements = {
    pactSum: payMode !== 0 && payMode !== undefined,
    auditSum: payMode !== 0 && payMode !== undefined,
    monthPay: [3, 4].includes(payMode),
    prePercent: payMode === 5,
    payContent: payMode === 0,
  }

  let errors = {}

  const onSubmit = (e) => {
    e.preventDefault()
    validateFields((errors) => {
      if (errors) {
        return
      }
      const {auditSum, pactSum, monthPay, prePercent, signDate, signDate2, ...values} = getFieldsValue()
      dispatch({
        type: 'pactForm/save',
        payload: {
          ...values,
          signDate: signDate && signDate.format('Y-MM-DD'),
          signDate2: signDate2 && signDate2.format('Y-MM-DD'),
          auditSum: getMoneyValue(auditSum),
          pactSum: getMoneyValue(pactSum),
          monthPay: getMoneyValue(monthPay),
          prePercent: getPercentValue(prePercent),
        }
      })
    })
  }

  const onChangePayType = ({target}) => {
    const {value: payType} = target
    dispatch({
      type: 'pactForm/updateState',
      payload: {
        payType,
        payMode: payType === 0 ? undefined : (payMode || 0),
      }
    })
  }

  const onChangePayMode = ({target}) => {
    dispatch({
      type: 'pactForm/updateState',
      payload: {
        payMode: target.value,
      }
    })
  }

  return (
    <DocumentTitle title='合同管理'>
      <div className="contract-module">
        <section className="projectList">
          <div className="container">
            <ol className="breadcrumb">
              <li>当前位置：</li>
              <li>
                <Link to="/contract">合同管理</Link>
              </li>
              <li className="active">{`${isEdit ? '修改' : '新增'}合同`}</li>
            </ol>
            <div className="row">
              <div className="col-xs-12 whiteBg">
                <div className="addContractForm">
                  <form className="form-horizontal" onSubmit={onSubmit}>
                    <h3 className="contractTitle">合同内容</h3>
                    <div className="row">
                      <div className="col-md-7">
                        <div className={classNames({'form-group': true, 'has-error': !!getFieldError('type2')})}>
                          <label className="col-sm-3 control-label">项目名称：</label>
                          <div className="col-sm-9">
                            {getFieldDecorator('type2', {
                              initialValue: pact.type2,
                              rules: [{required: true, message: '请选择项目'}],
                            })(<ProjectSelect size="large" disabled={isEdit} placeholder="请选择"/>)}
                            <span className="help-block">
                              {(errors.type2 = getFieldError('type2')) ? errors.type2.join(',') : null}
                            </span>
                          </div>
                        </div>
                        <div className={classNames({'form-group': true, 'has-error': !!getFieldError('type1')})}>
                          <label className="col-sm-3 control-label">项目类别：</label>
                          <div className="col-sm-9">
                            {getFieldDecorator('type1', {
                              initialValue: pact.type1,
                              rules: [{required: true, message: '请选择类别'}],
                            })(<AccCodeSelect size="large" disabled={isEdit} placeholder="请选择"/>)}
                            <span className="help-block">
                              {(errors.type1 = getFieldError('type1')) ? errors.type1.join(',') : null}
                            </span>
                          </div>
                        </div>
                        <div className="form-group">
                          <div className={classNames({'has-error': !!getFieldError('serialNo')})}>
                            <label className="col-sm-3 control-label">合同编号：</label>
                            <div className="col-sm-4">
                              {getFieldDecorator('serialNo', {
                                initialValue: getTextInitialValue(pact.serialNo),
                                rules: [
                                  {required: true, pattern: /^\d{1,16}$/, message: '不能为空，长度不能大于16位的数字'},
                                ],
                              })(<input type="text" className="form-control" placeholder="合同编号"/>)}
                              <span className="help-block">
                              {(errors.serialNo = getFieldError('serialNo')) ? errors.serialNo.join(',') : null}
                            </span>
                            </div>
                          </div>
                          <div className={classNames({'has-error': !!getFieldError('serialCode')})}>
                            <div className="col-sm-5">
                              {getFieldDecorator('serialCode', {
                                initialValue: getTextInitialValue(pact.serialCode),
                                rules: [
                                  {required: true, pattern: /^\d{1,10}$/, message: '不能为空，长度不能大于10位的数字'},
                                ],
                              })(<input type="text" className="form-control" placeholder="分类编号"/>)}
                              <span className="help-block">
                              {(errors.serialCode = getFieldError('serialCode')) ? errors.serialCode.join(',') : null}
                            </span>
                            </div>
                          </div>
                        </div>
                        <div className={classNames({'form-group': true, 'has-error': !!getFieldError('name')})}>
                          <label className="col-sm-3 control-label">名称：</label>
                          <div className="col-sm-9">
                            {getFieldDecorator('name', {
                              initialValue: getTextInitialValue(pact.name),
                              rules: [{required: true, message: '名称不能为空'}],
                            })(<input type="text" className="form-control" placeholder="请输入"/>)}
                            <span className="help-block">
                              {(errors.name = getFieldError('name')) ? errors.name.join(',') : null}
                            </span>
                          </div>
                        </div>

                        <div className={classNames({'form-group': true, 'has-error': !!getFieldError('compA')})}>
                          <label className="col-sm-3 control-label">甲方：</label>
                          <div className="col-sm-9">
                            {getFieldDecorator('compA', {
                              initialValue: pact.compA,
                              rules: [{required: true, message: '请选择'}],
                            })(<CompanySelect size="large" showSearch placeholder="请选择"/>)}
                            <span className="help-block">
                              {(errors.compA = getFieldError('compA')) ? errors.compA.join(',') : null}
                            </span>
                          </div>
                        </div>

                        <div className={classNames({'form-group': true, 'has-error': !!getFieldError('compB')})}>
                          <label className="col-sm-3 control-label">乙方：</label>
                          <div className="col-sm-9">
                            {getFieldDecorator('compB', {
                              initialValue: pact.compB,
                              rules: [{required: true, message: '请选择'}],
                            })(<CompanySelect size="large" showSearch placeholder="请选择"/>)}
                            <span className="help-block">
                              {(errors.compB = getFieldError('compB')) ? errors.compB.join(',') : null}
                            </span>
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="col-sm-3 control-label">丙方：</label>
                          <div className="col-sm-9">
                            {getFieldDecorator('compC', {
                              initialValue: pact.compC,
                            })(<CompanySelect size="large" showSearch allowClear placeholder="请选择"/>)}
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="col-sm-3 control-label">丁方：</label>
                          <div className="col-sm-9">
                            {getFieldDecorator('compD', {
                              initialValue: pact.compD,
                            })(<CompanySelect size="large" showSearch allowClear placeholder="请选择"/>)}
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="col-sm-3 control-label">日期：</label>
                          <div className="col-sm-4">
                            {getFieldDecorator('signDate', {
                              initialValue: pact.signDate ? moment(pact.signDate) : null,
                            })(<DatePicker size="large" style={{width: '100%'}} placeholder="开始日期"/>)}
                          </div>
                          <div className="col-sm-5">
                            {getFieldDecorator('signDate2', {
                              initialValue: pact.signDate2 ? moment(pact.signDate2) : null,
                            })(<DatePicker size="large" style={{width: '100%'}} placeholder="结束日期"/>)}
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="col-sm-3 control-label">经办人：</label>
                          <div className="col-sm-4">
                            {getFieldDecorator('transactor1', {
                              initialValue: getTextInitialValue(pact.transactor1),
                            })(<input type="text" className="form-control" placeholder="授权经办人"/>)}
                          </div>
                          <div className="col-sm-5">
                            {getFieldDecorator('transactor2', {
                              initialValue: getTextInitialValue(pact.transactor2),
                            })(<input type="text" className="form-control" placeholder="批准人"/>)}
                          </div>
                        </div>
                        <div className={classNames({'form-group': true, 'has-error': !!getFieldError('execState')})}>
                          <label className="col-sm-3 control-label">执行状态：</label>
                          <div className="col-sm-4">
                            {getFieldDecorator('execState', {
                              initialValue: pact.execState,
                              rules: [{required: true, message: '请选择执行状态'}],
                            })(<SimpleSelect size="large" list={execStates} placeholder="请选择"/>)}
                            <span className="help-block">
                              {(errors.execState = getFieldError('execState')) ? errors.execState.join(',') : null}
                            </span>
                          </div>
                          <label className="col-sm-2 control-label">签订日期：</label>
                          <div className="col-sm-3">
                            {getFieldDecorator('signDate3', {
                              initialValue: pact.signDate3 ? moment(pact.signDate3) : null,
                            })(<DatePicker size="large" style={{width: '100%'}} placeholder="签订日期"/>)}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-5">
                        <div className="form-group">
                          <label className="col-sm-3 control-label">档案代码：</label>
                          <div className="col-sm-8">
                            <input type="text" className="form-control" value={pact.pactNo} readOnly/>
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="col-sm-3 control-label">合同代码：</label>
                          <div className="col-sm-8">
                            <input type="text" className="form-control" value={pact.pactNumber} readOnly/>
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="col-sm-3 control-label">主要内容：</label>
                          <div className="col-sm-8">
                            {getFieldDecorator('subject', {
                              initialValue: getTextInitialValue(pact.subject),
                            })(<textarea className="form-control" rows="5" placeholder="请输入主要内容"/>)}
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="col-sm-3 control-label">履行评价：</label>
                          <div className="col-sm-8">
                            {getFieldDecorator('remark', {
                              initialValue: getTextInitialValue(pact.remark),
                            })(<textarea className="form-control" rows="5" placeholder="请输入履行评价"/>)}
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="col-sm-3 control-label">变更、解除、纠纷情况：</label>
                          <div className="col-sm-8">
                            {getFieldDecorator('updateNote', {
                              initialValue: getTextInitialValue(pact.updateNote),
                            })(<textarea className="form-control" rows="5" placeholder="请输入变更、解除、纠纷情况"/>)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <h3 className="contractTitle" style={{borderTop: '1px solid #ddd'}}>付款信息</h3>
                    <div className="row">
                      <div className="col-md-7 popPaymentI">
                        <div className="form-group">
                          <label className="col-sm-3 control-label"/>
                          <div className="col-sm-9">
                            {getFieldDecorator('payType', {
                              initialValue: payType,
                            })(<RadioGroup onChange={onChangePayType}>{
                              payTypes.map((item) => <Radio key={item.id} value={item.id}>{item.name}</Radio>)
                            }</RadioGroup>)}
                          </div>
                        </div>
                        {payType !== 0 && <div className="form-group">
                          <label className="col-sm-3 control-label"/>
                          <div className="col-sm-9">
                            {getFieldDecorator('payMode', {
                              initialValue: payMode,
                            })(<RadioGroup style={{whiteSpace: 'nowrap'}} buttonStyle="solid" onChange={onChangePayMode}>{
                              payModes.map((item) => <Radio.Button key={item.id} value={item.id}>{item.name}</Radio.Button>)
                            }</RadioGroup>)}
                          </div>
                        </div>}
                        {payElements.pactSum && <div className={classNames({'form-group': true, 'has-error': !!getFieldError('pactSum')})}>
                          <label className="col-sm-3 control-label">金额：</label>
                          <div className="col-sm-9">
                            {getFieldDecorator('pactSum', {
                              initialValue: pact.pactSum,
                              rules: [{required: true, message: '金额不能为空'}],
                            })(<NumberFormat className="form-control" placeholder="请输入" allowNegative={false} decimalScale={2} thousandSeparator={true}
                                             prefix={'￥'}/>)}
                            <span className="help-block">
                              {(errors.pactSum = getFieldError('pactSum')) ? errors.pactSum.join(',') : null}
                            </span>
                          </div>
                        </div>}
                        {payElements.auditSum && <div className={classNames({'form-group': true, 'has-error': !!getFieldError('auditSum')})}>
                          <label className="col-sm-3 control-label">审核金额：</label>
                          <div className="col-sm-9">
                            {getFieldDecorator('auditSum', {
                              initialValue: pact.auditSum,
                              rules: [{required: true, message: '审核金额不能为空'}],
                            })(<NumberFormat className="form-control" placeholder="请输入" allowNegative={false} decimalScale={2} thousandSeparator={true}
                                             prefix={'￥'}/>)}
                            <span className="help-block">
                              {(errors.auditSum = getFieldError('auditSum')) ? errors.auditSum.join(',') : null}
                            </span>
                          </div>
                        </div>}
                        {payElements.monthPay && <div className={classNames({'form-group': true, 'has-error': !!getFieldError('monthPay')})}>
                          <label className="col-sm-3 control-label">月租金：</label>
                          <div className="col-sm-9">
                            {getFieldDecorator('monthPay', {
                              initialValue: pact.monthPay,
                              rules: [{required: true, message: '月租金不能为空'}],
                            })(<NumberFormat className="form-control" placeholder="请输入" allowNegative={false} decimalScale={2} thousandSeparator={true}
                                             prefix={'￥'}/>)}
                            <span className="help-block">
                              {(errors.monthPay = getFieldError('monthPay')) ? errors.monthPay.join(',') : null}
                            </span>
                          </div>
                        </div>}
                        {payElements.payContent && <div className={classNames({'form-group': true, 'has-error': !!getFieldError('payContent')})}>
                          <label className="col-sm-3 control-label">付款说明：</label>
                          <div className="col-sm-9">
                            {getFieldDecorator('payContent', {
                              initialValue: pact.payContent,
                              rules: [{required: true, max: 50, message: '付款说明不能为空，并且长度限制50字之内'}],
                            })(<textarea className="form-control" rows={3} placeholder="请输入付款说明"/>)}
                            <span className="help-block">
                              {(errors.payContent = getFieldError('payContent')) ? errors.payContent.join(',') : null}
                            </span>
                          </div>
                        </div>}
                        {payElements.prePercent && <div className={classNames({'form-group': true, 'has-error': !!getFieldError('prePercent')})}>
                          <label className="col-sm-3 control-label">预收付：</label>
                          <div className="col-sm-9">
                            {getFieldDecorator('prePercent', {
                              initialValue: pact.prePercent,
                              rules: [{required: true, message: '预收付不能为空'}],
                            })(<NumberFormat className="form-control" placeholder="%" allowNegative={false} decimalScale={0} thousandSeparator={true}
                                             suffix={'%'} />)}
                            <span className="help-block">
                              {(errors.prePercent = getFieldError('prePercent')) ? errors.prePercent.join(',') : null}
                            </span>
                          </div>
                        </div>}
                      </div>
                    </div>
                    <div className="form-group contractBtnGroup">
                      <div className="col-sm-12">
                        <Button type="primary" htmlType="submit" size="large" className="btn btn-primary" loading={loading.effects['pactForm/save']}>
                          完成并保存
                        </Button>
                        <button type="reset" className="btn btn-default" onClick={() => resetFields()}>重置</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DocumentTitle>
  )
}

export default connect((models) => {
  return {
    model: models.pactForm,
    loading: models.loading,
  }
})(Form.create()(Component))
