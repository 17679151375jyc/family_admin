import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import config from '@/config'
import store from '@/store'
const { homeName } = config
const LOGIN_PATH_NAME = 'login'


Vue.use(Router)
const router = new Router({
    mode: 'hash',
    // base: process.env.BASE_URL,
    routes: routes
})

router.beforeEach((to, form, next) => {
    let token = store.state.user && store.state.user.token
    if (!token && to.name !== LOGIN_PATH_NAME) {
        // 未登录且要跳转的页面不是登录页
        next({
            name: LOGIN_PATH_NAME // 跳到登录页
        })
    } else if (!token && to.name === LOGIN_PATH_NAME) {
        // 未登录且要跳转的页面是登录页
        next()
    } else if (token && to.name === LOGIN_PATH_NAME) {
        // 已登录且要跳转的页面是登录页
        next({
            name: homeName // 跳转到homeName页
        })
    } else if (token && to.name !== LOGIN_PATH_NAME) {
        next()
    }
})
export default router