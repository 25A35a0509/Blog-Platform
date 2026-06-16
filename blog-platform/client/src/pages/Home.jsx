import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { PenSquare, X } from 'lucide-react';
import * as postApi from '../api/postApi';
import PostCard from '../components/PostCard';
import Pagination from '../components/Pagination';
import SearchFilterBar from '../components/SearchFilterBar';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  const page = parseInt(searchParams.get('page') || '1', 10);
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const authorId = searchParams.get('author') || '';

  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({ totalPages: 1 });
  const [categories, setCategories] = useState([]);
  const [authorName, setAuthorName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    postApi.getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);

    postApi
      .getPosts({ page, limit: 6, search: search || undefined, category: category || undefined, author: authorId || undefined })
      .then((res) => {
        if (!active) return;
        setPosts(res.data);
        setPagination(res.pagination);
        if (authorId && res.data[0]?.author) {
          setAuthorName(res.data[0].author.name);
        } else if (!authorId) {
          setAuthorName('');
        }
      })
      .catch((err) => toast.error(err.message))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, category, authorId]);

  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (val) next.set(key, val);
      else next.delete(key);
    });
    if (!('page' in updates)) next.delete('page'); // reset pagination on filter change
    setSearchParams(next);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Hero */}
      <section className="mb-10">
        <div className="card relative overflow-hidden p-8 sm:p-12">
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-primary-100 dark:bg-primary-900/30 blur-2xl" />
          <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-accent-100 dark:bg-accent-900/20 blur-2xl" />
          <div className="relative max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-widest text-primary-600 dark:text-primary-300">
              Welcome to Inkwell
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold mt-2 mb-3 leading-tight">
              Write things worth reading.
            </h1>
            <p className="text-ink-600 dark:text-ink-300 mb-6">
              A focused space for long-form writing and honest conversation — publish posts, organize them
              by topic, and discuss ideas in the comments.
            </p>
            {isAuthenticated ? (
              <Link to="/create" className="btn-primary">
                <PenSquare className="h-4 w-4" /> Write a new post
              </Link>
            ) : (
              <div className="flex gap-2">
                <Link to="/register" className="btn-primary">
                  Get started
                </Link>
                <Link to="/login" className="btn-secondary">
                  Log in
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Author filter banner */}
      {authorId && (
        <div className="flex items-center justify-between gap-2 mb-4 px-4 py-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-sm">
          <span>
            Showing posts by <strong>{authorName || 'this author'}</strong>
          </span>
          <button
            onClick={() => updateParams({ author: '' })}
            className="flex items-center gap-1 text-primary-700 dark:text-primary-300 hover:underline"
          >
            <X className="h-3.5 w-3.5" /> Clear
          </button>
        </div>
      )}

      {/* Search & filters */}
      <SearchFilterBar
        search={search}
        category={category}
        categories={categories}
        onSearchChange={(val) => updateParams({ search: val })}
        onCategoryChange={(val) => updateParams({ category: val })}
      />

      {/* Posts grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : posts.length === 0 ? (
        <EmptyState
          title="No posts found"
          message="Try adjusting your search or filters, or be the first to write about this topic."
          action={
            isAuthenticated && (
              <Link to="/create" className="btn-primary">
                <PenSquare className="h-4 w-4" /> Write a post
              </Link>
            )
          }
        />
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
          <Pagination page={pagination.page || page} totalPages={pagination.totalPages} onPageChange={(p) => updateParams({ page: String(p) })} />
        </>
      )}
    </div>
  );
};

export default Home;
