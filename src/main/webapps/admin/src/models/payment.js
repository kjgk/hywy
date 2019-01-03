import service from '../services/payment'
import {createCrudModel} from './base'

const namespace = 'payment'
const pathname = Symbol()

export default createCrudModel(namespace, pathname, service)
