import request from '@/utils/request'
import type { ApiRecord, ChatMessage, ChatSession, EmotionAnalysis, PageResult } from '@/types'

export function register(data: unknown): Promise<ApiRecord> {
  return request.post('/user/add', data)
}
export function sessionStart(data: unknown): Promise<ApiRecord> {
  return request.post('/psychological-chat/session/start', data)
}
export function getSessionlist(params: Record<string, unknown>): Promise<PageResult<ChatSession>> {
  return request.get('/psychological-chat/sessions', {params})
}
export function sendStream(data) {
  return request.post('/api/psychological-chat/stream', data)
}
export function deleteSession(sessionId: string | number): Promise<ApiRecord> {
  return request.delete(`/psychological-chat/sessions/${sessionId}`)
}
export function getSessionTree(sessionId: string | number): Promise<ChatMessage[]> {
  return request.get(`/psychological-chat/sessions/${sessionId}/messages`)
}
export function getEmotion(sessionId: string | number): Promise<EmotionAnalysis> {
  return request.get(`/psychological-chat/session/${sessionId}/emotion`)
}
export function submitEmotion(data: unknown): Promise<ApiRecord> {
  return request.post('/emotion-diary', data)
}
export function getKnowledgeList(params: Record<string, unknown>): Promise<PageResult> {
  return request.get('/knowledge/article/page', {params})
}
export function getKnowledgeDetail(id: string | number): Promise<ApiRecord> {
  return request.get(`/knowledge/article/${id}`)
}