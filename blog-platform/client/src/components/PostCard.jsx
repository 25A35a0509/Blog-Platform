import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Clock } from 'lucide-react';
import { formatDate, getReadingTime, getCategoryColor, getInitials } from '../utils/helpers';

const PostCard = ({ post }) => {
  const readingTime = getReadingTime(post.content);

  return (
    <article className="card group overflow-hidden flex flex-col h-full hover:shadow-soft-lg transition-shadow duration-200">
      {/* Category "spine" + optional cover image */}
      <div className="relative">
        <div className={`absolute left-0 top-0 h-full w-1.5 ${getCategoryColor(post.category)}`} />
        {post.coverImage ? (
          <Link to={`/posts/${post.slug || post._id}`}>
            <img
              src={post.coverImage}
              alt=""
              className="h-44 w-full object-cover"
              loading="lazy"
            />
          </Link>
        ) : null}
      </div>

      <div className="p-5 pl-6 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-xs uppercase tracking-wide text-primary-600 dark:text-primary-300">
            {post.category}
          </span>
          <span className="font-mono text-xs text-ink-400 flex items-center gap-1">
            <Clock className="h-3 w-3" /> {readingTime} min read
          </span>
        </div>

        <h2 className="font-display text-xl font-semibold leading-snug mb-2">
          <Link
            to={`/posts/${post.slug || post._id}`}
            className="hover:text-primary-600 dark:hover:text-primary-300 transition-colors"
          >
            {post.title}
          </Link>
        </h2>

        <p className="text-sm text-ink-600 dark:text-ink-300 line-clamp-3 mb-4 flex-1">
          {post.excerpt}
        </p>

        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-ink-100 dark:border-ink-800 pt-3">
          <Link
            to={`/?author=${post.author?._id}`}
            className="flex items-center gap-2 group/author"
            title={`View posts by ${post.author?.name}`}
          >
            <span className="flex items-center justify-center h-7 w-7 rounded-full bg-accent-200 text-accent-800 text-xs font-semibold">
              {getInitials(post.author?.name)}
            </span>
            <span className="text-sm">
              <span className="block font-medium text-ink-700 dark:text-ink-200 group-hover/author:text-primary-600 dark:group-hover/author:text-primary-300">
                {post.author?.name || 'Unknown'}
              </span>
              <span className="block font-mono text-[11px] text-ink-400">{formatDate(post.createdAt)}</span>
            </span>
          </Link>

          <div className="flex items-center gap-3 text-ink-400">
            <span className="flex items-center gap-1 text-sm">
              <Heart className="h-4 w-4" /> {post.likeCount ?? post.likes?.length ?? 0}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
