import React, {Fragment} from 'react'
import {Link} from 'react-router-dom'
import classNames from 'classnames'
import pathToRegexp from 'path-to-regexp'

function Header({
                  currentUser,
                  onLogout,
                  menus,
                  location,
                }) {

  const {pathname} = location

  return (
    <header className="header">
      <nav id="nav" className="navbar navbar-default ">
        <div className="container relative-nav-container">
          <Link to="/" className="navbar-brand">
            <img src={require('../assets/img/logo.png')} alt="物业管理" className="normal-logo"/>
          </Link>
          <div className="navbar-collapse">
            <ul className="nav navbar-nav clearfix navbar-right">
              {
                menus.map(item =>
                  <li key={item.path} className={classNames({active: item.path && pathToRegexp(item.path).exec(pathname)})}>
                    <Link to={item.path || '#'}>
                      {item.name}
                    </Link>
                  </li>)
              }
              <li className="username">
                <b>当前登录：{currentUser.username}</b>
                <span className="modify">
                  <a href="javascript:;"><i className="fa fa-camera-retro fa-key"/>修改密码</a>|<a onClick={onLogout} href="javascript:;">登出</a>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
