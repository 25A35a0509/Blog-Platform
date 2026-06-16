import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Heart, Pencil, Trash2, Clock, Eye, ArrowLeft } from 'lucide-react';
import * as postApi from '../api/postApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatDate, getReadingTime, getCategoryColor, getInitials } from '../utils/helpers';
import CommentSection from '../components/CommentSection';
import ConfirmModal from '../components/ConfirmModal';
import Spinner from '../components/Spinner';

const PostDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    postApi
      .getPostById(id)
      .then((data) => {
        if (!active) return;
        setPost(data);
        setLikeCount(data.likes?.length || 0);
        setLiked(!!(user && data.likes?.some((u) => (u._id || u) === user._id)));
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user?._id]);

  const isOwner = isAuthenticated && post && user?._id === post.author?._id;

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.info('Log in to like posts');
      return;
    }
    // Optimistic update for instant feedback
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    setLikeLoading(true);

    try {
      const result = await postApi.toggleLike(post._id);
      setLiked(result.liked);
      setLikeCount(result.likeCount);
    } catch (err) {
      // Roll back on failure
      setLiked((prev) => !prev);
      setLikeCount((prev) => (liked ? prev + 1 : prev - 1));
      toast.error(err.message || 'Could not update like');
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await postApi.deletePost(post._id);
      toast.success('Post deleted');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Could not delete post');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-semibold mb-2">Post not found</h1>
        <p className="text-ink-500 dark:text-ink-400 mb-6">{error || 'This post may have been removed.'}</p>
        <Link to="/" className="btn-primary inline-flex">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-primary-600 dark:hover:text-primary-300 mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to all posts
      </Link>

      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <span className={`inline-block h-2 w-2 rounded-full ${getCategoryColor(post.category)}`} />
          <span className="font-mono text-xs uppercase tracking-wide text-primary-600 dark:text-primary-300">
            {post.category}
          </span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-semibold leading-tight mb-4">{post.title}</h1>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <Link to={`/?author=${post.author?._id}`} className="flex items-center gap-3 group">
            <span className="flex items-center justify-center h-11 w-11 rounded-full bg-accent-200 text-accent-800 font-semibold">
              {getInitials(post.author?.name)}
            </span>
            <div>
              <p className="font-medium text-ink-800 dark:text-ink-100 group-hover:text-primary-600 dark:group-hover:text-primary-300">
                {post.author?.name}
              </p>
              <p className="font-mono text-xs text-ink-400">
                {formatDate(post.createdAt)}
                {post.updatedAt !== post.createdAt && ` · updated ${formatDate(post.updatedAt)}`}
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-4 text-sm text-ink-500 dark:text-ink-400">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" /> {getReadingTime(post.content)} min read
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" /> {post.views}
            </span>
          </div>
        </div>
      </header>

      {/* Cover image */}
      {post.coverImage && (
        <img src={post.coverImage} alt="" className="w-full rounded-xl mb-8 max-h-[420px] object-cover" />
      )}

      {/* Content */}
      <div className="prose-post" dangerouslySetInnerHTML={{ __html: post.content }} />

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-6">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              to={`/?search=${encodeURIComponent(tag)}`}
              className="font-mono text-xs px-2.5 py-1 rounded-full bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-ink-100 dark:border-ink-800">
        <button
          onClick={handleLike}
          disabled={likeLoading}
          className={`btn ${
            liked
              ? 'bg-rose-50 dark:bg-rose-900/30 text-rose-600'
              : 'bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600'
          }`}
          aria-pressed={liked}
        >
          <Heart className={`h-4 w-4 ${liked ? 'fill-rose-600' : ''}`} />
          {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
        </button>

        {isOwner && (
          <div className="flex items-center gap-2">
            <Link to={`/edit/${post._id}`} className="btn-secondary">
              <Pencil className="h-4 w-4" /> Edit
            </Link>
            <button onClick={() => setDeleteOpen(true)} className="btn-danger">
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          </div>
        )}
      </div>

      {/* Author bio */}
      {post.author?.bio && (
        <div className="card p-5 mt-6 flex items-start gap-4">
          <span className="flex items-center justify-center h-12 w-12 rounded-full bg-accent-200 text-accent-800 font-semibold shrink-0">
            {getInitials(post.author?.name)}
          </span>
          <div>
            <p className="font-medium text-ink-800 dark:text-ink-100">About {post.author.name}</p>
            <p className="text-sm text-ink-600 dark:text-ink-300 mt-1">{post.author.bio}</p>
          </div>
        </div>
      )}

      {/* Comments */}
      <CommentSection postId={post._id} />

      <ConfirmModal
        open={deleteOpen}
        title="Delete this post?"
        message="This will permanently delete the post and all of its comments."
        confirmLabel="Delete post"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </article>
  );
};

export default PostDetails;
