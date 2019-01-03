/* global window */
/* global document */
/* global location */
/* eslint no-restricted-globals: ["error", "event"] */

import dva from 'dva'
import createLoading from 'dva-loading'
import createHistory from 'history/createBrowserHistory'
import {contentPath, openPages} from './utils/config'
import {routerRedux} from 'dva/router'

const development = process.env.NODE_ENV === 'development'

// 1. Initialize
const app = dva({
  history: createHistory({basename: development ? '' : `${contentPath}/admin`}),
  ...createLoading({
    except: ['reg/sendVerifyCodeAndCountDown'],
    effects: true,
  }),
  onError: e => {
    const {name} = e
    if (name === 401 && openPages && openPages.indexOf(location.pathname) === -1) {
      app._store.dispatch(routerRedux.push('/login'))
    }
  }
})

// 2. Plugins
// app.use({});

// 3. Model
app.model(require('./models/app').default)

// 4. Router
app.router(require('./router').default)

// 5. Start
app.start('#root')

export default app._store
