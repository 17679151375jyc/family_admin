import axios from '@/libs/api.request'

export const getAccountList = (data) => { // 查询所有账号
    return axios.request({
        url: 'back/user/getPageInfo',
        data: data,
        method: 'post'
    })
}
export const getAccountDetail = (data) => { // 获取账号详情
    return axios.request({
        url: 'back/user/getUserById',
        data: data,
        method: 'post'
    })
}

export const addAccount = (data) => { // 添加账号
    return axios.request({
        url: 'back/user/add',
        data: data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        }
    })
}
export const delAccount = (data) => { // 删除账号
    return axios.request({
        url: 'back/user/deleteUser',
        data: data,
        method: 'post'
    })
}
export const updateAccount = (data) => { // 更新账号信息
    return axios.request({
        url: 'back/user/update',
        data: data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        }
    })
}

export const getAccessMenuList = () => { // 获取所有权限菜单
    return axios.request({
        url: 'back/jurisdiction/getList',
        data: {},
        method: 'post'
    })
}

export const getAccessDetail = (data) => { // 根据id获取权限信息详情
    return axios.request({
        url: 'back/jurisdiction/getJurisdiction',
        data: data,
        method: 'post'
    })
}

export const addAccessMenu = (data) => { // 添加权限菜单
    return axios.request({
        url: 'back/jurisdiction/add',
        data: data,
        method: 'post'
    })
}

export const delAccess = (data) => { // 删除权限节点
    return axios.request({
        url: 'back/jurisdiction/delete',
        data: data,
        method: 'post'
    })
}

export const updateAccess = (data) => { // 编辑更新权限信息
    return axios.request({
        url: 'back/jurisdiction/update',
        data: data,
        method: 'post'
    })
}

export const getRoleList = (data) => { // 获取角色列表
    return axios.request({
        url: 'back/role/getRoleList',
        data: data,
        method: 'post'
    })
}
export const getRoleDetail = (data) => { // 获取单角色详情
    return axios.request({
        url: 'back/role/getRoleById',
        data: data,
        method: 'post'
    })
}

export const addRole = (data) => { // 添加角色
    return axios.request({
        url: 'back/role/add',
        data: data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        }
    })
}

export const updateRole = (data) => { // 编辑更新角色
    return axios.request({
        url: 'back/role/update',
        data: data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        }
    })
}

export const delRole = (data) => { // 删除角色
    return axios.request({
        url: 'back/role/delete',
        data: data,
        method: 'post'
    })
}


export const restartJob = (data) => { // 获取任务列表
    return axios.request({
        url: 'back/qrtzCyjEntity/restartJob',
        data: data,
        method: 'post'
    })
}

export const getTaskList = (data) => { // 获取任务列表
    return axios.request({
        url: 'back/qrtzCyjEntity/getPageInfo',
        data: data,
        method: 'post'
    })
}


export const getTaskDetail = (data) => { // 获取任务详情
    return axios.request({
        url: 'back/qrtzCyjEntity/findQrtzCyjEntity',
        data: data,
        method: 'post'
    })
}
export const getConfigureList = (data) => { // 获取配置列表
    return axios.request({
        url: 'back/comConfig/getConfigLists',
        data: data,
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        }
    })
}
export const getConfigureDetail = (data) => { // 获取配置详情
    return axios.request({
        url: 'back/comConfig/getByName',
        data: data,
        method: 'post'
    })
}
export const updateConfigure = (data) => { // 编辑配置
    return axios.request({
        url: 'back/comConfig/update',
        data: data,
        method: 'post'
    })
}
