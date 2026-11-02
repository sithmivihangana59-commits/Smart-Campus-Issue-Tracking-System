const routes = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'root',
        redirect: () => {
          const token = localStorage.getItem('token')
          const userStr = localStorage.getItem('user')
          let user = null
          if (userStr) {
            try {
              user = JSON.parse(userStr)
            } catch {
              user = null
            }
          }
          if (token && user) {
            const role = user.role
            if (role === 'Admin') return '/admin-dashboard'
            return role === 'Staff' ? '/staff-dashboard' : '/student-dashboard'
          }
          return '/login'
        }
      },
      {
        path: 'login',
        name: 'login',
        component: () => import('@/pages/LoginPage.vue')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('@/pages/RegistrationPage.vue')
      },
      {
        path: 'student-dashboard',
        name: 'student-dashboard',
        component: () => import('@/pages/IndexPage.vue')
      },
      {
        path: 'staff-dashboard',
        name: 'staff-dashboard',
        component: () => import('@/pages/StaffDashboardPage.vue')
      },
      {
        path: 'admin-dashboard',
        name: 'admin-dashboard',
        component: () => import('@/pages/AdminDashboardPage.vue')
      },
      {
        path: 'report-issue',
        name: 'report-issue',
        component: () => import('@/pages/ReportIssuePage.vue')
      },
      {
        path: 'second',
        name: 'second',
        component: () => import('@/pages/SecondPage.vue')
      }
    ]
  },

  // Always leave this as last one
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/ErrorNotFound.vue')
  }
]

export default routes
