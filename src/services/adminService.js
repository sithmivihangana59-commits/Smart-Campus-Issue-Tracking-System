import { api } from '@/boot/axios'

export async function getAdminUsers () {
  const response = await api.get('/users')
  return response.data
}

export async function createManagedUser (userData) {
  const response = await api.post('/users', userData)
  return response.data
}

export async function updateManagedUser (userId, userData) {
  const response = await api.patch(`/users/${userId}`, userData)
  return response.data
}
