import { merge } from 'lodash'
const META = {
  requiresAuth: true,
  navbar: false
}

const mergeMeta = (title) => {
  return merge({ title: title }, META)
}

export default [
  {
    path: '/admin',
    component: () => import('./admin'),
    children: [
      {
        path: 'home',
        name: 'admin.home',
        meta: mergeMeta('首页'),
        component: () => import('./common/home')
      },
      {
        path: 'sms-send',
        name: 'admin.sms.send',
        meta: mergeMeta('发送短信'),
        component: () => import('./sms/send')
      },
      {
        path: 'poster-list',
        name: 'admin.poster.list',
        meta: mergeMeta('海报列表'),
        component: () => import('./poster/list')
      },
      {
        path: 'poster-add',
        name: 'admin.poster.add',
        meta: mergeMeta('添加海报'),
        component: () => import('./poster/add')
      },
      {
        path: 'audio-add',
        name: 'admin.audio.add',
        meta: mergeMeta('添加语音模板'),
        component: () => import('./audio/add')
      },
      {
        path: 'audio-batchadd',
        name: 'admin.audio.batchadd',
        meta: mergeMeta('批量添加语音模板'),
        component: () => import('./audio/batchadd')
      },
      {
        path: 'audio-edit/:id',
        name: 'admin.audio.edit',
        meta: mergeMeta('编辑语音模板'),
        component: () => import('./audio/edit')
      },
      {
        path: 'audio-list',
        name: 'admin.audio.list',
        meta: mergeMeta('语音模板列表'),
        component: () => import('./audio/list')
      },
      {
        path: 'audio-feedback-list',
        name: 'admin.audio.feedbacklist',
        meta: mergeMeta('考场反馈列表'),
        component: () => import('./audio/feedbacklist')
      },
      {
        path: 'audio-feedback-edit/:id',
        name: 'admin.audio.feedbackedit',
        meta: mergeMeta('编辑反馈'),
        component: () => import('./audio/feedbackedit')
      },
      {
        path: 'setting-user',
        name: 'admin.setting.user',
        meta: mergeMeta('用户管理'),
        component: () => import('./setting/users')
      },
      {
        path: 'setting-usergroup',
        name: 'admin.setting.usergroup',
        meta: mergeMeta('角色组管理'),
        component: () => import('./setting/usergroup')
      },
      {
        path: 'setting-menus',
        name: 'admin.setting.menu',
        meta: mergeMeta('菜单管理'),
        component: () => import('./setting/menus')
      },
      {
        path: 'qc-list',
        name: 'admin.qc.list',
        meta: mergeMeta('质量管理'),
        component: () => import('./qc/list')
      }
    ]
  }
]
