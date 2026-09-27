import { useEffect, useRef, useState, type FormEvent } from 'react'
import { AUTHOR_MAX_LENGTH, TEXT_MAX_LENGTH, type Quote, type QuoteInput } from '../types.ts'

type QuoteModalProps = {
  open: boolean
  mode: 'create' | 'edit'
  initialQuote: Quote | null
  submitting: boolean
  onClose: () => void
  onSubmit: (input: QuoteInput) => void
}

export function QuoteModal({
  open,
  mode,
  initialQuote,
  submitting,
  onClose,
  onSubmit,
}: QuoteModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [author, setAuthor] = useState(initialQuote?.author ?? '')
  const [text, setText] = useState(initialQuote?.text ?? '')
  const [wasOpen, setWasOpen] = useState(open)

  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) {
      setAuthor(initialQuote?.author ?? '')
      setText(initialQuote?.text ?? '')
    }
  }

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      dialog.showModal()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  const trimmedAuthor = author.trim()
  const trimmedText = text.trim()
  const authorValid =
    trimmedAuthor.length >= 1 && trimmedAuthor.length <= AUTHOR_MAX_LENGTH
  const textValid = trimmedText.length >= 1 && trimmedText.length <= TEXT_MAX_LENGTH
  const canSubmit = authorValid && textValid && !submitting

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!authorValid || !textValid || submitting) return
    onSubmit({ author: trimmedAuthor, text: trimmedText })
  }

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget && !submitting) onClose()
      }}
      onCancel={(event) => {
        if (submitting) event.preventDefault()
      }}
    >
      <form className="modal-card" onSubmit={handleSubmit}>
        <h2>{mode === 'create' ? 'Create quote' : 'Edit quote'}</h2>
        <p className="helper">Both fields are required.</p>

        <label className="field">
          <span>Author</span>
          <input
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            disabled={submitting}
            autoFocus
          />
          <small className={trimmedAuthor.length > AUTHOR_MAX_LENGTH ? 'counter over' : 'counter'}>
            {trimmedAuthor.length}/{AUTHOR_MAX_LENGTH}
          </small>
        </label>

        <label className="field">
          <span>Text</span>
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            disabled={submitting}
            rows={6}
          />
          <small className={trimmedText.length > TEXT_MAX_LENGTH ? 'counter over' : 'counter'}>
            {trimmedText.length}/{TEXT_MAX_LENGTH}
          </small>
        </label>

        <div className="modal-actions">
          <button type="button" className="button" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className="button button-primary" disabled={!canSubmit}>
            {mode === 'create' ? 'Create' : 'Save'}
          </button>
        </div>
      </form>
    </dialog>
  )
}
