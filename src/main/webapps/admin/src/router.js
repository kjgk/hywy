import React from 'react'
import {Route, Router, Switch, Redirect} from 'dva/router'
import dynamic from 'dva/dynamic'
import {LocaleProvider} from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import 'moment/locale/zh-cn'
import App from './routes/App'

const menus = [
  {
    path: '/login',
    models: () => [import('./models/login')],
    component: () => import('./routes/login/'),
  },
  {
    path: '/reg',
    models: () => [import('./models/reg')],
    component: () => import('./routes/reg/'),
  },
  {
    path: '/project',
    models: () => [import('./models/project')],
    component: () => import('./routes/project'),
  },
  {
    path: '/project/:projectId',
    models: () => [import('./models/projectDetail')],
    component: () => import('./routes/project/ProjectDetail'),
  },
  {
    path: '/project/:projectId/:categoryId',
    models: () => [import('./models/projectDetail')],
    component: () => import('./routes/project/ProjectDetail'),
  },
  {
    path: '/pact',
    models: () => [import('./models/pact'), import('./models/pactForm')],
    component: () => import('./routes/pact'),
  },
  {
    path: '/pact/new',
    models: () => [import('./models/pactForm'), import('./models/company')],
    component: () => import('./routes/pact/PactForm'),
  },
  {
    path: '/pact/:pactNo/edit',
    models: () => [import('./models/pactForm'), import('./models/company')],
    component: () => import('./routes/pact/PactForm'),
  },
  {
    path: '/pact/:pactNo',
    models: () => [import('./models/pactForm'), import('./models/pactDetail'), import('./models/payment')],
    component: () => import('./routes/pact/PactDetail'),
  },
  {
    path: '/pact/:pactNo/preview',
    models: () => [import('./models/pactPrint')],
    component: () => import('./routes/pact/PactPrint'),
  },
  {
    path: '/payment/:payNo/preview',
    models: () => [import('./models/paymentPrint')],
    component: () => import('./routes/pact/PaymentPrint'),
  },
  {
    path: '/payment',
    models: () => [import('./models/payment'), import('./models/pactForm')],
    component: () => import('./routes/payment'),
  },
  {
    path: '/company',
    models: () => [import('./models/company')],
    component: () => import('./routes/company'),
  },
]

function RouterConfig({history, app}) {

  return (
    <Router history={history}>
      <LocaleProvider locale={zh_CN}>
        <App>
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/project"/>}/>
            {
              menus.map(({path, ...dynamics}, index) => (
                <Route
                  key={index}
                  path={path}
                  exact
                  component={dynamic({
                    app,
                    ...dynamics
                  })}
                />
              ))
            }
          </Switch>
        </App>
      </LocaleProvider>
    </Router>
  )
}

export default RouterConfig