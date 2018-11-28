export default [
  {
    path: '/admin',
    component: () => import('./admin'),
    children: [
      {
        path: 'home',
        name: 'admin.home',
        meta: {
          requiresAuth: true,
          navbar: false
        },
        component: () => import('./common/basic')
      }
    ]
  }
]
