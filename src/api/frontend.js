import request from '@/utils/request'

export function register(data) {
  return request.post('/user/add', data)
}
export function sessionStart(data) {
  return request.post('/psychological-chat/session/start', data)
}
export function getSessionlist(params) {
  return request.get('/psychological-chat/sessions', {params})
}
export function sendStream(data) {
  return request.post('/api/psychological-chat/stream', data)
}
export function deleteSession(sessionId) {
  return request.delete(`/psychological-chat/sessions/${sessionId}`)
}
export function getSessionTree(sessionId) {
  return request.get(`/psychological-chat/sessions/${sessionId}/messages`)
}
export function getEmotion(sessionId) {
  return request.get(`/psychological-chat/session/${sessionId}/emotion`)
}
export function submitEmotion(data) {
  return request.post('/emotion-diary', data)
}
export function getKnowledgeList(params) {
  return request.get('/knowledge/article/page', {params})
}
export function getKnowledgeDetail(id) {
  return request.get(`/knowledge/article/${id}`)
}