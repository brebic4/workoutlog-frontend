import { defineStore } from 'pinia'
import {
  apiGetWorkouts,
  apiCreateWorkout,
  apiDeleteWorkout,
  apiUpdateWorkout,
} from '../api/workouts'

export const useWorkoutsStore = defineStore('workouts', {
  state: () => ({
    workouts: [],
    loading: false,
    error: null,
    highlightId: null,
  }),
  actions: {
    async fetchWorkouts() {
      this.loading = true
      this.error = null
      try {
        const { data } = await apiGetWorkouts()
        // očekujemo data = { workouts: [...] } ili direkt array
        this.workouts = Array.isArray(data) ? data : data.workouts || []
      } catch (e) {
        this.error =
          e?.response?.data?.message ||
          e?.response?.data?.error?.message ||
          e?.response?.data?.error ||
          e?.message ||
          'Greška pri dohvaćanju workouta.'
      } finally {
        this.loading = false
      }
    },

    async createWorkout(payload) {
      this.loading = true
      this.error = null
      try {
        const { data } = await apiCreateWorkout(payload)
        const created = data.workout || data
        // dodaj na vrh liste
        this.workouts = [created, ...this.workouts]
        return created
      } catch (e) {
        this.error =
          e?.response?.data?.message ||
          e?.response?.data?.error?.message ||
          e?.response?.data?.error ||
          e?.message ||
          'Greška pri kreiranju workouta.'
        throw e
      } finally {
        this.loading = false
      }
    },

    async deleteWorkout(id) {
      this.error = null
      try {
        await apiDeleteWorkout(id)

        this.workouts = this.workouts.filter((w) => String(w.id ?? w._id) !== String(id))
      } catch (e) {
        this.error =
          e?.response?.data?.message ||
          e?.response?.data?.error?.message ||
          e?.response?.data?.error ||
          e?.message ||
          'Greška pri brisanju workouta.'
        throw e
      }
    },

    async updateWorkout(id, payload) {
      this.error = null
      try {
        const { data } = await apiUpdateWorkout(id, payload)

        const updated = data.workout || data

        // update u listi (id ili _id fallback)
        this.workouts = this.workouts.map((w) => {
          const wid = String(w.id)
          if (wid !== String(id)) return w
          return { ...w, ...updated }
        })
        this.highlightId = String(id)
        setTimeout(() => {
          if (this.highlightId === String(id)) this.highlightId = null
        }, 1100)

        return updated
      } catch (e) {
        this.error =
          e?.response?.data?.message ||
          e?.response?.data?.error?.message ||
          e?.response?.data?.error ||
          e?.message ||
          'Greška pri ažuriranju workouta.'
        throw e
      }
    },
  },
})
