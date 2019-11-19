import { login, loginByToken } from '@/api/user'
export default {
    state: {
        userName: '',
        phone: '',
        roleId: '',
        roleName: '',
        role: [], // 角色类型
        token: '',
        userId: '',
        jurisdiction: [], // 权限列表
        companyType: '', // 公司id
        companyName: '', // 公司名称
        plots: {}, // 小区列表 
        curPlotNumber: '', // 当前显示的小区
    },
    mutations: {
        setToken(state, token) {
            state.token = token
        },
        setUserId(state, userId) {
            state.userId = userId
        },
        setPhone(state, phone) {
            state.phone = phone
        },
        setRoleName(state, roleName) {
            state.roleName = roleName
        },
        setJurisdiction(state, jurisdiction) {
            state.jurisdiction = jurisdiction
        },
        setCompanyType(state, companyType) {
            state.companyType = companyType
        },
        setCompanyName(state, companyName) {
            state.companyName = companyName
        },
        setPlots(state, plots) {
            state.plots = plots
        },
        setCurPlot(state, plotNumber) {
            state.curPlotNumber = plotNumber
        },
        setRoleType(state, roleType) {
            state.roleType = roleType
        }
    },
    getters: {

    },
    actions: {
        // 登录
        handleLogin({ commit }, { userName, password }) {
            return new Promise((resolve, reject) => {
                login({
                    userName,
                    password
                }).then(({ data: { token, userId, jurisdictions, roles, phone, companyType, companyName, plots }, errorCode }) => {
                    if (errorCode === 0) {
                        // let rolesName = []
                        // for (let i = 0; i < roles.length; i++) {
                        //     rolesName.push(roles[i].roleName)
                        // }
                        commit('setToken', token) // 设定token
                            // commit('setUserId', userId)
                            // commit('setPhone', phone)
                            // commit('setRoleName', rolesName.join('<br>'))
                        commit('setCompanyType', companyType) // 设定公司类型
                            // commit('setCompanyName', companyName)
                            // commit('setPlots', plots)

                        // let jurisdictionsArr = []
                        // for (let i = 0; i < jurisdictions.length; i++) {
                        //     jurisdictionsArr.push(jurisdictions[i].code)
                        // }
                        // commit('setJurisdiction', jurisdictionsArr)
                        resolve()
                    }
                }).catch(err => {
                    reject(err)
                })
            })
        },
        handleLoginByToken({ commit }) { // 使用token登录 
            console.log(this.state.user.curPlotNumber)
            return new Promise((resolve, reject) => {
                loginByToken({}).then(({ data: { token, userId, jurisdictions, roles, phone, companyType, companyName, plots }, errorCode }) => {
                    if (errorCode === 0) {
                        let rolesName = []
                        for (let i = 0; i < roles.length; i++) {
                            rolesName.push(roles[i].roleName)
                        }
                        commit('setToken', token)
                        commit('setUserId', userId)
                        commit('setPhone', phone)
                        commit('setRoleName', rolesName.join('<br>'))

                        let roleType = []
                        for (let i = 0; i < roles.length; i++) { // 保存角色id
                            roleType.push(roles[i].type)
                        }
                        commit('setRoleType', roleType)
                        commit('setCompanyType', companyType)
                        commit('setCompanyName', companyName)

                        let jurisdictionsArr = []
                        for (let i = 0; i < jurisdictions.length; i++) {
                            jurisdictionsArr.push(jurisdictions[i].code)
                        }
                        commit('setJurisdiction', jurisdictionsArr)

                        if (plots) {
                            let plotsMap = {}
                            for (let i = 0; i < plots.length; i++) {
                                let { plotNumber } = plots[i]
                                plotsMap[plotNumber] = plots[i]
                            }
                            commit('setPlots', plotsMap)
                            if (this.state.user.curPlotNumber && plotsMap[this.state.user.curPlotNumber]) { // 根据当前小区的字段，判断是第一次登录，还是登录后刷新页面

                            } else { // 如果没有的话，默认设置第一个
                                commit('setCurPlot', plots[0] ? plots[0].plotNumber : '')
                            }
                        }

                        resolve()
                    }
                }).catch(err => {
                    reject(err)
                })
            })
        },
        handleLogout({ commit }) {
            commit('setToken', '')
            commit('setUserId', '')
            commit('setPhone', '')
            commit('setRoleName', '')
            commit('setCompanyType', '')
            commit('setCompanyName', '')
            commit('setJurisdiction', [])
            commit('setPlots', {})
            commit('setCurPlot', '')
        },
        setCurPlot({ commit }, { plotNumber }) {
            commit('setCurPlot', plotNumber)
        }
    }
}