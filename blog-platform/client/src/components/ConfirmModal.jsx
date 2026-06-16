import React from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * Simple accessible confirmation dialog. Rendered conditionally by the parent
 * (pass `open` to control visibility) and used before deleting posts/comments.
 */
const ConfirmModal = ({ open, title, message, confirmLabel = 'Delete', onConfirm, onCancel, loading }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div className="card max-w-sm w-full p-6">
        <div className="flex items-start gap-3 mb-4">
          <span className="flex items-center justify-center h-10 w-10 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </span>
          <div>
            <h2 id="confirm-modal-title" className="font-display text-lg font-semibold text-ink-900 dark:text-ink-50">
              {title}
            </h2>
            <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="btn-secondary" disabled={loading}>
            Cancel
          </button>
          <button onClick={onConfirm} className="btn-danger" disabled={loading}>
            {loading ? 'Working…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
