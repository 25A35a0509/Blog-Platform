import React, { useState } from 'react';
import { Save } from 'lucide-react';
import RichTextEditor from '../components/RichTextEditor';
import ImageUploader from '../components/ImageUploader';

const TITLE_MAX = 150;

/**
 * Controlled post form (title, category, tags, cover image, rich text content).
 * Used by both CreatePost and EditPost — the parent owns submission logic
 * (create vs. update) and passes `initialData` + `onSubmit`.
 */
const PostEditor = ({ initialData = {}, onSubmit, submitting, submitLabel = 'Publish' }) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [category, setCategory] = useState(initialData.category || 'General');
  const [tagsInput, setTagsInput] = useState((initialData.tags || []).join(', '));
  const [coverImage, setCoverImage] = useState(initialData.coverImage || '');
  const [content, setContent] = useState(initialData.content || '');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const next = {};
    if (!title.trim()) next.title = 'Title is required';
    else if (title.length > TITLE_MAX) next.title = `Title cannot exceed ${TITLE_MAX} characters`;

    const plain = content.replace(/<[^>]+>/g, '').trim();
    if (!plain) next.content = 'Post content cannot be empty';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    onSubmit({
      title: title.trim(),
      category: category.trim() || 'General',
      tags,
      coverImage,
      content,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div>
        <label htmlFor="title" className="label-text">
          Title
        </label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={TITLE_MAX}
          placeholder="A clear, descriptive title"
          className="input-field text-lg font-display"
          aria-invalid={!!errors.title}
        />
        <div className="flex items-center justify-between mt-1">
          {errors.title ? (
            <p className="text-xs text-rose-600">{errors.title}</p>
          ) : (
            <span />
          )}
          <span className="font-mono text-xs text-ink-400">{title.length}/{TITLE_MAX}</span>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="label-text">
            Category
          </label>
          <input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Web Development"
            className="input-field"
          />
        </div>
        <div>
          <label htmlFor="tags" className="label-text">
            Tags <span className="text-ink-400 font-normal">(comma separated)</span>
          </label>
          <input
            id="tags"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="react, mongodb, tutorial"
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label className="label-text">Cover image</label>
        <ImageUploader value={coverImage} onChange={setCoverImage} />
      </div>

      <div>
        <label className="label-text">Content</label>
        <RichTextEditor value={content} onChange={setContent} />
        {errors.content && <p className="text-xs text-rose-600 mt-1">{errors.content}</p>}
      </div>

      <div className="flex justify-end gap-2">
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? (
            'Saving…'
          ) : (
            <>
              <Save className="h-4 w-4" /> {submitLabel}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default PostEditor;
