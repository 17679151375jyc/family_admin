import axios from '@/libs/api.request'

export const getAlramList = (data) => { // 获取报警消息列表
    return axios.request({
        url: 'back/alertMessage/getAlertMessage',
        data: data,
        method: 'post'
    })
}

export const getAlramDetail = (data) => { // 获取一条报警消息详情
    return axios.request({
        url: 'back/alertMessage/getAlertMessageByNum',
        data: data,
        method: 'post'
    })
}
export const getAlramDataDetail = (data) => { // 获取报警进度详情？
    return axios.request({
        url: 'back/alertMessageLog/getPageInfo',
        data: data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        }
    })
}

export const alertRuquestPolice = (data) => { // 手动请求出警
    return axios.request({
        url: 'back/alertMessage/request',
        data,
        method: 'post'
    })
}

export const alertAcceptPolice = (data) => { //指定出警人员
    return axios.request({
        url: 'back/alertMessage/accept',
        data,
        method: 'post'
    })
}

export const alertMistake = (data) => { // 改为误报
    return axios.request({
        url: 'back/alertMessage/mistake',
        data,
        method: 'post'
    })
}

export const getAlertCamera = (data) => { // 获取一分钟视频
    return axios.request({
        url: 'back/camera/getMessageCamera',
        data,
        method: 'post'
    })
}

export const getMaintenanceList = (data) => { // 获取维保消息列表
    return axios.request({
        url: 'back/fsMaintainMessage/getPageInfo',
        data,
        method: 'post'
    })
}

export const getMaintenanceDetail = (data) => { // 获取一条维保消息详情
    return axios.request({
        url: 'back/fsMaintainMessage/getfsMaintainMessageByNum',
        data,
        method: 'post'
    })
}
export const getWeibaoDetail = (data) => { // 获取一条维保进度详情
    return axios.request({
        url: 'back/maintainMessageLog/getPageInfo',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        }
    })
}

export const addMaintenance = (data) => { // 添加一条维保消息
    return axios.request({
        url: 'back/fsMaintainMessage/add',
        data,
        method: 'post'
    })
}

export const maintenanceCallUser = (data) => { // 后台请求维保
    return axios.request({
        url: 'back/fsMaintainMessage/callMaintain',
        data,
        method: 'post'
    })
}
export const maintenanceIgnore = (data) => { // 后台忽略维保消息
    return axios.request({
        url: 'back/fsMaintainMessage/ignore',
        data,
        method: 'post'
    })
}
export const maintenanceAcceptUser = (data) => { // 维保任务指定人员
        return axios.request({
            url: 'back/fsMaintainMessage/accept',
            data,
            method: 'post'
        })
    }
    // 主机消息列表-start
export const getMachineMessageList = (data) => { // 获取主机消息列表
    return axios.request({
        url: 'back/machineMessage/getPageInfo',
        data,
        method: 'post'
    })
}
export const getMachineMessageDetail = (data) => { // 获取主机消息详情
        return axios.request({
            url: 'back/machineMessage/getAMMessageAmassById',
            data,
            method: 'post'
        })
    }
    //主机消息列表-end