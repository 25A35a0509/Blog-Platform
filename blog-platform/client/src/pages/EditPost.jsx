import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import * as postApi from '../api/postApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import PostEditor from '../components/PostEditor';
import Spinner from '../components/Spinner';

const EditPost = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    postApi
      .getPostById(id)
      .then((data) => active && setPost(data))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    try {
      const updated = await postApi.updatePost(post._id, payload);
      toast.success('Post updated');
      navigate(`/posts/${updated.slug || updated._id}`);
    } catch (err) {
      toast.error(err.message || 'Could not update post');
    } finally {
      setSubmitting(false);
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
        <p className="text-ink-500 dark:text-ink-400 mb-6">{error}</p>
        <Link to="/dashboard" className="btn-primary inline-flex">
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>
      </div>
    );
  }

  if (post.author?._id !== user?._id) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-semibold mb-2">Not authorized</h1>
        <p className="text-ink-500 dark:text-ink-400 mb-6">You can only edit your own posts.</p>
        <Link to="/dashboard" className="btn-primary inline-flex">
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-2xl sm:text-3xl font-semibold mb-1">Edit post</h1>
      <p className="text-sm text-ink-500 dark:text-ink-400 mb-8">Update your post and save your changes.</p>
      <PostEditor initialData={post} onSubmit={handleSubmit} submitting={submitting} submitLabel="Save changes" />
    </div>
  );
};

export default EditPost;
