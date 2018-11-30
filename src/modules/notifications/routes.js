export default [
  {
    path: 'notifications',
    name: 'notifications.show',
    component: () => import('./show'),
    meta: {
      requiresAuth: true,
      navbar: false,
      adminnavbar: true
    }
  }
]
