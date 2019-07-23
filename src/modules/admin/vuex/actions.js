import localforage from 'localforage'
import { leftMenuCollapseStorageKey, leftMenusStorageKey, userDetailInfo } from '@config'
import * as TYPES from './mutations-types'
import { find, isEmpty, flattenDeep } from 'lodash'
import { default as http } from '@utils/http'
import { APIS } from '../../../config/APIS'

export const getLeftMenus = async ({ dispatch, commit, rootState, state }, payload = {}) => {
  let menus = [
    { id: '1', icon: 'el-icon-location', title: '首页', route: 'admin.home' },
    { id: '2', icon: 'el-icon-menu', title: '短信', route: '', child: [{ id: '3', title: '群发短信', route: 'admin.sms.send' }, { id: '4', title: '发送记录' }] },
    { id: '5', icon: 'el-icon-document', title: '海报', child: [{ id: '6', title: '列表', route: 'admin.poster.list' }, { id: '15', title: '添加', route: 'admin.poster.add' }] },
    { id: '7', icon: 'el-icon-location', title: '语音', child: [{ id: '8', title: '模板', child: [{ id: '9', title: '列表', route: 'admin.audio.list' }, { id: '10', title: '添加', route: 'admin.audio.add' }, { id: '16', title: '批量添加', route: 'admin.audio.batchadd' }] }, { id: '11', title: '系统反馈', route: 'admin.audio.feedbacklist' }] },
    { id: '16', icon: 'el-icon-menu', title: '质量', route: '', child: [{ id: '17', title: '问题反馈', route: 'admin.qc.list' }] },
    { id: '12', icon: 'el-icon-setting', title: '设置', child: [{ id: '13', title: '用户管理', route: 'admin.setting.user' }, { id: '14', title: '角色管理', route: 'admin.setting.usergroup' }, { id: '15', title: '菜单管理', route: 'admin.setting.menu' }] }
  ]
  let local = await localforage.getItem(userDetailInfo)
  let userinfo =  _.isEmpty(state.userdetailinfo) ? local : state.userdetailinfo
  if (!_.isEmpty(userinfo)) {
    let xinmenus = userinfo.menus
    let map = { id: 'id', menu_icon: 'icon', menu_name: 'title', menu_url: 'route', parent_id: 'parent_id' }
    let newmenus = []
    xinmenus.forEach(value => {
      let tt = {}
      _.forIn(map, (v, k) => {
        tt[v] = value[k]
      })
      newmenus.push(tt)
    })
    xinmenus = newmenus
    let base = _.groupBy(xinmenus, { parent_id: '0' })
    let baseTrue = base[true]
    let baseFalse = base[false]
    _.forEach(baseTrue, (value, key) => {
      let base2 = _.groupBy(baseFalse, { parent_id: value.id })
      baseTrue[key]['child'] = base2[true]
      if (base2[false]) {
        _.forEach(base2[true], (vv, kk) => {
          let base3 = _.groupBy(base2[false], { parent_id: vv.id })
          if (base3[true]) {
            baseTrue[key]['child'][kk]['child'] = base3[true]
          }
        })
      }
    })
    console.log('formatmenus', baseTrue)
    menus = baseTrue
  }
  console.log('menus', menus)
  commit(TYPES.SET_LEFTMENUS, menus)
  localforage.setItem(leftMenusStorageKey, menus)
  return Promise.resolve(menus)
}

export const getCurrentUserInfo = async ({ commit, state, rootState }, payload = {}) => {
  if (!_.isEmpty(rootState.Auth['user'])) {
    let userinfo = await http.post(APIS.GET_USER_MENUS, { user_phone: rootState.Auth.user.mobile })
    commit(TYPES.SET_USERDETAILINFO, userinfo.data)
    localforage.setItem(userDetailInfo, userinfo.data)
    return Promise.resolve(userinfo)
  }
}

export const getUserDetail = async ({ commit, state, rootState }, payload = {}) => {
  let userinfo = await http.post(APIS.GET_USER_MENUS, payload)
  return Promise.resolve(userinfo)
}

export const setDefaultMenu = ({ commit, state }, menu) => {
  commit(TYPES.SET_DEFAULT_MENU, menu)
}

