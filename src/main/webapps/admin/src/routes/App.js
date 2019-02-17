import React from 'react'
import {connect} from 'dva'
import {withRouter} from 'dva/router'
import NProgress from 'nprogress'
import Header from './Header'
import Footer from './Footer'
import styles from './app.css'
import 'nprogress/nprogress.css'

let lastHref

function App({
               children, location, dispatch, loading, app
             }) {

  const {pathname} = location
  const {href} = window.location

  NProgress.configure({showSpinner: false})

  if (lastHref !== href) {
    NProgress.start()
    if (!loading.global) {
      NProgress.done()
      lastHref = href
    }
  }

  if (pathname === '/login' || pathname === '/reg') {
    return (<div>
      {children}
    </div>)
  }

  if (/\/contract\/payment\/\d+\/preview$/.test(pathname)
    || /\/contract\/pact\/\d+\/preview$/.test(pathname)) {
    return (<div>
      {children}
    </div>)
  }

  const onLogout = () => {
    dispatch({
      type: 'app/logout'
    })
  }

  return (
    <div className={styles.main}>
      <Header currentUser={app.currentUser} onLogout={onLogout} menus={app.menus} location={location}/>
      <div className={styles.content}>
        {children}
      </div>
      <Footer/>
    </div>
  )
}

export default withRouter(connect(({loading, app}) => (
  {loading, app}
))(App))
