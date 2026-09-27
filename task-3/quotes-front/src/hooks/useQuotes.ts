import { useCallback, useEffect, useRef, useState } from 'react'
import {
  createQuote as createQuoteRequest,
  deleteQuote as deleteQuoteRequest,
  getQuotes,
  updateQuote as updateQuoteRequest,
} from '../api.ts'
import type { Quote, QuoteInput, QuoteListResponse } from '../types.ts'

const PAGE_SIZE = 5
const SEARCH_DEBOUNCE_MS = 300

function queryKey(nextPage: number, nextAuthor: string) {
  return `${nextPage}\0${nextAuthor}`
}

async function loadQuotePage(nextPage: number, nextAuthor: string) {
  const criteria = {
    page: nextPage,
    size: PAGE_SIZE,
    author: nextAuthor.length > 0 ? nextAuthor : undefined,
  }
  let data: QuoteListResponse = await getQuotes(criteria)
  let resolvedPage = nextPage
  const pageCount = Math.max(1, Math.ceil(data.total / PAGE_SIZE))

  if (nextPage > pageCount - 1) {
    resolvedPage = pageCount - 1
    data = await getQuotes({ ...criteria, page: resolvedPage })
  }

  return { data, resolvedPage }
}

async function findQuotePage(id: number): Promise<{ page: number; data: QuoteListResponse }> {
  const first = await getQuotes({ page: 0, size: PAGE_SIZE })
  if (first.items.some((quote) => quote.id === id)) {
    return { page: 0, data: first }
  }

  const pageCount = Math.max(1, Math.ceil(first.total / PAGE_SIZE))
  if (first.total > PAGE_SIZE) {
    const all = await getQuotes({ page: 0, size: first.total })
    const index = all.items.findIndex((quote) => quote.id === id)
    if (index !== -1) {
      const page = Math.floor(index / PAGE_SIZE)
      return {
        page,
        data: {
          total: all.total,
          items: all.items.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
        },
      }
    }
  }

  for (let page = 1; page < pageCount; page += 1) {
    const data = await getQuotes({ page, size: PAGE_SIZE })
    if (data.items.some((quote) => quote.id === id)) {
      return { page, data }
    }
  }

  const lastPage = Math.max(0, pageCount - 1)
  if (lastPage === 0) return { page: 0, data: first }
  const data = await getQuotes({ page: lastPage, size: PAGE_SIZE })
  return { page: lastPage, data }
}

export function useQuotes() {
  const [items, setItems] = useState<Quote[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPageState] = useState(0)
  const [authorInput, setAuthorInput] = useState('')
  const [author, setAuthor] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const requestSeq = useRef(0)
  const committedAuthor = useRef(author)
  const loadedQuery = useRef<string | null>(null)

  const showPage = useCallback((nextPage: number, nextAuthor: string, data: QuoteListResponse) => {
    loadedQuery.current = queryKey(nextPage, nextAuthor)
    requestSeq.current += 1
    setPageState(nextPage)
    setAuthor(nextAuthor)
    setItems(data.items)
    setTotal(data.total)
    setError(null)
    setLoading(false)
  }, [])

  const clearSearch = useCallback(() => {
    committedAuthor.current = ''
    setAuthorInput('')
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (committedAuthor.current === authorInput) return
      committedAuthor.current = authorInput
      setLoading(true)
      setPageState(0)
      setAuthor(authorInput)
    }, SEARCH_DEBOUNCE_MS)

    return () => window.clearTimeout(timer)
  }, [authorInput])

  useEffect(() => {
    const key = queryKey(page, author)
    if (loadedQuery.current === key) return

    const seq = ++requestSeq.current

    loadQuotePage(page, author)
      .then(({ data, resolvedPage }) => {
        if (seq !== requestSeq.current) return
        loadedQuery.current = queryKey(resolvedPage, author)
        if (resolvedPage !== page) setPageState(resolvedPage)
        setItems(data.items)
        setTotal(data.total)
        setError(null)
      })
      .catch((err: unknown) => {
        if (seq !== requestSeq.current) return
        setError(err instanceof Error ? err.message : 'Failed to load quotes')
      })
      .finally(() => {
        if (seq === requestSeq.current) setLoading(false)
      })

    return () => {
      if (requestSeq.current === seq) requestSeq.current += 1
    }
  }, [author, page])

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const { data, resolvedPage } = await loadQuotePage(page, author)
      showPage(resolvedPage, author, data)
    } catch (err) {
      requestSeq.current += 1
      const message = err instanceof Error ? err.message : 'Failed to load quotes'
      setError(message)
      setLoading(false)
      throw err
    }
  }, [author, page, showPage])

  const revealQuote = useCallback(
    async (id: number) => {
      setLoading(true)
      try {
        const located = await findQuotePage(id)
        clearSearch()
        showPage(located.page, '', located.data)
      } catch (err) {
        requestSeq.current += 1
        const message = err instanceof Error ? err.message : 'Failed to load quotes'
        setError(message)
        setLoading(false)
        throw err
      }
    },
    [clearSearch, showPage],
  )

  const setPage = useCallback((nextPage: number) => {
    setLoading(true)
    setPageState(nextPage)
  }, [])

  const createQuote = useCallback(
    async (input: QuoteInput) => {
      const id = await createQuoteRequest(input)
      await revealQuote(id)
    },
    [revealQuote],
  )

  const updateQuote = useCallback(
    async (id: number, input: QuoteInput) => {
      await updateQuoteRequest(id, input)
      setLoading(true)
      try {
        const current = await loadQuotePage(page, author)
        if (current.data.items.some((quote) => quote.id === id)) {
          showPage(current.resolvedPage, author, current.data)
          return
        }
      } catch (err) {
        requestSeq.current += 1
        const message = err instanceof Error ? err.message : 'Failed to load quotes'
        setError(message)
        setLoading(false)
        throw err
      }
      await revealQuote(id)
    },
    [author, page, revealQuote, showPage],
  )

  const deleteQuote = useCallback(
    async (id: number) => {
      await deleteQuoteRequest(id)
      await refresh()
    },
    [refresh],
  )

  return {
    items,
    total,
    page,
    pageSize: PAGE_SIZE,
    author: authorInput,
    loading,
    error,
    setPage,
    setAuthor: setAuthorInput,
    createQuote,
    updateQuote,
    deleteQuote,
  }
}
