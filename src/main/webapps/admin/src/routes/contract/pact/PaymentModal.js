import React from 'react'
import classNames from 'classnames'
import NumberFormat from 'react-number-format'
import {Form, DatePicker, Modal} from 'antd'
import moment from 'moment'
import {getMoneyValue, getTextInitialValue} from "../../../utils/util"

const modal = ({
                 item = {},
                 onOk,
                 form: {
                   getFieldDecorator,
                   validateFields,
                   getFieldsValue,
                   getFieldError,
                 },
                 ...modalProps
               }) => {

  const modalOpts = {
    ...modalProps,
    animation: 'slide-fade',
    maskAnimation: 'fade',
    style: {width: 480},
    onOk(e) {
      e.preventDefault()
      validateFields((errors) => {
        if (errors) {
          return
        }
        const {invCount, payCount, ...values} = getFieldsValue()
        const data = {
          ...values,
          invCount: getMoneyValue(invCount),
          payCount: getMoneyValue(payCount),
          payNo: item.payNo,
          id: item.payNo,
        }
        onOk(data)
      })
    }
  }

  let errors = {}

  item.payDate = item.payDate && moment(item.payDate)

  return (
    <Modal
      {...modalOpts}
    >
      <form className="form-horizontal" onSubmit={modalOpts.onOk}>
        <div className={classNames({'form-group': true, 'has-error': !!getFieldError('payDate')})}>
          <label className="col-sm-3 control-label">日期：</label>
          <div className="col-sm-8">
            {getFieldDecorator('payDate', {
              initialValue: item.payDate || null,
              rules: [
                {required: true, message: '日期不能为空'},
              ],
            })(
              <DatePicker placeholder="请选择日期"/>
            )}
            <span className="help-block">
              {(errors.payDate = getFieldError('payDate')) ? errors.payDate.join(',') : null}
            </span>
          </div>
        </div>
        <div className={classNames({'form-group': true, 'has-error': !!getFieldError('warrant')})}>
          <label className="col-sm-3 control-label">凭证：</label>
          <div className="col-sm-8">
            {getFieldDecorator('warrant', {
              initialValue: getTextInitialValue(item.warrant),
              rules: [
                {required: true, pattern: /^\w{1,7}$/, message: '凭证不能为空，并且长度不能大于7位'},
              ],
            })(
              <input type="text" className="form-control" placeholder="请输入凭证"/>
            )}
            <span className="help-block">
              {(errors.warrant = getFieldError('warrant')) ? errors.warrant.join(',') : null}
            </span>
          </div>
        </div>
        <div className={classNames({'form-group': true, 'has-error': !!getFieldError('payCount')})}>
          <label className="col-sm-3 control-label">金额：</label>
          <div className="col-sm-8">
            {getFieldDecorator('payCount', {
              initialValue: item.payCount,
              rules: [
                {required: true, message: '金额不能为空',},
              ],
            })(
              <NumberFormat className="form-control" placeholder="请输入金额" allowNegative={false} decimalScale={2} thousandSeparator={true} prefix={'￥'}/>
            )}
            <span className="help-block">
              {(errors.payCount = getFieldError('payCount')) ? errors.payCount.join(',') : null}
            </span>
          </div>
        </div>

        <div className="form-group">
          <label className="col-sm-3 control-label">备注金额：</label>
          <div className="col-sm-8">
            {getFieldDecorator('invCount', {
              initialValue: item.invCount,
            })(
              <NumberFormat className="form-control" placeholder="请输入金额" allowNegative={false} decimalScale={2} thousandSeparator={true} prefix={'￥'}/>
            )}
          </div>
        </div>

        <div className="form-group">
          <label className="col-sm-3 control-label">备注：</label>
          <div className="col-sm-8">
            {getFieldDecorator('remark', {
              initialValue: getTextInitialValue(item.remark),
            })(
              <textarea className="form-control" rows="5" placeholder="请输入备注"/>
            )}
          </div>
        </div>

        <input type="submit" style={{display: "none"}}/>
      </form>
    </Modal>
  )
}

export default Form.create()(modal)