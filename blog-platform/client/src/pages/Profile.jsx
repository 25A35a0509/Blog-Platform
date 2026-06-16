import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Save, User, Mail, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import * as authApi from '../api/authApi';
import ImageUploader from '../components/ImageUploader';
import { formatDate, getInitials } from '../utils/helpers';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const next = {};
    if (!name.trim()) next.name = 'Name is required';
    if (password && password.length < 6) next.password = 'Password must be at least 6 characters';
    if (password && password !== confirmPassword) next.confirmPassword = 'Passwords do not match';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = { name: name.trim(), bio: bio.trim(), avatar };
      if (password) payload.password = password;

      const updated = await authApi.updateProfile(payload);
      updateUser(updated);
      setPassword('');
      setConfirmPassword('');
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message || 'Could not update profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-2xl sm:text-3xl font-semibold mb-1">Your profile</h1>
      <p className="text-sm text-ink-500 dark:text-ink-400 mb-8">
        Manage your account information and how others see you on Inkwell.
      </p>

      {/* Summary card */}
      <div className="card p-5 flex items-center gap-4 mb-6">
        {avatar ? (
          <img src={avatar} alt={name} className="h-16 w-16 rounded-full object-cover" />
        ) : (
          <span className="flex items-center justify-center h-16 w-16 rounded-full bg-accent-200 text-accent-800 text-xl font-semibold">
            {getInitials(name)}
          </span>
        )}
        <div>
          <p className="font-display text-lg font-semibold">{user?.name}</p>
          <p className="text-sm text-ink-500 dark:text-ink-400 flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" /> {user?.email}
          </p>
          <p className="text-xs font-mono text-ink-400 flex items-center gap-1.5 mt-0.5">
            <Calendar className="h-3 w-3" /> Joined {formatDate(user?.createdAt)}
          </p>
        </div>
      </div>

      <Link
        to={`/?author=${user?._id}`}
        className="inline-block text-sm text-primary-600 dark:text-primary-300 hover:underline mb-6"
      >
        View your published posts &rarr;
      </Link>

      <form onSubmit={handleSubmit} className="card p-6 space-y-5" noValidate>
        <h2 className="font-display text-lg font-semibold flex items-center gap-2">
          <User className="h-4.5 w-4.5" /> Edit details
        </h2>

        <div>
          <label className="label-text">Avatar</label>
          <ImageUploader value={avatar} onChange={setAvatar} />
        </div>

        <div>
          <label htmlFor="name" className="label-text">
            Name
          </label>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
          {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="bio" className="label-text">
            Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            maxLength={300}
            placeholder="Tell readers a little about yourself"
            className="input-field resize-none"
          />
          <p className="font-mono text-xs text-ink-400 mt-1">{bio.length}/300</p>
        </div>

        <div className="border-t border-ink-100 dark:border-ink-800 pt-5">
          <h3 className="font-medium text-sm text-ink-700 dark:text-ink-200 mb-3">Change password</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="label-text">
                New password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to keep current"
                className="input-field"
              />
              {errors.password && <p className="text-xs text-rose-600 mt-1">{errors.password}</p>}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="label-text">
                Confirm new password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field"
              />
              {errors.confirmPassword && <p className="text-xs text-rose-600 mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Saving…' : (
              <>
                <Save className="h-4 w-4" /> Save changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
