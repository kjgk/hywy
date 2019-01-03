import React from 'react'
import {connect} from 'dva'
import {createForm} from 'rc-form'
import DocumentTitle from "../../compoment/DocumentTitle"
import Footer from '../Footer'

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

  const {countDown, errorMessage} = reg

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
              </form>

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
}))(createForm()(Register))
