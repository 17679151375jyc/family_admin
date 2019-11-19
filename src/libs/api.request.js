import HttpRequest from '@/libs/axios'
import config from '@/config/index'
const baseUrl = config.baseUrl[process.env.NODE_ENV] // process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
    // console.log('baseUrl', baseUrl, process.env.NODE_ENV)
const axios = new HttpRequest(baseUrl)
export default axios