import * as TYPES from './mutations-types'
export default {
  [TYPES.SET_MENUS] (state, value) {
    state.menus = value
  },
  [TYPES.SET_LEFTMENU_COLLAPSE] (state, value) {
    state.leftMenuCollapse = value
  }
}
