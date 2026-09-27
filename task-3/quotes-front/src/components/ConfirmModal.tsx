import { useEffect, useRef } from 'react'

type ConfirmModalProps = {
  open: boolean
  author: string
  submitting: boolean
  onClose: () => void
  onConfirm: () => void
}

export function ConfirmModal({
  open,
  author,
  submitting,
  onClose,
  onConfirm,
}: ConfirmModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      dialog.showModal()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

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
      <div className="modal-card">
        <h2>Delete quote</h2>
        <p>
          Delete the quote by <strong>{author}</strong>? This cannot be undone.
        </p>
        <div className="modal-actions">
          <button type="button" className="button" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button
            type="button"
            className="button button-danger"
            onClick={onConfirm}
            disabled={submitting}
          >
            Delete
          </button>
        </div>
      </div>
    </dialog>
  )
}
