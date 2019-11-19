import axios from '@/libs/api.request'

export const getCallList = (data) => {  // 呼叫列表
    return axios.request({
        url: 'back/callLog/getPageInfo',
        data: data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        }
    })
}
export const getCallDetail = (data) => { // 呼叫详情
    return axios.request({
        url: 'back/callLog/getById',
        data: data,
        method: 'post'
    })
}
export const getSendList = (data) => {  // 发送列表
    return axios.request({
        url: 'back/smsLog/getPageInfo',
        data: data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        }
    })
}
export const getSendlDetail = (data) => { // 发送详情
    return axios.request({
        url: 'back/smsLog/getSmsLogById',
        data: data,
        method: 'post'
    })
}
export const getVerificationList = (data) => {  // 验证码列表
    return axios.request({
        url: 'back/comCode/getPageInfo',
        data: data,
        method: 'post'
    })
}
export const getVerificationlDetail = (data) => { // 验证码详情
    return axios.request({
        url: 'back/comCode/getCodeById',
        data: data,
        method: 'post'
    })
}