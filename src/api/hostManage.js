import axios from '@/libs/api.request'

// 防盗主机相关接口
export const getDefenceAreaBySecurity = (data) => { // 根据防盗主机编号获取防区列表
    return axios.request({
        url: 'back/defenceArea/getList',
        data: data,
        method: 'post'
    })
}

export const editDefenceAreaBySecurity = (data) => { // 编辑安装区域
    return axios.request({
        url: 'back/area/update',
        data: data,
        method: 'post'
    })
}

export const getDefenceAreaBySecurityDetail = (data) => { // 获取安装区域详情
    return axios.request({
        url: 'back/area/getById',
        data: data,
        method: 'post'
    })
}

export const delDefenceAreaBySecurity = (data) => { // 删除安装区域
    return axios.request({
        url: 'back/area/delete',
        data: data,
        method: 'post'
    })
}
export const choiceBusiness = (data) => { // 安装区域根据手机号选择业务单
    return axios.request({
        url: 'back/area/selectInstall',
        data: data,
        method: 'post',
        // headers: {
        //     'Content-Type': 'application/json;charset=UTF-8',
        // }
    })
}

export const bindBusiness = (data) => { // 安装区域绑定业务单
    return axios.request({
        url: 'back/area/updateAreaInstall',
        data: data,
        method: 'post'
    })
}

export const getSecurityHostList = (data) => { // 查询所有防盗主机
    return axios.request({
        url: 'back/machine/getMachineByPhone',
        data: data,
        method: 'post'
    })
}



export const getSectorByNumber = (data) => { // 传防盗主机id获取详情
    return axios.request({
        url: 'back/machine/getMachineByNum',
        data,
        method: 'post'
    })
}

export const addSectorHost = (data) => { // 添加防盗主机
    return axios.request({
        url: 'back/machine/add',
        data,
        method: 'post'
    })
}

export const unBindSectorHost = (data) => { // 解绑视频主机
    return axios.request({
        url: 'back/machine/unbinding',
        data,
        method: 'post'
    })
}

export const bindSectorHost = (data) => { // 重新绑定用户
    return axios.request({
        url: 'back/machine/binding',
        data,
        method: 'post'
    })
}

export const updateSectorHost = (data) => { // 更新防盗主机信息
    return axios.request({
        url: 'back/machine/update',
        data,
        method: 'post'
    })
}

// 视频主机相关接口
export const getVideoHostList = (data) => { // 查询所有视频主机
    return axios.request({
        url: 'back/camera/getCameraByMessage',
        data: data,
        method: 'post'
    })
}
export const getVideoHostByMacNum = (data) => { // 根据防盗主机number查询视频主机
    return axios.request({
        url: 'back/camera/findCameraByMachineNumber',
        data,
        method: 'post'
    })
}
export const getVideoHostDetail = (data) => { // 根据视频主机id查询相关主机的详情
    return axios.request({
        url: 'back/camera/findByCameraNumber',
        data: data,
        method: 'post'
    })
}

export const addVideoHost = (data) => { // 添加视频主机
    return axios.request({
        url: 'back/camera/add',
        data: data,
        method: 'post'
    })
}

export const updateVideoHost = (data) => { // 编辑更新视频主机信息
    return axios.request({
        url: 'back/camera/update',
        data: data,
        method: 'post'
    })
}

export const delVideoHost = (data) => { // 删除视频主机
    return axios.request({
        url: 'back/camera/deleteCamera',
        data: data,
        method: 'post'
    })
}



// 防区管理相关接口
export const getDefenceDevType = (data) => { // 防区设备类型枚举
    return axios.request({
        url: 'back/defenceArea/getDefenceType',
        data,
        method: 'post'
    })
}
export const getDefenceAreaList = (data) => { // 查询所有防区
    return axios.request({
        url: 'back/defenceArea/getDefenceArea',
        data,
        method: 'post'
    })
}



export const getSectorListByPhone = (data) => { // 传电话获取所有防区
    return axios.request({
        url: 'back/common/getChainByPhone',
        data: data,
        method: 'post'
    })
}

export const getDefenceByMacNumber = (data) => { // 根据主机编号查所有防区
    return axios.request({
        url: 'back/defenceArea/getDefenceAreaByMachineNum',
        data,
        method: 'post'
    })
}
export const addDefenceArea = (data) => { // 新增防区
    return axios.request({
        url: 'back/defenceArea/add',
        data,
        method: 'post'
    })
}

export const getDefenceDetail = (data) => { // 防区详情
    return axios.request({
        url: 'back/defenceArea/getDefenceByNum',
        data,
        method: 'post'
    })
}

export const editDefence = (data) => { // 编辑防区
    return axios.request({
        url: 'back/defenceArea/update',
        data,
        method: 'post'
    })
}
export const delDefence = (data) => { // 编辑防区
    return axios.request({
        url: 'back/defenceArea/deleteById',
        data,
        method: 'post'
    })
}

export const preventionHost = (data) => { // 查看防盗主机日志
    return axios.request({
        url: 'back/machine/getMachineLog',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        }
    })
}


//主机配网相关接口-start
export const getSetupServerList = (data) => { // 获取主机配网列表
    return axios.request({
        url: 'back/sqMachineInstall/getPageInfo',
        data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        }
    })
}

export const addHostNetwork = (data) => { // 添加主机配网
    return axios.request({
        url: 'back/sqMachineInstall/addIpAdress',
        data,
        method: 'post'
    })
}

export const getHostNetworkDetail = (data) => { // 获取配网详情
    return axios.request({
        url: 'back/sqMachineInstall/getById',
        data,
        method: 'post'
    })
}

export const updateHostNetwork = (data) => { // 更新配网配置
    return axios.request({
        url: 'back/sqMachineInstall/update',
        data,
        method: 'post'
    })
}
export const delHostNetworkDetail = (data) => { // 删除主机配网
        return axios.request({
            url: 'back/sqMachineInstall/deleteById',
            data,
            method: 'post'
        })
    }
    //主机配网相关接口-end

// 区域小区地图-start
export const getAreaPoints = (data) => { // 获取安装区域的点
    return axios.request({
        url: 'back/area/findArea',
        data,
        method: 'post'
    })
}

export const getPlotPoints = (data) => { // 获取所有小区的点
        return axios.request({
            url: 'back/sqPlot/getPlots',
            data,
            method: 'post'
        })
    }
    // 区域小区地图-end