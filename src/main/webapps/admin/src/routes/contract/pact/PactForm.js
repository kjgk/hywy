import React from 'react'
import classNames from 'classnames'
import {Link} from 'react-router-dom'
import {connect} from 'dva'
import {Form, DatePicker, Button} from 'antd'
import moment from 'moment'
import SimpleSelect from '../../../compoment/SimpleSelect'
import ProjectSelect from '../../../compoment/ProjectSelect'
import AccCodeSelect from '../../../compoment/AccCodeSelect'
import CompanySelect from '../../../compoment/CompanySelect'
import DocumentTitle from '../../../compoment/DocumentTitle'
import NumberFormat from 'react-number-format'
import {getMoneyValue, getTextInitialValue} from "../../../utils/util"

const {RangePicker} = DatePicker;

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

  const {execStates, pact} = model
  const isEdit = pact.pactNo !== undefined

  let errors = {}

  const onSubmit = (e) => {
    e.preventDefault()
    validateFields((errors) => {
      if (errors) {
        return
      }

      const {auditSum, pactSum, signDates, ...values} = getFieldsValue()
      dispatch({
        type: 'pactForm/save',
        payload: {
          ...values,
          signDate: signDates[0] && signDates[0].format('Y-MM-DD'),
          signDate2: signDates[1] && signDates[1].format('Y-MM-DD'),
          auditSum: getMoneyValue(auditSum),
          pactSum: getMoneyValue(pactSum),
        }
      })
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
                      <div className="col-md-6">
                        <div className={classNames({'form-group': true, 'has-error': !!getFieldError('type2')})}>
                          <label className="col-sm-4 control-label">项目名称：</label>
                          <div className="col-sm-8">
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
                          <label className="col-sm-4 control-label">项目类别：</label>
                          <div className="col-sm-8">
                            {getFieldDecorator('type1', {
                              initialValue: pact.type1,
                              rules: [{required: true, message: '请选择类别'}],
                            })(<AccCodeSelect size="large" disabled={isEdit} placeholder="请选择"/>)}
                            <span className="help-block">
                              {(errors.type1 = getFieldError('type1')) ? errors.type1.join(',') : null}
                            </span>
                          </div>
                        </div>
                        <div className={classNames({'form-group': true, 'has-error': !!getFieldError('serialNo')})}>
                          <label className="col-sm-4 control-label">合同编号：</label>
                          <div className="col-sm-8">
                            {getFieldDecorator('serialNo', {
                              initialValue: getTextInitialValue(pact.serialNo),
                              rules: [
                                {required: true, pattern: /^\d{1,16}$/, message: '合同编号不能为空，并且长度不能大于16位的数字'},
                              ],
                            })(<input type="text" className="form-control" placeholder="请输入"/>)}
                            <span className="help-block">
                              {(errors.serialNo = getFieldError('serialNo')) ? errors.serialNo.join(',') : null}
                            </span>
                          </div>
                        </div>
                        <div className={classNames({'form-group': true, 'has-error': !!getFieldError('name')})}>
                          <label className="col-sm-4 control-label">名称：</label>
                          <div className="col-sm-8">
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
                          <label className="col-sm-4 control-label">甲方：</label>
                          <div className="col-sm-8">
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
                          <label className="col-sm-4 control-label">乙方：</label>
                          <div className="col-sm-8">
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
                          <label className="col-sm-4 control-label">丙方：</label>
                          <div className="col-sm-8">
                            {getFieldDecorator('compC', {
                              initialValue: pact.compC,
                            })(<CompanySelect size="large" showSearch allowClear placeholder="请选择"/>)}
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="col-sm-4 control-label">丁方：</label>
                          <div className="col-sm-8">
                            {getFieldDecorator('compD', {
                              initialValue: pact.compD,
                            })(<CompanySelect size="large" showSearch allowClear placeholder="请选择"/>)}
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="col-sm-4 control-label">日期：</label>
                          <div className="col-sm-8">
                            {getFieldDecorator('signDates', {
                              initialValue: [pact.signDate ? moment(pact.signDate) : null, pact.signDate2 ? moment(pact.signDate2) : null],
                            })(<RangePicker size="large"/>)}
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="col-sm-4 control-label">经办人：</label>
                          <div className="col-sm-4">
                            {getFieldDecorator('transactor1', {
                              initialValue: getTextInitialValue(pact.transactor1),
                            })(<input type="text" className="form-control" placeholder="请输入"/>)}
                          </div>
                          <div className="col-sm-4">
                            {getFieldDecorator('transactor2', {
                              initialValue: getTextInitialValue(pact.transactor2),
                            })(<input type="text" className="form-control" placeholder="请输入"/>)}
                          </div>
                        </div>
                        <div className={classNames({'form-group': true, 'has-error': !!getFieldError('execState')})}>
                          <label className="col-sm-4 control-label">执行状态：</label>
                          <div className="col-sm-8">
                            {getFieldDecorator('execState', {
                              initialValue: pact.execState,
                              rules: [{required: true, message: '请选择执行状态'}],
                            })(<SimpleSelect size="large" list={execStates} placeholder="请选择"/>)}
                            <span className="help-block">
                              {(errors.execState = getFieldError('execState')) ? errors.execState.join(',') : null}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="col-sm-4 control-label">档案代码：</label>
                          <div className="col-sm-5">
                            <input type="text" className="form-control" value={pact.pactNo} readOnly/>
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="col-sm-4 control-label">合同代码：</label>
                          <div className="col-sm-5">
                            <input type="text" className="form-control" value={pact.pactNumber} readOnly/>
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="col-sm-4 control-label">主题词：</label>
                          <div className="col-sm-7">
                            {getFieldDecorator('subject', {
                              initialValue: getTextInitialValue(pact.subject),
                            })(<textarea className="form-control" rows="5" placeholder="请输入主题词" />)}
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="col-sm-4 control-label">备注：</label>
                          <div className="col-sm-7">
                            {getFieldDecorator('remark', {
                              initialValue: getTextInitialValue(pact.remark),
                            })(<textarea className="form-control" rows="5" placeholder="请输入备注" />)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <h3 className="contractTitle" style={{borderTop: '1px solid #ddd'}}>付款信息</h3>
                    <div className="row">
                      <div className="col-md-6 popPaymentI">
                        <div className="form-group">
                          <label className="col-sm-4 control-label"/>
                          <div className="col-sm-8">
                            <label><input type="checkbox"/> 付款付讫</label>
                          </div>
                        </div>
                        <div className={classNames({'form-group': true, 'has-error': !!getFieldError('pactSum')})}>
                          <label className="col-sm-4 control-label">金额：</label>
                          <div className="col-sm-8">
                            {getFieldDecorator('pactSum', {
                              initialValue: pact.pactSum,
                              rules: [{required: true, message: '金额不能为空'}],
                            })(<NumberFormat className="form-control" placeholder="请输入" allowNegative={false} decimalScale={2} thousandSeparator={true}
                                             prefix={'￥'}/>)}
                            <span className="help-block">
                              {(errors.pactSum = getFieldError('pactSum')) ? errors.pactSum.join(',') : null}
                            </span>
                          </div>
                        </div>
                        <div className={classNames({'form-group': true, 'has-error': !!getFieldError('auditSum')})}>
                          <label className="col-sm-4 control-label">审核金额：</label>
                          <div className="col-sm-8">
                            {getFieldDecorator('auditSum', {
                              initialValue: pact.auditSum,
                              rules: [{required: true, message: '审核金额不能为空'}],
                            })(<NumberFormat className="form-control" placeholder="请输入" allowNegative={false} decimalScale={2} thousandSeparator={true}
                                             prefix={'￥'}/>)}
                            <span className="help-block">
                              {(errors.auditSum = getFieldError('auditSum')) ? errors.auditSum.join(',') : null}
                            </span>
                          </div>
                        </div>
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
