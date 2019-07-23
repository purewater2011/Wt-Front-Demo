import http from '@utils/http'
import { APIS } from '@config/APIS'

const mutationsTypes = {
  'GET_SYSTEM_LIST': 'ADMIN//GET_SYSTEM_LIST'
}

export const actions = {
  async getSysList ({ commit, state }, payload = {}) {
    let rs = await http.get(APIS.GET_SYSTEM_LIST)
    commit(mutationsTypes.GET_SYSTEM_LIST, rs.result)
    return Promise.resolve(rs.result)
  }
}

export const getters = {
  systemList: ({ systemList }) => systemList
}

export const mutations = {
  [mutationsTypes.GET_SYSTEM_LIST] (state, value) {
    state.systemList = value
  }
}

export const state = {
  systemList: []
}
