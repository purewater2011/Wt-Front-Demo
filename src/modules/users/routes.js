const META = {
  requiresAuth: true,
  navbar: false,
  adminnavbar: true
}

export default [
  {
    path: '/user',
    component: () => import('./profile'),
    children: [
      {
        path: 'profile',
        name: 'user.profile',
        meta: META,
        component: () => import('./profile/basic')
      },
      {
        path: 'account',
        name: 'user.account',
        meta: META,
        component: () => import('./profile/account')
      },
      {
        path: 'extends',
        name: 'user.extends',
        meta: META,
        component: () => import('./profile/extends')
      },
      {
        path: 'notification',
        name: 'user.notification-setting',
        meta: META,
        component: () => import('./profile/notification')
      },
      {
        path: 'bindings',
        name: 'user.bindings',
        meta: META,
        component: () => import('./profile/bindings')
      },
      {
        path: 'avatar',
        name: 'user.avatar',
        meta: META,
        component: () => import('./profile/avatar')
      },
      {
        path: 'blacklist',
        name: 'user.blacklist',
        meta: META,
        component: () => import('./profile/blacklist')
      }
    ]
  }
]
