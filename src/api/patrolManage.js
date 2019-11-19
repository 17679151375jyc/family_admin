import axios from '@/libs/api.request'

export const getDutyList = (data) => {
    return axios.request({
        url: 'back/dutyRange/getPageInfo',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        }
    })
}

export const addDuty = (data) => { // 自动生成排班
    return axios.request({
        url: 'back/dutyRange/saveObj',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        }
    })
}

export const delDuty = (data) => { // 删除排班表
    return axios.request({
        url: 'back/dutyRange/deleteById',
        data,
        method: 'post'
    })
}

export const getDutyDetail = (data) => { // 获取值班详情
    return axios.request({
        url: 'back/dutyRange/getDutyRange',
        data,
        method: 'post'
    })
}
export const updateDutyMember = (data) => { // 修改调整值班人员
    return axios.request({
        url: 'back/dutyRange/updateDayMember',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        }

    })
}

export const getPlot = (data) => {
    return axios.request({
        url: 'back/common/plot',
        data,
        method: 'post'
    })
}



// 巡更地图
export const getTaskMember = (data) => { // 获取区域巡查人员
    return axios.request({
        url: 'back/dutyDay/queryTaskMember',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })
}

export const getTaskLog = (data) => { // 获取巡更日志
    return axios.request({
        url: 'back/dutyDay/queryTaskLog',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })
}

export const getTaskMemberDetail = (data) => { // 获取区域巡查人员详情  
    return axios.request({
        url: 'back/dutyDay/queryTaskMemberDetails',
        data,
        method: 'post'
    })
}


export const getAllTaskPoint = (data) => { //获取区域巡查点
    return axios.request({
        url: 'back/dutyDay/queryAllTaskPoint',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })
}

export const getTaskPoint = (data) => { // 获取区域某个巡查人员巡查的点
    return axios.request({
        url: 'back/dutyDay/queryTaskPoints',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })
}

export const getRegionEquipment = (data) => { // 获取区域设备
    return axios.request({
        url: 'back/areaDevice/getPageInfo',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })
}

export const getRegionEquipmentDetail = (data) => { // 获取区域设备详情
    return axios.request({
        url: 'back/areaDevice/getObj',
        data,
        method: 'post'
    })
}
export const unbindAreaDevice = (data) => { // 解绑区域设备
    return axios.request({
        url: 'back/areaDevice/unbindAreaDevice',
        data,
        method: 'post'
    })
}
export const UpdateRegionEquipment = (data) => { // 添加修改区域设备
    return axios.request({
        url: 'back/areaDevice/saveObj',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })
}

export const getVideoDetail = (data) => { //获取区域设备视频
    return axios.request({
        url: 'back/camera/getPageInfo',
        data,
        method: 'post'
    })
}

export const addVideoInfo = (data) => { //添加区域设备视频
    return axios.request({
        url: 'back/areaDevice/addCamera',
        data,
        method: 'post'
    })
}

export const delVideoInfo = (data) => { //删除区域设备视频
    return axios.request({
        url: 'back/areaDevice/deleteCamera',
        data,
        method: 'post'
    })
}