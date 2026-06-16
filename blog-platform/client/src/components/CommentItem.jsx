import React from 'react';
import { Trash2 } from 'lucide-react';
import { timeAgo, getInitials } from '../utils/helpers';

const CommentItem = ({ comment, currentUserId, onDelete }) => {
  const isOwner = currentUserId && comment.author?._id === currentUserId;

  return (
    <li className="flex gap-3 py-4 border-b border-ink-100 dark:border-ink-800 last:border-b-0">
      <span className="flex items-center justify-center h-9 w-9 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-sm font-semibold shrink-0">
        {getInitials(comment.author?.name)}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-medium text-sm text-ink-800 dark:text-ink-100">
              {comment.author?.name || 'Deleted user'}
            </span>
            <span className="font-mono text-xs text-ink-400">{timeAgo(comment.createdAt)}</span>
          </div>
          {isOwner && (
            <button
              onClick={() => onDelete(comment._id)}
              className="text-ink-400 hover:text-rose-600 transition-colors shrink-0"
              aria-label="Delete comment"
              title="Delete comment"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
        <p className="text-sm text-ink-700 dark:text-ink-200 mt-1 whitespace-pre-wrap break-words">
          {comment.text}
        </p>
      </div>
    </li>
  );
};

export default CommentItem;