export const setMainHeight = ({ commit, state }, height) => {
  commit(TYPES.SET_MAIN_HEIGHT, height)
}
function formatMenus (menus) {
  return menus.map(menu => {
    if (!isEmpty(menu['child'])) {
      return formatMenus(menu['child'])
    } else {
      return menu
    }
  })
}
export const checkMenu = async ({ dispatch, state }, route) => {
  let leftMenus = state.leftMenus
  if (isEmpty(leftMenus)) {
    leftMenus = await dispatch('getLeftMenus')
  }
  let newmenus = formatMenus(leftMenus)
  let findMenu = find(flattenDeep(newmenus), { route: route.name })
  if (findMenu) {
    dispatch('setDefaultMenu', findMenu)
  }
}
export const setLeftCollapse = async ({ commit, state }, payload) => {
  let currentstatus = false
  if (typeof payload === 'undefined') {
    currentstatus = await localforage.getItem(leftMenuCollapseStorageKey)
  } else {
    currentstatus = payload.status || payload
  }
  let newstatus = !currentstatus
  commit(TYPES.SET_LEFTMENU_COLLAPSE, newstatus)
  localforage.setItem(leftMenuCollapseStorageKey, newstatus)
  return Promise.resolve(newstatus)
}

export const checkMenuStatus = ({ dispatch, state }) => {
  return localforage.getItem(leftMenuCollapseStorageKey)
    .then((status) => {
      dispatch('getLeftMenus')
      // Put the token in the vuex store
      return dispatch('setLeftCollapse', !status) // keep promise chain
    }).catch((err) => {
      console.error('checkMenuStatus-error', err)
    })
}

// tabviews
export const addView = ({ dispatch }, view) => {
  dispatch('addVisitedView', view)
  dispatch('addCachedView', view)
}

export const addVisitedView = ({ commit }, view) => {
  commit(TYPES.ADD_VISITED_VIEW, view)
}

export const addCachedView = ({ commit }, view) => {
  commit(TYPES.ADD_CACHED_VIEW, view)
}

export const delView = ({ dispatch, state }, view) => {
  return new Promise(resolve => {
    dispatch('delVisitedView', view)
    dispatch('delCachedView', view)
    resolve({
      visitedViews: [...state.visitedViews],
      cachedViews: [...state.cachedViews]
    })
  })
}
export const delVisitedView = ({ commit, state }, view) => {
  return new Promise(resolve => {
    commit(TYPES.DEL_VISITED_VIEW, view)
    resolve([...state.visitedViews])
  })
}

export const delCachedView = ({ commit, state }, view) => {
  return new Promise(resolve => {
    commit(TYPES.DEL_CACHED_VIEW, view)
    resolve([...state.cachedViews])
  })
}

export const delOthersViews = ({ dispatch, state }, view) => {
  return new Promise(resolve => {
    dispatch('delOthersVisitedViews', view)
    dispatch('delOthersCachedViews', view)
    resolve({
      visitedViews: [...state.visitedViews],
      cachedViews: [...state.cachedViews]
    })
  })
}

export const delOthersVisitedViews = ({ commit, state }, view) => {
  return new Promise(resolve => {
    commit(TYPES.DEL_OTHERS_VISITED_VIEWS, view)
    resolve([...state.visitedViews])
  })
}

export const delOthersCachedViews = ({ commit, state }, view) => {
  return new Promise(resolve => {
    commit(TYPES.DEL_OTHERS_CACHED_VIEWS, view)
    resolve([...state.cachedViews])
  })
}

export const delAllViews = ({ dispatch, state }, view) => {
  return new Promise(resolve => {
    dispatch('delAllVisitedViews', view)
    dispatch('delAllCachedViews', view)
    resolve({
      visitedViews: [...state.visitedViews],
      cachedViews: [...state.cachedViews]
    })
  })
}

export const delAllVisitedViews = ({ commit, state }) => {
  return new Promise(resolve => {
    commit(TYPES.DEL_ALL_VISITED_VIEWS)
    resolve([...state.visitedViews])
  })
}

export const delAllCachedViews = ({ commit, state }) => {
  return new Promise(resolve => {
    commit(TYPES.DEL_ALL_CACHED_VIEWS)
    resolve([...state.cachedViews])
  })
}

export const updateVisitedView = ({ commit }, view) => {
  commit(TYPES.UPDATE_VISITED_VIEW, view)
}
