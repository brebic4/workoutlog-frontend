import { defineStore } from 'pinia'
import { apiLogin, apiRegister, apiMe } from '../api/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    loading: false,
    error: null,
  }),
  getters: {
    isLoggedIn: (s) => !!s.token,
    isAdmin: (s) => s.user?.role === 'admin',
  },
  actions: {
    async register(payload) {
      this.loading = true
      this.error = null
      try {
        await apiRegister(payload)
      } catch (e) {
        this.error = e?.response?.data?.error || e.message
        throw e
      } finally {
        this.loading = false
      }
    },

    async login(email, password) {
      this.loading = true
      this.error = null
      try {
        const { data } = await apiLogin({ email, password })

        // očekujemo: { token, user }
        this.token = data.token
        this.user = data.user

        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
      } catch (e) {
        this.error = e?.response?.data?.error || e.message
        throw e
      } finally {
        this.loading = false
      }
    },

    async fetchMe() {
      if (!this.token) return
      try {
        const { data } = await apiMe()
        this.user = data.user
        localStorage.setItem('user', JSON.stringify(data.user))
      } catch {
        // ako token nije valjan -> očisti
        this.logout()
      }
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
  },
})
