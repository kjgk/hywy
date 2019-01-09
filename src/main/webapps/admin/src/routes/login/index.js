import React from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'dva'
import {Form} from 'antd'
import DocumentTitle from "../../compoment/DocumentTitle"
import Footer from '../Footer'

const Login = ({
                 login,
                 loading,
                 dispatch,
                 form: {
                   getFieldDecorator,
                   validateFields,
                 },
               }) => {

  function handleOk(e) {
    e.preventDefault()
    validateFields((errors, {username, password}) => {
      if (errors) {
        return
      }
      dispatch({
        type: 'login/login',
        payload: {
          username: username.trim(),
          password,
        },
      })
    })
  }

  function renderMessage(content) {
    return <div className="alert alert-danger" role="alert">{content}</div>
  }

  return (
    <DocumentTitle title='登录'>
      <div className="loginModule" style={{height: '700px'}}>
        <section className="container">
          <div className="loginBox">
            <div className="loginLogo center-block">
              <img src={require('../../assets/img/loginLogo.png')}/>轻松管理 无忧办公
            </div>
            <div className="center-block loginCon">
              <div className="loginTitle">
                用户登录 <span>User Login</span>
              </div>
              <form onSubmit={handleOk}>
                <div className="pLogin">
                  {login.errorMessage && !loading.effects.login && renderMessage(login.errorMessage)}
                  <div className="form-group ">
                    <i className="fa fa-mobile"/>
                    {getFieldDecorator('username', {
                      initialValue: '',
                      rules: [
                        {
                          required: true,
                          message: '请输入帐号',
                        },
                      ],
                    })(<input type="text" className="form-control input-lg" placeholder="请输入您登录的手机号码"/>)}
                  </div>
                  <div className="form-group ">
                    <i className="fa fa-lock"/>
                    {getFieldDecorator('password', {
                      initialValue: '',
                      rules: [
                        {
                          required: true,
                          message: '请输入密码',
                        },
                      ],
                    })(<input type="password" className="form-control input-lg" placeholder="请输入登录密码"/>)}
                  </div>
                  <div className="checkbox">
                    <label>
                      {/*<input type="checkbox"/> 记住登录名*/}
                    </label>
                    <div className="pull-right">
                      <Link to="/reg">没有账号？立即注册</Link>
                    </div>
                  </div>
                  <div className="btnGroup">
                    <button type="submit" className="btn btn-primary btn-lg btn-block">登录</button>
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


export default connect(({login, loading}) => ({
  loading,
  login,
}))(Form.create()(Login))
