export const AUTHOR_MAX_LENGTH = 200
export const TEXT_MAX_LENGTH = 1000

export interface Quote {
  id: number
  author: string
  text: string
}

export interface QuoteInput {
  author: string
  text: string
}

export interface QuoteListResponse {
  total: number
  items: Quote[]
}

export interface QuoteCriteria {
  page: number
  size: number
  author?: string
}
