import axios from '@/libs/api.request'

export const getProvinceAllInfo = (data) => { // 获取省份所有信息
    return axios.request({
        url: 'back/common/getProvinceMessage',
        data,
        method: 'post'
    })
}

export const getProvinceList = (data) => { // 获取省份
    return axios.request({
        url: 'back/common/province',
        data: data,
        method: 'post'
    })
}
export const getCityList = (data) => { // 获取市
    return axios.request({
        url: 'back/common/city',
        data: data,
        method: 'post'
    })
}
export const getAreaList = (data) => { // 获取区
    return axios.request({
        url: 'back/common/area',
        data: data,
        method: 'post'
    })
}
export const getStreetList = (data) => { // 获取街道
    return axios.request({
        url: 'back/common/street',
        data: data,
        method: 'post'
    })
}
export const getPlotList = (data) => { // 获取小区
    return axios.request({
        url: 'back/common/plot',
        data: data,
        method: 'post'
    })
}
export const getBuildingList = (data) => { // 获取楼座
    return axios.request({
        url: 'back/common/building',
        data: data,
        method: 'post'
    })
}
export const getDoorList = (data) => { // 获取门号
    return axios.request({
        url: 'back/common/door',
        data: data,
        method: 'post'
    })
}

export const getAuthorization = (data) => { // 获取cos上传相关验证参数
    return axios.request({
        url: 'back/comUser/cosKey',
        data,
        method: 'post'
    })
}

export const getAllText = (data) => { // 获取数据注释
    return axios.request({
        url: 'back/common/getSystemInitList',
        data,
        method: 'post'
    })
}

export const getStatusList = (data) => { // 获取系统各种状态列表
    return axios.request({
        url: 'back/common/getSystemInitList',
        data,
        method: 'post'
    })
}

export const checkOnLine = (data) => { // 用户在线检测
    return axios.request({
        url: 'back/user/checkOnLine',
        data,
        method: 'post'
    })
}