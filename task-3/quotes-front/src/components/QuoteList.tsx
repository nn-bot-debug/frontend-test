import type { Quote } from '../types.ts'
import { Pagination } from './Pagination.tsx'

type QuoteListProps = {
  items: Quote[]
  total: number
  page: number
  pageSize: number
  author: string
  loading: boolean
  error: string | null
  onAuthorChange: (author: string) => void
  onPageChange: (page: number) => void
  onCreate: () => void
  onEdit: (quote: Quote) => void
  onDelete: (quote: Quote) => void
}

export function QuoteList({
  items,
  total,
  page,
  pageSize,
  author,
  loading,
  error,
  onAuthorChange,
  onPageChange,
  onCreate,
  onEdit,
  onDelete,
}: QuoteListProps) {
  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h1>Quotes</h1>
          <p className="subtitle">Browse, search, and manage quotes.</p>
        </div>
        <button type="button" className="button button-primary" onClick={onCreate}>
          Create quote
        </button>
      </header>

      <label className="search">
        <span>Search by author</span>
        <input
          type="search"
          value={author}
          onChange={(event) => onAuthorChange(event.target.value)}
          placeholder="Type any author name"
        />
      </label>

      {error && (
        <p className="status status-error" role="alert">
          {error}
        </p>
      )}

      {loading && items.length === 0 ? (
        <p className="status">Loading quotes…</p>
      ) : items.length === 0 && !error ? (
        <p className="status">No quotes found.</p>
      ) : items.length > 0 ? (
        <ul className="quote-list" aria-busy={loading}>
          {items.map((quote) => (
            <li key={quote.id} className="quote-card">
              <blockquote>{quote.text}</blockquote>
              <p className="quote-author">{quote.author}</p>
              <div className="quote-actions">
                <button type="button" className="button" onClick={() => onEdit(quote)}>
                  Edit
                </button>
                <button
                  type="button"
                  className="button button-danger"
                  onClick={() => onDelete(quote)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      <Pagination page={page} pageSize={pageSize} total={total} onPageChange={onPageChange} />
    </section>
  )
}
