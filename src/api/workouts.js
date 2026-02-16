import http from './http'

export const apiGetWorkouts = () => http.get('/workouts')
export const apiCreateWorkout = (payload) => http.post('/workouts', payload)
export const apiDeleteWorkout = (id) => http.delete(`/workouts/${id}`)
