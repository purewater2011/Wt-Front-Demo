import * as TYPES from './mutations-types'
import { isEmpty } from 'lodash'

export default {
  [TYPES.SET_MAIN_HEIGHT] (state, value) {
    state.mainHeight = value
  },
  [TYPES.SET_MENUS] (state, value) {
    state.menus = value
  },
  [TYPES.SET_LEFTMENU_COLLAPSE] (state, value) {
    state.leftMenuCollapse = value
  },
  [TYPES.SET_LEFTMENUS] (state, value) {
    state.leftMenus = value
  },
  [TYPES.ADD_VISITED_VIEW] (state, view) {
    // toFix execeed
    if (!isEmpty(view.matched)) {
      let newview = { name: view.name, path: view.path, fullPath: view.fullPath, query: view.query, meta: view.meta }
      view = newview
    }
    if (state.visitedViews.some(v => v.path === view.path)) return
    state.visitedViews.push(
      Object.assign({}, view, {
        title: view.meta.title || 'no-name'
      })
    )
  },
  [TYPES.ADD_CACHED_VIEW] (state, view) {
    if (state.cachedViews.includes(view.name)) return
    if (!view.meta.noCache) {
      state.cachedViews.push(view.name)
    }
  },

  [TYPES.DEL_VISITED_VIEW] (state, view) {
    for (const [i, v] of state.visitedViews.entries()) {
      if (v.path === view.path) {
        state.visitedViews.splice(i, 1)
        break
      }
    }
  },
  [TYPES.DEL_CACHED_VIEW] (state, view) {
    for (const i of state.cachedViews) {
      if (i === view.name) {
        const index = state.cachedViews.indexOf(i)
        state.cachedViews.splice(index, 1)
        break
      }
    }
  },

  [TYPES.DEL_OTHERS_VISITED_VIEWS] (state, view) {
    for (const [i, v] of state.visitedViews.entries()) {
      if (v.path === view.path) {
        state.visitedViews = state.visitedViews.slice(i, i + 1)
        break
      }
    }
  },
  [TYPES.DEL_OTHERS_CACHED_VIEWS] (state, view) {
    for (const i of state.cachedViews) {
      if (i === view.name) {
        const index = state.cachedViews.indexOf(i)
        state.cachedViews = state.cachedViews.slice(index, index + 1)
        break
      }
    }
  },

  [TYPES.DEL_ALL_VISITED_VIEWS] (state) {
    state.visitedViews = []
  },
  [TYPES.DEL_ALL_CACHED_VIEWS] (state) {
    state.cachedViews = []
  },
  [TYPES.UPDATE_VISITED_VIEW] (state, view) {
    for (let v of state.visitedViews) {
      if (v.path === view.path) {
        v = Object.assign(v, view)
        break
      }
    }
  },
  [TYPES.SET_DEFAULT_MENU] (state, value) {
    state.defaultMenu = value
  },
  [TYPES.SET_USERDETAILINFO] (state, value) {
    state.userdetailinfo = value
  }
}
