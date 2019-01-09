import React from 'react'
import {connect} from 'dva'
import {Alert, Form} from 'antd'
import DocumentTitle from "../../compoment/DocumentTitle"
import Footer from '../Footer'
import {Link} from "react-router-dom"

const Register = ({
                    reg,
                    loading,
                    dispatch,
                    form: {
                      getFieldDecorator,
                      validateFields,
                      getFieldsValue,
                    },
                  }) => {

  const {countDown, errorMessage, resultCode} = reg

  function handleOk(e) {
    e.preventDefault()
    validateFields((errors, data) => {
      if (errors || loading.effects['reg/register']) {
        return
      }
      dispatch({
        type: 'reg/register',
        payload: data,
      })
    })
  }

  const sendVerifyCode = (data) => {
    dispatch({
      type: 'reg/sendVerifyCodeAndCountDown',
      payload: data,
    })
  }

  const handleVerifyCode = () => {
    let phoneNo = getFieldsValue().phoneNo
    sendVerifyCode({
      phoneNo,
      tunnel: 'reg',
    })
  }

  function renderMessage(content) {
    return <div className="alert alert-danger" role="alert">{content}</div>
  }

  return (
    <DocumentTitle title='注册'>
      <div className="loginModule" style={{height: '700px'}}>
        <section className="container">
          <div className="loginBox">
            <div className="loginLogo center-block">
              <img src={require('../../assets/img/loginLogo.png')}/>轻松管理 无忧办公
            </div>
            <div className="center-block loginCon">
              <div className="loginTitle">
                用户注册 <span>User Register</span>
              </div>
              {resultCode !== 2 &&
              <form onSubmit={handleOk}>
                <div className="pLogin">
                  {errorMessage && !loading.effects.reg && renderMessage(errorMessage)}
                  <div className="form-group ">
                    <i className="fa fa-mobile"/>
                    {getFieldDecorator('phoneNo', {
                      initialValue: '',
                      rules: [
                        {
                          required: true,
                          message: '请输入手机号码',
                        },
                      ],
                    })(<input type="text" className="form-control input-lg" placeholder="请输入手机号码"/>)}
                  </div>

                  <div className="form-group ">
                    <i className="fa fa-key"/>
                    {getFieldDecorator('verifyCode', {
                      initialValue: '',
                      rules: [{
                        required: true,
                        message: '请输入验证码',
                      }],
                    })(<input type="text" className="form-control input-lg" maxLength={6} placeholder="请输入验证码"/>)}
                    {
                      countDown > 0 ? <button className="btn btn-default"
                                              style={{position: 'absolute', top: 7, right: 8}}
                                              type="button" onClick={() => {
                        }}>重新发送({countDown})</button>
                        : <button className="btn btn-default"
                                  style={{position: 'absolute', top: 7, right: 8}}
                                  type="button" onClick={() => handleVerifyCode()}>发送验证码</button>
                    }
                  </div>
                  <div className="form-group ">
                    <i className="fa fa-lock"/>
                    {getFieldDecorator('password', {
                      initialValue: '',
                      rules: [
                        {
                          required: true,
                          message: '请输入登录密码',
                        },
                      ],
                    })(<input type="password" className="form-control input-lg" placeholder="请输入登录密码"/>)}
                  </div>
                  <div className="form-group ">
                    <i className="fa fa-lock"/>
                    {getFieldDecorator('confirmPassword', {
                      initialValue: '',
                      rules: [
                        {
                          required: true,
                          message: '请确认登录密码',
                        },
                      ],
                    })(<input type="password" className="form-control input-lg" placeholder="请确认登录密码"/>)}
                  </div>
                  <div className="btnGroup">
                    <button type="submit" className="btn btn-primary btn-lg btn-block">注册</button>
                  </div>
                </div>
              </form>}
              {resultCode === 2 && <div style={{padding: '30px 0 10px 0'}}>
                <Alert
                  message="提示"
                  description="注册成功，请等待我们工作人员的审核"
                  type="info"
                  showIcon
                />
                <Link style={{fontSize: 16, marginTop: 20, display: 'block', textAlign: 'center'}} to="/login">返回登录</Link>
              </div>}
            </div>
            <div className="loginShadow"/>
            <Footer/>
          </div>
        </section>
      </div>
    </DocumentTitle>
  )
}

export default connect(({reg, loading}) => ({
  loading,
  reg,
}))(Form.create()(Register))
