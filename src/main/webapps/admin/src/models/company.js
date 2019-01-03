import service from '../services/company'
import {createCrudModel} from './base'

const namespace = 'company'
const pathname = '/company'

export default createCrudModel(namespace, pathname, service)
