import Vue from 'vue'
import App from './App.vue'
import config from '@/config'
import ViewUi from 'view-design'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import VueDraggableResizable from "vue-draggable-resizable"; // 放大拖拽
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
import router from '@/router/index'
import store from '@/store/index'

import '@/stylus/index.styl'
import '_a/icons/iconfont.css'
// import 'view-design/dist/styles/iview.css';
import '@/stylus/theme.less'
import TreeTable from 'tree-table-vue' // 树状表格
import JsonViewer from 'vue-json-viewer'

import Print from './print' // 引入附件的js文件
Vue.use(Print) // 注册

import * as custom from '@/libs/filters'
Object.keys(custom).forEach(key => { // 注册全局过滤器
    Vue.filter(key, custom[key])
})

import Emoji from 'emoji'
Vue.prototype.$emoji = Emoji

import moment from 'moment' // 时间格式化
Vue.prototype.$moment = moment;
moment.locale('zh-cn') //需要汉化
Vue.use(TreeTable)
Vue.use(VueDraggableResizable)
Vue.use(ViewUi)
Vue.use(Viewer)
Vue.use(JsonViewer)
Vue.config.productionTip = false
Viewer.setDefaults({
    Options: { 'inline': true, 'button': true, 'navbar': true, 'title': true, 'toolbar': true, 'tooltip': true, 'movable': true, 'zoomable': true, 'rotatable': true, 'scalable': true, 'transition': true, 'fullscreen': true, 'keyboard': true, 'url': 'data-source' }
})

/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
    /**
     * 注册指令
     */
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})