import http from './http'

export const apiAdminGetWorkouts = () => http.get('/admin/workouts')
export const apiAdminDeleteWorkout = (id) => http.delete(`/admin/workouts/${id}`)
export const apiAdminGetStats = () => http.get('/admin/stats')
