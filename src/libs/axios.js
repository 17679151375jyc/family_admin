import axios from 'axios'
import store from '@/store'
import { Spin, Message } from 'iview'
import qs from 'qs'
const addErrorLog = errorInfo => {
    const { statusText, status, request: { responseURL } } = errorInfo
    let info = {
        type: 'ajax',
        code: status,
        mes: statusText,
        url: responseURL
    }
    if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
}

class HttpRequest {
    constructor(baseUrl = baseURL) {
        this.baseUrl = baseUrl
        this.queue = {}
    }
    getInsideConfig() {
        const config = {
            baseURL: this.baseUrl,
            headers: {
                // 'token': store.state.user.token,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        return config
    }
    destroy(url) {
        delete this.queue[url]
        if (!Object.keys(this.queue).length) {
            // Spin.hide()
        }
    }
    interceptors(instance, url) {
        // 请求拦截
        instance.interceptors.request.use(config => {
                // if (store.state.user && store.state.user.token) {
                //     config.data.token = store.state.user.token
                //     config.data.userId = store.state.user.userId
                // } else {
                //     config.data.token = ''
                // }
                // console.log('data', config.data)
                if (store.state.user.curPlotNumber && !config.data.plotNumber) { // 如果有传
                    config.data.plotNumber = store.state.user.curPlotNumber
                }

                if (config.headers['Content-Type'] === 'application/x-www-form-urlencoded') { // 如果为json格式，不需要转码
                    config.data = qs.stringify(config.data)
                }
                config.headers.token = store.state.user.token
                    // 添加全局的loading...
                if (!Object.keys(this.queue).length) {
                    // Spin.show() // 不建议开启，因为界面不友好
                }
                this.queue[url] = true
                return config
            }, error => {
                return Promise.reject(error)
            })
            // 响应拦截
        instance.interceptors.response.use(res => {
            this.destroy(url)
            const { data, status } = res
            if (status === 200 || status === 304 || status === 400) {
                if (data.errorCode === -999) {
                    Message.error({
                        content: '登录状态失效',
                        duration: 1,
                        closable: true
                    })
                    setTimeout(() => {
                        store.dispatch('handleLogout')
                            // parent.location.href
                        parent.location.reload();
                    }, 1000)

                    // 
                } else if (data.errorCode !== 0) {
                    Message.error({
                        content: data.errorMsg,
                        duration: 3,
                        closable: true
                    })
                    return Promise.reject(data.errorMsg)
                }
            }
            return data
        }, error => {
            this.destroy(url)
            Message.error({
                    content: '服务器错误，请重试',
                    duration: 3,
                    closable: true
                })
                //   let errorInfo = error.response
                //   if (!errorInfo) {
                //     const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
                //     errorInfo = {
                //       statusText,
                //       status,
                //       request: { responseURL: config.url }
                //     }
                //   }
                //   addErrorLog(errorInfo)
            return Promise.reject(error)
        })
    }
    request(options) {
        // console.log('options', options)
        // options.url = `${options.url}` // 把token和userId作为参数写在url后面
        const instance = axios.create()
        options = Object.assign(this.getInsideConfig(), options)
        this.interceptors(instance, options.url)
        return instance(options)
    }
}
export default HttpRequest