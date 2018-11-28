import localforage from 'localforage'
import { leftMenuCollapseStorageKey } from '@config'
import * as TYPES from './mutations-types'
import { isEmpty } from 'lodash'

export const setLeftMenuCollpose = ({ commit }, payload) => {
  if (isEmpty(payload)) {
    return localforage.getItem(leftMenuCollapseStorageKey)
      .then((status) => {
        let newstatus = !status
        commit(TYPES.SET_LEFTMENU_COLLAPSE, newstatus)
      })
  } else {
    const status = (isEmpty(payload)) ? null : payload.status || payload
    commit(TYPES.SET_LEFTMENU_COLLAPSE, status)
    return Promise.resolve(status)
  }
}

export const checkMenuStatus = ({ dispatch, state }) => {
  console.log(state)
  if (!isEmpty(state.leftMenuCollapse)) {
    return Promise.resolve(state.leftMenuCollapse)
  }
  return localforage.getItem(leftMenuCollapseStorageKey)
    .then((status) => {
      if (isEmpty(status)) {
        status = false
      }
      // Put the token in the vuex store
      return dispatch('setLeftMenuCollpose', status) // keep promise chain
    })
}
