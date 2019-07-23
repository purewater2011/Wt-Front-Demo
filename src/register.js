import Vue from 'vue'
import _ from 'underscore'
import components from '@components'
import draggable from 'vuedraggable'

// 注册组件
_.each(components, (item, key) => {
  Vue.component(`${key}`, item)
})

Vue.use(draggable)
