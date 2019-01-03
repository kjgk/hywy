import React from 'react'
import classNames from 'classnames'
import {Modal, Form} from 'antd'

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
    style: {width: 600},
    onOk: (e) => {
      e.preventDefault()
      validateFields((errors) => {
        if (errors) {
          return
        }
        const data = {
          ...getFieldsValue(),
          id: item.id,
        }
        onOk(data)
      })
    },
  }

  let errors = {}

  return (
    <Modal
      {...modalOpts}
    >
      <form className="form-horizontal" onSubmit={modalOpts.onOk}>
        <div className={classNames({'form-group': true, 'has-error': !!getFieldError('name')})}>
          <label className="col-sm-3 control-label">名称：</label>
          <div className="col-sm-9">
            {getFieldDecorator('name',
              {
                initialValue: item.name || '',
                rules: [
                  {
                    required: true,
                    message: '名称不能为空',
                  },
                ],
              })(
              <input type="text" className="form-control" placeholder="请输入名称"/>
            )}
            <span className="help-block">
              {(errors.name = getFieldError('name')) ? errors.name.join(',') : null}
            </span>
          </div>
        </div>
        <div className={classNames({'form-group': true, 'has-error': !!getFieldError('alias')})}>
          <label className="col-sm-3 control-label">简称：</label>
          <div className="col-sm-9">
            {getFieldDecorator('alias', {
              initialValue: item.alias || '',
              rules: [
                {
                  required: true,
                  message: '简称不能为空',
                },
              ],
            })(
              <input type="text" className="form-control" placeholder="请输入简称"/>
            )}
            <span className="help-block">
              {(errors.alias = getFieldError('alias')) ? errors.alias.join(',') : null}
            </span>
          </div>
        </div>
        <input type="submit" style={{display: "none"}}/>
      </form>
    </Modal>

  )
}

export default Form.create()(modal)