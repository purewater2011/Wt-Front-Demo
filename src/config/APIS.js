const url = window.location.host
var env = process.env.NODE_ENV
if (url === 'cjjl-admin.chelun.com') {
  env = 'production'
} else if (url === 'cjjl-admin-test.chelun.com') {
  env = 'dev'
} else {
  env = 'local'
}
var DOMAIN = 'http://cjjl.dev.chelun.com'
var H5DOMAIN = 'http://h5kjz.chelun.com'
switch (env) {
  case 'production':
    DOMAIN = 'http://cjjl.chelun.com'
    H5DOMAIN = 'http://xch5.chelun.com'
    break
  case 'dev':
    DOMAIN = 'http://dev.cjjl.chelun.com'
    H5DOMAIN = 'http://h5kjz.chelun.com'
    break
}
console.log('domain', url, DOMAIN, env)
const VERSION = '/cjjl_v99'

const APIS = {
  // base
  LOGIN: DOMAIN + VERSION + '/admin/login',
  // student
  GET_SUBSCRIBE: DOMAIN + '/statistic/studentall',
  // activity
  GET_IN_KING_NUM: DOMAIN + '/KingCoach/Count',
  GET_COUNT_LIST: DOMAIN + '/KingCoach/CountEnterUser',
  GET_CITY_LIST: DOMAIN + '/sys/CityList',
  GET_KING_AVG: DOMAIN + VERSION + '/king/Avg',
  // market
  POST_SMS_SEND: DOMAIN + VERSION + '/sms/send',
  GET_SMS_LOG: DOMAIN + VERSION + '/sms/loglist',
  GET_SEND_LOG: DOMAIN + VERSION + '/sms/sendlog',
  // audio
  POST_AUDIO_LIST: DOMAIN + VERSION + '/audio/tmplist',
  GET_SYSTEM_LIST: DOMAIN + VERSION + '/audio/syslist',
  GET_SYSTEM_INFO: DOMAIN + VERSION + '/audio/gettmpinfo?id=',
  POST_ADD_AUDIO: DOMAIN + VERSION + '/audio/addtpl',
  POST_BATCH_ADD_AUDIO: DOMAIN + VERSION + '/audio/batchaddtpl',
  POST_BATCH_DEL_TPL: DOMAIN + VERSION + '/audio/batchdeltpl',
  POST_BATCH_PUBLISH_TPL: DOMAIN + VERSION + '/audio/batchpublishtpl',
  POST_EDIT_AUDIO: DOMAIN + VERSION + '/audio/edittpl',
  // poster
  POST_POSTER_LIST: DOMAIN + VERSION + '/poster/alllist',
  POST_ADD_POSTER: DOMAIN + VERSION + '/poster/add',
  POST_EDIT_POSTER: DOMAIN + VERSION + '/poster/edit',
  GET_POSTER_INFO: DOMAIN + VERSION + '/poster/info',
  // feedback-audio
  POST_FEEDBACK_LIST: DOMAIN + VERSION + '/audio/FeedBackList',
  GET_FEEDBACK_INFO: DOMAIN + VERSION + '/audio/FeedBackInfo?id=',
  GET_COACHINFO: DOMAIN + VERSION + '/audio/GetCoachInfoById?id=',
  POST_EDIT_FEEDBACK: DOMAIN + VERSION + '/Audio/UpdateFeedBack',
  // setting
  GET_USER_LIST: DOMAIN + VERSION + '/Admin/Users',
  GET_USER_MENUS: DOMAIN + VERSION + '/Admin/UserInfo',
  GET_USER_ROLES: DOMAIN + VERSION + '/Admin/UserInfo',
  POST_DISTRI_ROLES: DOMAIN + VERSION + '/Admin/distriRoles',
  GET_ROLE_LIST: DOMAIN + VERSION + '/Admin/AllRoles',
  GET_MENU_LIST: DOMAIN + VERSION + '/Admin/AllMenus',
  GET_ROLE_MENU_LIST: DOMAIN + VERSION + '/Admin/RoleMenus',
  POST_ADD_MENU: DOMAIN + VERSION + '/Admin/addMenu',
  POST_EDIT_MENU: DOMAIN + VERSION + '/Admin/editMenu',
  POST_EDIT_ROLE: DOMAIN + VERSION + '/Admin/editRole',
  POST_ADD_ROLE: DOMAIN + VERSION + '/Admin/addRole',
  POST_DISTRI_MENU: DOMAIN + VERSION + '/Admin/distriMenu'
}

export {
  DOMAIN,
  VERSION,
  APIS,
  H5DOMAIN,
  env
}
