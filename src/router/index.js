import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import WorkoutsView from '../views/WorkoutsView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/workouts' },
    { path: '/login', component: LoginView, meta: { guestOnly: true } },
    { path: '/register', component: RegisterView, meta: { guestOnly: true } },
    { path: '/workouts', component: WorkoutsView, meta: { requiresAuth: true } },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  // ako ima token, a nema user (refresh), povuci /me
  if (auth.token && !auth.user) {
    await auth.fetchMe()
  }

  if (to.meta.requiresAuth && !auth.isLoggedIn) return '/login'
  if (to.meta.guestOnly && auth.isLoggedIn) return '/workouts'
})

export default router
