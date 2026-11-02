import { defineRouter } from '#q-app'
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory
} from 'vue-router'

import routes from './routes.js'

export default defineRouter((/* { store, ssrContext } */) => {
  const createHistory = import.meta.env.QUASAR_SERVER
    ? createMemoryHistory
    : import.meta.env.QUASAR_VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(import.meta.env.QUASAR_VUE_ROUTER_BASE)
  })

  // Global Navigation Guard for Route Protection and Role Redirects
  Router.beforeEach((to, from, next) => {
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

    const isAuthenticated = !!(token && user)
    const userRole = user?.role
    const targetPath = to.path.replace(/\/+$/, '') || '/'
    const homeByRole = userRole === 'Admin'
      ? '/admin-dashboard'
      : userRole === 'Staff'
        ? '/staff-dashboard'
        : '/student-dashboard'

    if (targetPath === '/' || targetPath === '/login') {
      if (!isAuthenticated) {
        return targetPath === '/' ? next('/login') : next()
      }
      return next(homeByRole)
    }

    if (targetPath === '/admin-dashboard') {
      if (!isAuthenticated) return next('/login')
      if (userRole !== 'Admin') return next(homeByRole)
    }

    if (targetPath === '/staff-dashboard') {
      if (!isAuthenticated) return next('/login')
      if (userRole === 'Admin' || userRole === 'Student') return next(homeByRole)
    }

    if (targetPath === '/student-dashboard') {
      if (!isAuthenticated) return next('/login')
      if (userRole === 'Admin' || userRole === 'Staff') return next(homeByRole)
    }

    if (targetPath === '/report-issue' && !isAuthenticated) {
      return next('/login')
    }

    next()
  })

  return Router
})
