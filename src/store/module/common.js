import { getStatusList } from '@/api/common'
export default {
    state: {
        statusList: {},
        openHostManageTime: null // 当这个时间变化时，找开防盗主机页
    },
    mutations: {
        setStatusList(state, statusList) {
            state.statusList = statusList
        },
        updateOpenHostManageTime(state, time) {
            state.openHostManageTime = time
        }
    },
    getters: {

    },
    actions: {
        handleGetStatusList({ commit }) {
            return new Promise((resolve, reject) => {
                getStatusList({}).then(({ data, errorCode }) => {
                    // console.log('所有状态', data)
                    if (errorCode === 0) {
                        commit('setStatusList', data)
                        resolve()
                    } else {
                        reject()
                    }
                })
            })
        },
        updateOpenHostManageTime({ commit }, time) {
            commit('updateOpenHostManageTime', time)
        }

    }
}