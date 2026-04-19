import request from '@/utils/request'

export const getLogin = (data)=>{
  return request.post('/user/login', data)
}
export const getCategoryTree = ()=>{
  return request.get('/knowledge/category/tree')
}
export const getKnowledgeList = (params)=>{
  return request.get('/knowledge/article/page', {params})
}
export const uploadFile = (file, businessInfo)=>{
  const formData = new FormData()
  formData.append('file', file)
  formData.append('businessType', 'ARTICLE')
  formData.append('businessId', businessInfo.businessId)
  formData.append('businessField', 'cover')
  return request.post('/file/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
}

export const knowledgeArticle = (data)=>{
  return request.post('/knowledge/article', data)
}
export const knowledgeArticleDetail = (id)=>{
  return request.get(`/knowledge/article/${id}`)
}
export const knowledgeArticleUpdate = (id, data)=>{
  return request.put(`/knowledge/article/${id}`, data)
}
export const knowledgeArticleStatus = (id, data)=>{
  return request.put(`/knowledge/article/${id}/status`, data)
}
export const knowledgeArticleDelete = (id)=>{
  return request.delete(`/knowledge/article/${id}`)
}
//资讯
export const getSessionsList = (params)=>{
  return request.get('/psychological-chat/sessions', {params})
}
export const getSessionDetail = (id)=>{
  return request.get(`/psychological-chat/sessions/${id}/messages`)
}
//情绪
export const getEmotionalList = (params)=>{
  return request.get('/emotion-diary/admin/page', {params})
}
export const getEmotionalDelete = (id)=>{
  return request.delete(`/emotion-diary/admin/${id}`)
}
// 数据分析
export const getDataAnalyticsOverview = ()=>{
  return request.get('/data-analytics/overview')
}

// 退出登录
export const getLogout = ()=>{
  return request.post('/user/logout')
}