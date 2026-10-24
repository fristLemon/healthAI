export interface ApiRecord {
  [key: string]: any
}

export interface PageResult<T = ApiRecord> {
  records: T[]
  total: number
}

export interface Category extends ApiRecord {
  id: string | number
  categoryName: string
}

export interface CategoryOption {
  id?: string | number
  label: string
  value: string | number
}

export interface Article extends ApiRecord {
  id: string | number
  title: string
  tags?: string | string[]
  coverImage?: string
  categoryId?: string | number
}

export interface SearchItem {
  prop: string
  label: string
  type: 'input' | 'select'
  placeholder?: string
  options?: Array<{ label: string; value: string | number }>
  col?: Record<string, number>
}

export interface ChatMessage extends ApiRecord {
  id: string | number
  senderType: number
  content: string
  createAt?: string
  createdAt?: string
}

export interface ChatSession extends ApiRecord {
  id?: string | number
  sessionId?: string | number
  status?: string | number
  sessionTitle?: string
}

export interface EmotionAnalysis extends ApiRecord {
  primaryEmotion: string
  emotionScore: number
  isNegative: boolean
  riskLevel: number
  suggestion: string
  improvementSuggestions: string[]
  riskDescription?: string
}