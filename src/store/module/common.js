import { getStatusList } from '@/api/common'
export default {
    state: {
        statusList: {}
    },
    mutations: {
        setStatusList(state, statusList) {
            state.statusList = statusList
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
        }
    }
}