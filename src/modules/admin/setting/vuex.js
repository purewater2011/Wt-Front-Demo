import http from '@utils/http'
import { APIS } from '@config/APIS'
import { formatTimeInData } from '../../../utils'

const mutationsTypes = {
  'GET_USER_LIST': 'ADMIN//GET_USER_LIST',
  'GET_MENU_LIST': 'ADMIN//GET_MENU_LIST',
  'GET_ROLE_LIST': 'ADMIN//GET_ROLE_LIST'
}

export const actions = {
  async getUserList ({ commit, state }, payload = {}) {
    let rs = await http.post(APIS.GET_USER_LIST, payload)
    let data = formatTimeInData(rs.data.list)
    let count = rs.data.total
    commit(mutationsTypes.GET_USER_LIST, { list: data, total: count })
    return Promise.resolve({ list: data, total: count })
  },
  async getRoleList ({ commit, state }, payload = {}) {
    let rs = await http.post(APIS.GET_ROLE_LIST, payload)
    let data = formatTimeInData(rs.data.list)
    let count = rs.data.total
    commit(mutationsTypes.GET_ROLE_LIST, { list: data, total: count })
    return Promise.resolve({ list: data, total: count })
  },
  async getMenuList ({ commit, state }, payload = {}) {
    let rs = await http.post(APIS.GET_MENU_LIST, payload)
    let data = formatTimeInData(rs.data.list)
    let count = rs.data.total
    commit(mutationsTypes.GET_MENU_LIST, { list: data, total: count })
    return Promise.resolve({ list: data, total: count })
  },
  async getRoleMenuList ({ commit, state }, payload = {}) {
    let rs = await http.post(APIS.GET_ROLE_MENU_LIST, payload)
    return Promise.resolve(rs.data)
  }
}

export const getters = {
  userList: ({ userList }) => userList,
  roleList: ({ roleList }) => roleList,
  menusList: ({ menuList }) => menuList
}

export const mutations = {
  [mutationsTypes.GET_USER_LIST] (state, value) {
    state.userList = value
  },
  [mutationsTypes.GET_ROLE_LIST] (state, value) {
    state.roleList = value
  },
  [mutationsTypes.GET_MENU_LIST] (state, value) {
    state.menuList = value
  }
}

export const state = {
  userList: { list: [], total: 0 },
  roleList: { list: [], total: 0 },
  menuList: { list: [], total: 0 }
}
