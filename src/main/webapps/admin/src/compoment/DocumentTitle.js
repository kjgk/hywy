import React from 'react'
import DocumentTitle from 'react-document-title'
import {appName} from '../utils/config'

export default ({title, children}) =>
  <DocumentTitle title={`${title} - ${appName}`}>
    {children}
  </DocumentTitle>