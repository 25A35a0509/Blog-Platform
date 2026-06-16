import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PenSquare, Pencil, Trash2, Eye, Heart, FileText } from 'lucide-react';
import * as postApi from '../api/postApi';
import { useToast } from '../context/ToastContext';
import { formatDate, getCategoryColor } from '../utils/helpers';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import ConfirmModal from '../components/ConfirmModal';

const Dashboard = () => {
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({ totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPosts = () => {
    setLoading(true);
    postApi
      .getPosts({ mine: 'true', page, limit: 8 })
      .then((res) => {
        setPosts(res.data);
        setPagination(res.pagination);
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await postApi.deletePost(deleteTarget);
      toast.success('Post deleted');
      setPosts((prev) => prev.filter((p) => p._id !== deleteTarget));
    } catch (err) {
      toast.error(err.message || 'Could not delete post');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold">Your posts</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">
            Manage, edit, or delete the posts you've written.
          </p>
        </div>
        <Link to="/create" className="btn-primary">
          <PenSquare className="h-4 w-4" /> New Post
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : posts.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="You haven't written anything yet"
          message="Your published posts will appear here, where you can edit or delete them anytime."
          action={
            <Link to="/create" className="btn-primary">
              <PenSquare className="h-4 w-4" /> Write your first post
            </Link>
          }
        />
      ) : (
        <>
          <div className="space-y-3">
            {posts.map((post) => (
              <div key={post._id} className="card p-4 flex items-center gap-4">
                <span className={`hidden sm:block h-10 w-1.5 rounded-full ${getCategoryColor(post.category)}`} />
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/posts/${post.slug || post._id}`}
                    className="font-display font-semibold text-ink-900 dark:text-ink-50 hover:text-primary-600 dark:hover:text-primary-300 truncate block"
                  >
                    {post.title}
                  </Link>
                  <div className="flex items-center gap-3 mt-1 text-xs font-mono text-ink-400 flex-wrap">
                    <span>{formatDate(post.createdAt)}</span>
                    <span className="inline-flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" /> {post.views}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Heart className="h-3.5 w-3.5" /> {post.likeCount ?? post.likes?.length ?? 0}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-ink-100 dark:bg-ink-800">{post.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Link to={`/edit/${post._id}`} className="btn-ghost h-9 w-9 p-0 rounded-lg" title="Edit post">
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => setDeleteTarget(post._id)}
                    className="btn-ghost h-9 w-9 p-0 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                    title="Delete post"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            page={pagination.page || page}
            totalPages={pagination.totalPages}
            onPageChange={(p) => setSearchParams({ page: String(p) })}
          />
        </>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete this post?"
        message="This will permanently delete the post and all of its comments."
        confirmLabel="Delete post"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default Dashboard;
