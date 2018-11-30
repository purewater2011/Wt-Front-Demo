import localforage from 'localforage'
import { leftMenuCollapseStorageKey, leftMenusStorageKey } from '@config'
import * as TYPES from './mutations-types'

export const getLeftMenus = ({ commit, state }, payload = {}) => {
  let menus = [
    { id: '9', icon: 'el-icon-location', title: '首页', route: '' },
    { id: '1', icon: 'el-icon-menu', title: 'menu1', route: '', child: [{ id: '2', title: 'submenu1-1' }, { id: '3', title: 'submenu1-2' }, { id: '4', title: 'submenu1-3', child: [{ id: '5', title: 'submenu1-3-1' }] }] },
    { id: '6', icon: 'el-icon-location', title: 'menu2', child: [{ id: '2', title: 'submenu1-1' }] },
    { id: '7', icon: 'el-icon-document', title: '研发管理', child: [{ id: '10', title: '代码发布' }] },
    { id: '8', icon: 'el-icon-setting', title: '设置', child: [{ id: '11', title: '用户管理' }, { id: '12', title: '权限设置' }] }
  ]
  commit(TYPES.SET_LEFTMENUS, menus)
  localforage.setItem(leftMenusStorageKey, menus)
  return Promise.resolve(menus)
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
