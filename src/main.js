import './bootstrap'
import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import store from './vuex'
import router from './router'
import Root from './root'
import http from '@utils/http'
import ElementUI, { Message, Button, Row, Col, Icon, Footer, Input, Form, FormItem } from 'element-ui'
import './icons' // icon
import './register' // register other
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/message.css'
import 'element-ui/lib/theme-chalk/icon.css'

Vue.use(ElementUI)

Vue.config.productionTip = false

Vue.component(Button.name, Button)
Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Icon.name, Icon)
Vue.component(Footer.name, Footer)
Vue.component(Input.name, Input)
Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem)

sync(store, router)

Vue.prototype.$message = Message
Vue.prototype.$http = http
Vue.prototype.$user = () => {
  return store.getters.currentUser
}

setTimeout(() => {
  new Vue({
    store,
    router,
    render: h => h(Root)
  }).$mount('#app')
}, 200)
