import { Message } from 'element-ui'
import localforage from 'localforage'
import Cookies from 'js-cookie'
// src is a alias. see client/build/webpack.base.conf.js
import { userTokenStorageKey } from '@config'
import { isEmpty } from 'lodash'
import * as TYPES from './mutations-types'
import * as services from '@modules/auth/services'

export const attemptLogin = ({ dispatch }, payload) =>
  services.postLogin(payload)
    .then(({ access_token }) => {
      dispatch('setToken', access_token)

      return Promise.resolve()
    })
    .then(() => dispatch('loadUser'))

export const attemptRegister = ({ dispatch }, payload) =>
  services.postRegister(payload)
    .then(({ token }) => {
      dispatch('setToken', token)

      return Promise.resolve()
    })
    .then(() => dispatch('loadUser'))

export const logout = ({ dispatch }) => {
  return localforage.removeItem(userTokenStorageKey)
    .then(dispatch('setToken', null))
    .then(dispatch('setUser', {}))
}

export const setUser = ({ commit }, user) => {
  if (!user) {
    Cookies.remove('_token')
    return Promise.reject('用户信息已过期')
  }
  // Commit the mutations
  commit(TYPES.SET_USER, user)

  Promise.resolve(user) // keep promise chain
}

export const setToken = ({ commit }, payload) => {
  // prevent if payload is a object
  const token = (isEmpty(payload)) ? null : payload.token || payload

  // Commit the mutations
  commit(TYPES.SET_TOKEN, token)

  return Promise.resolve(token) // keep promise chain
}

export const checkUserToken = ({ dispatch, state }) => {
  // Cookies.set('_token', '8ea503ddeba6c4fc81e8ca646acaca987ueszpfq3ftizivfoh2nbumcict5bdwg')
  // If the token exists then all validation has already been done
  if (!isEmpty(state.token)) {
    return Promise.resolve(state.token)
  }
  let token = Cookies.get('_token')
  if (isEmpty(token)) {
    // Token is not saved in localstorage
    return Promise.reject('NO_TOKEN') // Reject promise
  }
  // Put the token in the vuex store
  return dispatch('setToken', token).then(() => {
    dispatch('loadUser')
  })
}

/**
 * Retrieves updated user information
 * If something goes wrong, the user's token is probably invalid
 */
export const loadUser = ({ dispatch }) => services.loadUserData()
  // store user's data
  .then(user => {
    if (user.code !== 0) {
      Message.error('用户信息获取失败，请退出重新登录！' + user.msg)
      return
    }
    dispatch('setUser', user.data).then(() => dispatch('getCurrentUserInfo'))
  })
