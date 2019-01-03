import React from 'react'
import {Route, Router, Switch, Redirect} from 'dva/router'
import dynamic from 'dva/dynamic'
import {LocaleProvider} from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import moment from 'moment'
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
    path: '/contract',
    models: () => [import('./models/contract')],
    component: () => import('./routes/contract'),
  },
  {
    path: '/contract/pact/new',
    models: () => [import('./models/pactForm')],
    component: () => import('./routes/contract/pact/PactForm'),
  },
  {
    path: '/contract/pact/edit/:pactNo',
    models: () => [import('./models/pactForm')],
    component: () => import('./routes/contract/pact/PactForm'),
  },
  {
    path: '/contract/pact/:pactNo',
    models: () => [import('./models/pactForm'), import('./models/pactDetail'), import('./models/payment')],
    component: () => import('./routes/contract/pact/PactDetail'),
  },
  {
    path: '/contract/payment/:payNo',
    models: () => [import('./models/paymentPrint')],
    component: () => import('./routes/contract/pact/PaymentPrint'),
  },
  {
    path: '/contract/:projectId',
    models: () => [import('./models/contractList')],
    component: () => import('./routes/contract/ContractList'),
  },
  {
    path: '/contract/:projectId/:categoryId',
    models: () => [import('./models/contractList')],
    component: () => import('./routes/contract/ContractList'),
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
            <Route exact path="/" render={() => <Redirect to="/contract"/>}/>
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