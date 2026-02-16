import http from './http'

export const apiRegister = (payload) => http.post('/auth/register', payload)
export const apiLogin = (payload) => http.post('/auth/login', payload)
export const apiMe = () => http.get('/auth/me')
