import React, { useRef, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { uploadImage } from '../api/uploadApi';
import { useToast } from '../context/ToastContext';
import Spinner from './Spinner';

/**
 * Lets the user select or drag-and-drop a cover image. On selection, the file
 * is uploaded immediately to Cloudinary (via the backend) and the resulting
 * URL is reported back through onChange.
 */
const ImageUploader = ({ value, onChange }) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const toast = useToast();

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setUploading(true);
    try {
      const { url } = await uploadImage(file);
      onChange(url);
      toast.success('Cover image uploaded');
    } catch (err) {
      toast.error(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  if (value) {
    return (
      <div className="relative rounded-lg overflow-hidden border border-ink-200 dark:border-ink-700">
        <img src={value} alt="Cover preview" className="w-full h-48 object-cover" />
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute top-2 right-2 h-8 w-8 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
          aria-label="Remove cover image"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      className={`flex flex-col items-center justify-center gap-2 h-48 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
        dragOver
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
          : 'border-ink-300 dark:border-ink-700 hover:border-primary-400'
      }`}
    >
      {uploading ? (
        <Spinner size="md" />
      ) : (
        <>
          <ImagePlus className="h-6 w-6 text-ink-400" />
          <p className="text-sm text-ink-500 dark:text-ink-400">
            Click to upload or drag &amp; drop a cover image
          </p>
          <p className="text-xs text-ink-400 font-mono">PNG, JPG, or WEBP up to 5MB</p>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
};

export default ImageUploader;
