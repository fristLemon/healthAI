import request from '@/utils/request'
import type { ApiRecord, Article, Category, PageResult } from '@/types'

export const getLogin = (data: unknown): Promise<ApiRecord> => {
  return request.post('/user/login', data)
}
export const getCategoryTree = (): Promise<Category[]> => {
  return request.get('/knowledge/category/tree')
}
export const getKnowledgeList = (params: Record<string, unknown>): Promise<PageResult<Article>> => {
  return request.get('/knowledge/article/page', {params})
}
export const uploadFile = (file: File, businessInfo: { businessId: string | number }): Promise<ApiRecord> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('businessType', 'ARTICLE')
  formData.append('businessId', String(businessInfo.businessId))
  formData.append('businessField', 'cover')
  return request.post('/file/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
}

export const knowledgeArticle = (data: unknown): Promise<ApiRecord> => {
  return request.post('/knowledge/article', data)
}
export const knowledgeArticleDetail = (id: string | number): Promise<Article> => {
  return request.get(`/knowledge/article/${id}`)
}
export const knowledgeArticleUpdate = (id: string | number, data: unknown): Promise<ApiRecord> => {
  return request.put(`/knowledge/article/${id}`, data)
}
export const knowledgeArticleStatus = (id: string | number, data: unknown): Promise<ApiRecord> => {
  return request.put(`/knowledge/article/${id}/status`, data)
}
export const knowledgeArticleDelete = (id: string | number): Promise<ApiRecord> => {
  return request.delete(`/knowledge/article/${id}`)
}
//资讯
export const getSessionsList = (params: Record<string, unknown>): Promise<PageResult> => {
  return request.get('/psychological-chat/sessions', {params})
}
export const getSessionDetail = (id: string | number): Promise<ApiRecord[]> => {
  return request.get(`/psychological-chat/sessions/${id}/messages`)
}
//情绪
export const getEmotionalList = (params: Record<string, unknown>): Promise<PageResult> => {
  return request.get('/emotion-diary/admin/page', {params})
}
export const getEmotionalDelete = (id: string | number): Promise<ApiRecord> => {
  return request.delete(`/emotion-diary/admin/${id}`)
}
// 数据分析
export const getDataAnalyticsOverview = (): Promise<ApiRecord> => {
  return request.get('/data-analytics/overview')
}

// 退出登录
export const getLogout = (): Promise<ApiRecord> => {
  return request.post('/user/logout')
}