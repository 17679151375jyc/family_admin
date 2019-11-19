import axios from '@/libs/api.request'

//设备管理-start
export const getDeviceList = (data) => { //设备管理列表
    return axios.request({
        url: 'back/applyDevice/getPageInfo',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        }

    })
}
export const getDeviceDetail = (data) => { // 根据id查询单条数据详情
    return axios.request({
        url: 'back/applyDevice/getById',
        data,
        method: 'post'
    })
}
export const addDevice = (data) => { // 添加设备
    return axios.request({
        url: 'back/applyDevice/add',
        data,
        method: 'post',

    })
}
export const setDeviceValid = (data) => { // 设置设备是否有效
    return axios.request({
        url: 'back/applyDevice/setValid',
        data,
        method: 'post'
    })
}

export const delDevice = (data) => { // 删除设备
        return axios.request({
            url: 'back/applyDevice/deleteById',
            data,
            method: 'post',

        })
    }
    // 设备管理-end


// 套餐管理-start
export const getComboList = (data) => { // 获取套餐列表
    return axios.request({
        url: 'back/applyPackage/getPageInfo',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        }
    })
}
export const getComboDetail = (data) => { // 获取套餐详情
    return axios.request({
        url: 'back/applyPackage/getPackage',
        data,
        method: 'post'
    })
}

export const addCombo = (data) => { // 添加套餐
    return axios.request({
        url: 'back/applyPackage/saveObj',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        }
    })
}
export const setComboValid = (data) => { // 设置套餐状态 
    return axios.request({
        url: 'back/applyPackage/setValid',
        data,
        method: 'post'
    })
}
export const delCombo = (data) => { // 删除套餐
        return axios.request({
            url: 'back/applyPackage/deleteById',
            data,
            method: 'post'
        })
    }
    //套餐管理-end

//安装查询-start
export const getApplyList = (data) => { // 获取申请安装列表
    return axios.request({
        url: 'back/applyInstall/getPageInfo',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        }
    })
}

export const getApplyDetail = (data) => { // 获取报装详情
    return axios.request({
        url: 'back/applyInstall/getApplyInstall',
        data,
        method: 'post'
    })
}
export const toExamineApply = (data) => { // 审核报装
    return axios.request({
        url: 'back/applyInstall/updateStatus',
        data,
        method: 'post'
    })
}