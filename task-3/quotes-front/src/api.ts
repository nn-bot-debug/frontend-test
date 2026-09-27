import type { QuoteCriteria, QuoteInput, QuoteListResponse } from './types.ts'

async function request(path: string, init?: RequestInit): Promise<Response> {
  const response = await fetch(path, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`)
  }

  return response
}

export async function getQuotes(criteria: QuoteCriteria): Promise<QuoteListResponse> {
  const params = new URLSearchParams({
    page: String(criteria.page),
    size: String(criteria.size),
  })

  if (criteria.author) {
    params.set('author', criteria.author)
  }

  const response = await request(`/quotes?${params.toString()}`)
  return response.json() as Promise<QuoteListResponse>
}

export async function createQuote(input: QuoteInput): Promise<number> {
  const response = await request('/quotes', {
    method: 'POST',
    body: JSON.stringify(input),
  })
  return response.json() as Promise<number>
}

export async function updateQuote(id: number, input: QuoteInput): Promise<void> {
  await request(`/quotes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  })
}

export async function deleteQuote(id: number): Promise<void> {
  await request(`/quotes/${id}`, {
    method: 'DELETE',
  })
}
