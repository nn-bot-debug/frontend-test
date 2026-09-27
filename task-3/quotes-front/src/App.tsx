import { useState } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import { ConfirmModal } from './components/ConfirmModal.tsx'
import { QuoteList } from './components/QuoteList.tsx'
import { QuoteModal } from './components/QuoteModal.tsx'
import { useQuotes } from './hooks/useQuotes.ts'
import type { Quote, QuoteInput } from './types.ts'

function App() {
  const quotes = useQuotes()
  const [formMode, setFormMode] = useState<'create' | 'edit' | null>(null)
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)
  const [quoteToDelete, setQuoteToDelete] = useState<Quote | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function closeForm() {
    if (submitting) return
    setFormMode(null)
    setSelectedQuote(null)
  }

  function closeDelete() {
    if (submitting) return
    setQuoteToDelete(null)
  }

  async function handleSubmit(input: QuoteInput) {
    setSubmitting(true)
    try {
      if (formMode === 'edit' && selectedQuote) {
        await quotes.updateQuote(selectedQuote.id, input)
        toast.success('Quote updated')
      } else {
        await quotes.createQuote(input)
        toast.success('Quote created')
      }
      setFormMode(null)
      setSelectedQuote(null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Request failed')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!quoteToDelete) return
    setSubmitting(true)
    try {
      await quotes.deleteQuote(quoteToDelete.id)
      toast.success('Quote deleted')
      setQuoteToDelete(null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Request failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <QuoteList
        items={quotes.items}
        total={quotes.total}
        page={quotes.page}
        pageSize={quotes.pageSize}
        author={quotes.author}
        loading={quotes.loading}
        error={quotes.error}
        onAuthorChange={quotes.setAuthor}
        onPageChange={quotes.setPage}
        onCreate={() => {
          setSelectedQuote(null)
          setFormMode('create')
        }}
        onEdit={(quote) => {
          setSelectedQuote(quote)
          setFormMode('edit')
        }}
        onDelete={setQuoteToDelete}
      />
      <QuoteModal
        open={formMode !== null}
        mode={formMode === 'edit' ? 'edit' : 'create'}
        initialQuote={formMode === 'edit' ? selectedQuote : null}
        submitting={submitting}
        onClose={closeForm}
        onSubmit={(input) => {
          void handleSubmit(input)
        }}
      />
      <ConfirmModal
        open={quoteToDelete !== null}
        author={quoteToDelete?.author ?? ''}
        submitting={submitting}
        onClose={closeDelete}
        onConfirm={() => {
          void handleDelete()
        }}
      />
      <Toaster position="top-right" />
    </>
  )
}

export default App
