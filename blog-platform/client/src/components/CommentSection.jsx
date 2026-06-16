import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, MessageSquare } from 'lucide-react';
import * as commentApi from '../api/commentApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import CommentItem from './CommentItem';
import ConfirmModal from './ConfirmModal';
import Spinner from './Spinner';

const COMMENT_MAX_LENGTH = 1000;

const CommentSection = ({ postId }) => {
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);

    commentApi
      .getComments(postId)
      .then((data) => {
        if (active) setComments(data);
      })
      .catch((err) => toast.error(err.message))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    setSubmitting(true);
    try {
      const newComment = await commentApi.addComment(postId, trimmed);
      // Real-time UI update: prepend the new comment immediately
      setComments((prev) => [newComment, ...prev]);
      setText('');
      toast.success('Comment posted');
    } catch (err) {
      toast.error(err.message || 'Could not post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await commentApi.deleteComment(deleteTarget);
      setComments((prev) => prev.filter((c) => c._id !== deleteTarget));
      toast.success('Comment deleted');
    } catch (err) {
      toast.error(err.message || 'Could not delete comment');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <section className="mt-10" aria-labelledby="comments-heading">
      <h2 id="comments-heading" className="font-display text-xl font-semibold flex items-center gap-2 mb-4">
        <MessageSquare className="h-5 w-5 text-primary-600 dark:text-primary-300" />
        Comments {!loading && <span className="font-mono text-sm text-ink-400">({comments.length})</span>}
      </h2>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <label htmlFor="comment-text" className="sr-only">
            Add a comment
          </label>
          <textarea
            id="comment-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={COMMENT_MAX_LENGTH}
            rows={3}
            placeholder="Share your thoughts…"
            className="input-field resize-none"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="font-mono text-xs text-ink-400">
              {text.length}/{COMMENT_MAX_LENGTH}
            </span>
            <button type="submit" className="btn-primary" disabled={submitting || !text.trim()}>
              {submitting ? 'Posting…' : (
                <>
                  <Send className="h-4 w-4" /> Post comment
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="card p-4 mb-6 text-sm text-ink-600 dark:text-ink-300">
          <Link to="/login" className="text-primary-600 dark:text-primary-300 font-medium hover:underline">
            Log in
          </Link>{' '}
          to join the discussion.
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-ink-500 dark:text-ink-400 py-4">
          No comments yet. Be the first to share your thoughts.
        </p>
      ) : (
        <ul>
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              currentUserId={user?._id}
              onDelete={(id) => setDeleteTarget(id)}
            />
          ))}
        </ul>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete comment?"
        message="This action cannot be undone."
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </section>
  );
};

export default CommentSection;
