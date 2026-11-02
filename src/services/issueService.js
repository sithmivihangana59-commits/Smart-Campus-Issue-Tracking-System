import { api } from '@/boot/axios'

export function getIssueImageUrl(image) {
  if (!image) return ''

  const imagePath = String(image).trim()
  if (/^https?:\/\//i.test(imagePath)) return imagePath

  const normalizedPath = imagePath.replace(/\\/g, '/').replace(/^\/+/, '')
  const uploadPath = normalizedPath.startsWith('uploads/')
    ? normalizedPath
    : `uploads/${normalizedPath.split('/').pop()}`

  return `/${uploadPath.split('/').map(encodeURIComponent).join('/')}`
}

export async function createIssue(issueData) {
  const response = await api.post('/issues', issueData)
  return response.data
}

export async function getMyIssues() {
  const response = await api.get('/issues/my')
  return response.data
}

export async function getAllIssues() {
  const response = await api.get('/issues')
  return response.data
}

export async function assignIssue(issueId, staffId) {
  const response = await api.put(`/issues/${issueId}/assign`, { staffId })
  return response.data
}

export async function getStaffList() {
  const response = await api.get('/users/staff')
  return response.data
}

export async function updateIssue(issueId, issueData) {
  const response = await api.put(`/issues/${issueId}`, issueData)
  return response.data
}

export async function deleteIssue(issueId) {
  const response = await api.delete(`/issues/${issueId}`)
  return response.data
}

export async function addIssueUpdate(issueId, updateData) {
  const response = await api.post(`/issues/${issueId}/updates`, updateData)
  return response.data
}

export async function getIssueUpdates(issueId) {
  const response = await api.get(`/issues/${issueId}/updates`)
  return response.data
}
