import React, { useEffect, useRef, useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Link2,
  Image as ImageIcon,
  Eraser,
  Undo2,
  Redo2,
} from 'lucide-react';
import { uploadImage } from '../api/uploadApi';
import { useToast } from '../context/ToastContext';
import Spinner from './Spinner';

/**
 * A small, dependency-free rich text editor built on contentEditable.
 *
 * Notes for production use:
 * - `document.execCommand` is deprecated but remains broadly supported across
 *   evergreen browsers for the basic formatting commands used here. For a
 *   larger application, consider swapping this internals for a library like
 *   Tiptap or Slate while keeping the same `value`/`onChange` contract.
 * - The output is sanitized server-side concerns aside; since only the post's
 *   author can edit their own content and it is rendered back to other users,
 *   a production deployment should run the HTML through a sanitizer
 *   (e.g. `sanitize-html`) on the backend before persisting.
 */
const RichTextEditor = ({ value, onChange, placeholder = 'Start writing your post…' }) => {
  const editorRef = useRef(null);
  const isInternalUpdate = useRef(false);
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const toast = useToast();

  // Sync external value changes (e.g. loading a post for editing) into the editor,
  // but skip the sync immediately after our own input events to avoid cursor jumps.
  useEffect(() => {
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = () => {
    isInternalUpdate.current = true;
    onChange(editorRef.current.innerHTML);
  };

  const exec = (command, arg = null) => {
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    handleInput();
  };

  const handleLink = () => {
    const url = window.prompt('Enter a URL:', 'https://');
    if (url) exec('createLink', url);
  };

  const handleImageClick = () => fileInputRef.current?.click();

  const handleImageSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { url } = await uploadImage(file);
      exec('insertImage', url);
      toast.success('Image inserted');
    } catch (err) {
      toast.error(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const ToolbarButton = ({ onClick, title, children }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className="h-8 w-8 inline-flex items-center justify-center rounded-md text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-700 transition-colors"
    >
      {children}
    </button>
  );

  return (
    <div className="rounded-lg border border-ink-200 dark:border-ink-700 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 flex-wrap p-1.5 border-b border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-800">
        <ToolbarButton onClick={() => exec('bold')} title="Bold">
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec('italic')} title="Italic">
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec('underline')} title="Underline">
          <Underline className="h-4 w-4" />
        </ToolbarButton>
        <span className="w-px h-5 bg-ink-200 dark:bg-ink-600 mx-1" />
        <ToolbarButton onClick={() => exec('formatBlock', 'H2')} title="Heading 2">
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec('formatBlock', 'H3')} title="Heading 3">
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec('formatBlock', 'BLOCKQUOTE')} title="Quote">
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <span className="w-px h-5 bg-ink-200 dark:bg-ink-600 mx-1" />
        <ToolbarButton onClick={() => exec('insertUnorderedList')} title="Bulleted list">
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec('insertOrderedList')} title="Numbered list">
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <span className="w-px h-5 bg-ink-200 dark:bg-ink-600 mx-1" />
        <ToolbarButton onClick={handleLink} title="Insert link">
          <Link2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={handleImageClick} title="Insert image">
          {uploading ? <Spinner size="sm" /> : <ImageIcon className="h-4 w-4" />}
        </ToolbarButton>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageSelected}
        />
        <span className="w-px h-5 bg-ink-200 dark:bg-ink-600 mx-1" />
        <ToolbarButton onClick={() => exec('undo')} title="Undo">
          <Undo2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec('redo')} title="Redo">
          <Redo2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec('removeFormat')} title="Clear formatting">
          <Eraser className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        data-placeholder={placeholder}
        className="prose-post min-h-[260px] max-h-[520px] overflow-y-auto p-4 bg-surface-light dark:bg-surface-dark focus:outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-ink-400"
        suppressContentEditableWarning
      />
    </div>
  );
};

export default RichTextEditor;
