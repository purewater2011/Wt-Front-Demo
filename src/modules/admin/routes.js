const META = {
  requiresAuth: true,
  navbar: false
}
export default [
  {
    path: '/admin',
    component: () => import('./admin'),
    children: [
      {
        path: 'home',
        name: 'admin.home',
        meta: META,
        component: () => import('./common/basic')
      }
    ]
  }
]
