import axios from 'axios'

let authExpiredEmitted = false

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  } else {
    authExpiredEmitted = false
  }

  return config
})

http.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.error?.message ||
      err?.response?.data?.error ||
      err?.message ||
      ''

    const looksLikeAuthProblem =
      status === 401 ||
      (typeof msg === 'string' &&
        (msg.toLowerCase().includes('token') ||
          msg.toLowerCase().includes('jwt') ||
          msg.toLowerCase().includes('unauthorized')))

    if (looksLikeAuthProblem && !authExpiredEmitted) {
      authExpiredEmitted = true
      err.__handled = true

      window.dispatchEvent(
        new CustomEvent('auth-expired', {
          detail: {
            title: 'Sesija istekla',
            message: 'Sesija istekla, molimo prijavite se ponovno.',
          },
        }),
      )
    }

    return Promise.reject(err)
  },
)

export default http
