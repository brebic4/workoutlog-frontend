import { defineStore } from 'pinia'
import { apiAdminGetWorkouts, apiAdminDeleteWorkout, apiAdminGetStats } from '../api/admin'

export const useAdminStore = defineStore('admin', {
  state: () => ({
    workouts: [],
    stats: null,
    loadingWorkouts: false,
    loadingStats: false,
    error: null,
  }),
  actions: {
    async fetchAdminWorkouts() {
      this.loadingWorkouts = true
      this.error = null
      try {
        const { data } = await apiAdminGetWorkouts()
        this.workouts = Array.isArray(data) ? data : []
      } catch (e) {
        this.error =
          e?.response?.data?.message ||
          e?.response?.data?.error?.message ||
          e?.response?.data?.error ||
          e?.message ||
          'Greška pri dohvaćanju admin workouta.'
      } finally {
        this.loadingWorkouts = false
      }
    },

    async fetchAdminStats() {
      this.loadingStats = true
      this.error = null
      try {
        const { data } = await apiAdminGetStats()
        this.stats = data
      } catch (e) {
        this.error =
          e?.response?.data?.message ||
          e?.response?.data?.error?.message ||
          e?.response?.data?.error ||
          e?.message ||
          'Greška pri dohvaćanju admin statistika.'
      } finally {
        this.loadingStats = false
      }
    },

    async deleteAdminWorkout(id) {
      this.error = null
      try {
        await apiAdminDeleteWorkout(id)
        this.workouts = this.workouts.filter((w) => String(w.id) !== String(id))
      } catch (e) {
        this.error =
          e?.response?.data?.message ||
          e?.response?.data?.error?.message ||
          e?.response?.data?.error ||
          e?.message ||
          'Greška pri brisanju workouta (admin).'
        throw e
      }
    },
  },
})
