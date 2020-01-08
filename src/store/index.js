import Vue from 'vue'
import Vuex from 'vuex'

import user from './module/user'
import common from './module/common'
import createPersistedState from "vuex-persistedstate"
Vue.use(Vuex)

const store = new Vuex.Store({
    plugins: [createPersistedState({
        // reducer(val) {
        //     return {
        //         user: {
        //             token: val.user.token
        //         }
        //     }
        // }
    })],
    state: {},

    mutations: {
        //
    },
    actions: {
        //
    },
    modules: {
        user,
        common
    }
})

export default store