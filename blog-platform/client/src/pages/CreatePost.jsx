import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as postApi from '../api/postApi';
import { useToast } from '../context/ToastContext';
import PostEditor from '../components/PostEditor';

const CreatePost = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    try {
      const post = await postApi.createPost(payload);
      toast.success('Post published!');
      navigate(`/posts/${post.slug || post._id}`);
    } catch (err) {
      toast.error(err.message || 'Could not create post');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-2xl sm:text-3xl font-semibold mb-1">Write a new post</h1>
      <p className="text-sm text-ink-500 dark:text-ink-400 mb-8">
        Share your ideas with the Inkwell community.
      </p>
      <PostEditor onSubmit={handleSubmit} submitting={submitting} submitLabel="Publish" />
    </div>
  );
};

export default CreatePost;
