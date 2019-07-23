import state from './state'
import mutations from './mutations'
import plugin from './plugin'
import * as actions from './actions'
import * as getters from './getters'

import * as audio from '../audio/vuex'
import * as setting from '../setting/vuex'

import { mergeWith, isArray } from 'lodash'

function customizer (objValue, srcValue) {
  if (isArray(objValue)) {
    return objValue.concat(srcValue)
  }
}
let ext = [audio, setting]
let sys = {
  state,
  mutations,
  actions,
  getters
}

ext.forEach((value) => {
  sys = mergeWith(sys, value, customizer)
})

export default {
  module: sys,
  plugin
}
