'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { 
  HiUser, 
  HiMail, 
  HiBriefcase, 
  HiCamera, 
  HiCheckCircle, 
  HiChatAlt2,
  HiLockClosed,
  HiEye,
  HiEyeOff
} from 'react-icons/hi';
import { staffStore, Staff } from '@/lib/stores/StaffStore';
import { useToast } from '@/components/ToastProvider';

export default function AdminProfilePage() {
  const { data: session, status: sessionStatus, update: updateSession } = useSession();
  const userId = (session?.user as any)?.id;
  const userStatus = (session?.user as any)?.status;

  // Read initial profile from StaffStore cache if already available
  const cachedUser = (userId ? staffStore.profilesById.get(userId) : null) || staffStore.currentUserProfile;
  const [staff, setStaff] = useState<Staff | null>(cachedUser);
  const [loading, setLoading] = useState(() => !cachedUser && sessionStatus === 'loading');
  const [saving, setSaving] = useState(false);

  // Profile Form fields
  const [name, setName] = useState(cachedUser?.name || session?.user?.name || '');
  const [picture, setPicture] = useState(cachedUser?.picture || '');
  const [quote, setQuote] = useState(cachedUser?.quote || '');
  const [position, setPosition] = useState(cachedUser?.position || 'General Staff');

  // Credentials Form fields
  const [email, setEmail] = useState(cachedUser?.email || session?.user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [updatingCredentials, setUpdatingCredentials] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    // Subscribe to real-time StaffStore cache updates
    const unsubscribe = staffStore.subscribe(() => {
      const u = (userId ? staffStore.profilesById.get(userId) : null) || staffStore.currentUserProfile;
      if (u) {
        setStaff(u);
        setName(prev => prev || u.name || '');
        setEmail(prev => prev || u.email || '');
        setPicture(prev => prev || u.picture || '');
        setQuote(prev => prev || u.quote || '');
        setPosition(u.position || 'General Staff');
        setLoading(false);
      }
    });

    if (userId) {
      staffStore.getUserById(userId).then(user => {
        if (user) {
          setStaff(user);
          setName(user.name || '');
          setEmail(user.email || '');
          setPicture(user.picture || '');
          setQuote(user.quote || '');
          setPosition(user.position || 'General Staff');
        }
        setLoading(false);
      });
    } else if (session?.user) {
      setName(session.user.name || '');
      setEmail(session.user.email || '');
      setLoading(false);
    } else if (sessionStatus === 'unauthenticated') {
      setLoading(false);
    }

    return unsubscribe;
  }, [userId, sessionStatus]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image file size must be less than 5MB', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPicture(reader.result);
        showToast('Profile photo selected', 'info');
      }
    };
    reader.readAsDataURL(file);
  };

  // Submit Personal Information (Name & Quote)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Full name is required', 'warning');
      return;
    }

    if (!userId) {
      showToast('User session not found', 'error');
      return;
    }

    setSaving(true);
    try {
      const updated = await staffStore.updateStaff(userId, {
        name: name.trim(),
        picture: picture.trim(),
        quote: quote.trim(),
      });

      if (updated) {
        setStaff(updated);
        showToast('Profile information updated successfully!', 'success');
        if (updateSession) {
          await updateSession({ name: updated.name });
        }
      } else {
        showToast('Failed to update profile', 'error');
      }
    } catch (error: any) {
      showToast(error.message || 'Error saving profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Submit Account Credentials (Email & Password - requires Current Password)
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      showToast('User session not found', 'error');
      return;
    }

    if (!currentPassword) {
      showToast('Current password is required to authorize changes', 'warning');
      return;
    }

    const currentEmail = (staff?.email || session?.user?.email || '').trim().toLowerCase();
    const newEmailCandidate = email.trim().toLowerCase();
    const isEmailChanged = newEmailCandidate !== '' && newEmailCandidate !== currentEmail;
    const isPasswordChanged = Boolean(newPassword.trim());

    if (!isEmailChanged && !isPasswordChanged) {
      showToast('No changes detected for email or password', 'info');
      return;
    }

    if (isPasswordChanged) {
      if (newPassword.length < 6) {
        showToast('New password must be at least 6 characters', 'warning');
        return;
      }
      if (newPassword !== confirmPassword) {
        showToast('New passwords do not match', 'warning');
        return;
      }
    }

    setUpdatingCredentials(true);
    try {
      const res = await staffStore.updateCredentials(
        userId,
        currentPassword,
        isPasswordChanged ? newPassword : undefined,
        isEmailChanged ? newEmailCandidate : undefined
      );

      if (res.success) {
        showToast(res.message || 'Credentials updated successfully!', 'success');
        if (res.user) {
          setStaff(prev => prev ? { ...prev, email: res.user.email } : prev);
        }
        if (isEmailChanged && updateSession) {
          await updateSession({ email: newEmailCandidate });
        }
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showToast(res.message || 'Failed to update credentials', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error updating credentials', 'error');
    } finally {
      setUpdatingCredentials(false);
    }
  };

  const getInitials = (text: string) => {
    if (!text) return 'ST';
    const parts = text.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  if (loading && !staff && !name) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-semibold text-sm">Loading profile information...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Staff Profile</h1>
          <p className="text-slate-500 font-medium font-inter mt-1">
            Manage your personal staff details, profile photo, and share a testimonial quote review.
          </p>
        </div>
      </div>

      {/* Top Banner Card with Profile Overview */}
      <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Avatar Showcase - Shadow removed as requested */}
          <div className="relative flex-shrink-0 group">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {/* Picture box with shadow removed */}
            <div className="w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-[2.5rem] overflow-hidden border-4 border-slate-100 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative">
              {picture ? (
                <Image
                  src={picture}
                  alt={name || 'Staff Avatar'}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-5xl md:text-6xl font-black text-primary">
                  {getInitials(name)}
                </span>
              )}
            </div>

            {/* Change Picture Icon Box - Shadow removed as requested */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary text-white rounded-2xl hover:bg-primary-dark transition-all cursor-pointer hover:scale-105 flex items-center justify-center border-2 border-white"
              title="Change Photo (Select a new image)"
            >
              <HiCamera className="text-2xl" />
            </button>
          </div>

          {/* User Details & Position Highlight */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <h2 className="text-2xl md:text-3xl font-black text-slate-900">{name || 'Staff Member'}</h2>
                <span className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  userStatus === 'admin' 
                    ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                    : 'bg-blue-100 text-blue-700 border border-blue-200'
                }`}>
                  {userStatus || 'staff'}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-400 flex items-center justify-center md:justify-start gap-1.5">
                <HiMail className="text-slate-400 text-base" />
                <span>{staff?.email || session?.user?.email || 'staff@kennytechstudios.com'}</span>
              </p>
            </div>

            {/* Position Display Pill */}
            <div className="inline-flex items-center gap-3 bg-slate-50 border border-slate-200/80 px-5 py-3 rounded-2xl">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-base">
                <HiBriefcase />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Assigned Position</p>
                <p className="text-sm font-black text-slate-800">{position || staff?.position || 'General Staff'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Profile Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Personal Information (Name, Position, Quote) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-sm space-y-8">
            <div className="border-b border-slate-100 pb-5">
              <h3 className="text-xl font-black text-slate-900">Personal Information</h3>
              <p className="text-xs text-slate-400 mt-0.5">Update your display name, profile photo, and company quote review.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Full Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-primary transition-all font-medium text-slate-800"
                  />
                  <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
                </div>
              </div>

              {/* Position Display */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-700">Company Position</label>
                  <span className="text-xs text-slate-400 font-medium">Assigned by Administration</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    disabled
                    value={position || staff?.position || 'General Staff'}
                    className="w-full bg-slate-100/70 border border-slate-200 rounded-2xl p-4 font-bold text-slate-700 cursor-not-allowed select-none pl-12"
                  />
                  <HiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
                </div>
                <p className="text-xs text-slate-400">
                  Your organizational role in company records and team directories. Contact an administrator to update.
                </p>
              </div>

              {/* Quote Review of the Company */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <HiChatAlt2 className="text-primary text-base" />
                    <span>Quote Review of Company</span>
                  </label>
                  <span className="text-xs text-slate-400 font-semibold">{quote.length}/300 characters</span>
                </div>
                <textarea
                  rows={4}
                  maxLength={300}
                  placeholder="Share a short testimonial or quote about working at Kenny Tech Studios...&#10;e.g. 'Working at Kenny Tech Studios has been an inspiring journey of innovation and engineering excellence.'"
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-primary transition-all font-medium text-slate-800 resize-none text-sm leading-relaxed"
                />
                <p className="text-xs text-slate-400">
                  This quote represents your review of the company and may be showcased in team testimonials and staff features.
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto bg-primary text-white px-10 py-4 rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <HiCheckCircle className="text-xl" />
                      <span>Save Profile Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right 1 Column: Credentials (Email & Password) */}
        <div className="space-y-8">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-xl flex-shrink-0">
                <HiLockClosed />
              </div>
              <div>
                <h4 className="text-lg font-black text-slate-900">Account Credentials</h4>
                <p className="text-xs text-slate-400 font-medium">Update email or password (current password required)</p>
              </div>
            </div>

            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              {/* Email Address - Moved to password side */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Login Email Address *</label>
                  {email.trim().toLowerCase() !== (staff?.email || session?.user?.email || '').trim().toLowerCase() && (
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                      Modified
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm outline-none focus:border-primary transition-all font-medium text-slate-800"
                  />
                  <HiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                </div>
              </div>

              {/* Current Password (Always Required) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Current Password *</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary transition-all font-medium text-slate-800 pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer transition-colors"
                    tabIndex={-1}
                    aria-label={showCurrentPassword ? 'Hide current password' : 'Show current password'}
                  >
                    {showCurrentPassword ? <HiEyeOff className="text-lg" /> : <HiEye className="text-lg" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">Required to authorize updating email or password.</p>
              </div>

              {/* New Password (Optional) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">New Password (Optional)</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    minLength={6}
                    placeholder="Leave blank to keep current password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary transition-all font-medium text-slate-800 pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer transition-colors"
                    tabIndex={-1}
                    aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                  >
                    {showNewPassword ? <HiEyeOff className="text-lg" /> : <HiEye className="text-lg" />}
                  </button>
                </div>
                {newPassword && <p className="text-[11px] text-slate-400 font-medium">Must be at least 6 characters.</p>}
              </div>

              {/* Confirm New Password (Only shown if New Password entered) */}
              {newPassword && (
                <div className="space-y-1.5 animate-in fade-in duration-150">
                  <label className="text-xs font-bold text-slate-700">Confirm New Password *</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full bg-slate-50 border rounded-2xl px-4 py-3 text-sm outline-none transition-all font-medium text-slate-800 pr-11 ${
                        confirmPassword && confirmPassword !== newPassword
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-slate-200 focus:border-primary'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer transition-colors"
                      tabIndex={-1}
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    >
                      {showConfirmPassword ? <HiEyeOff className="text-lg" /> : <HiEye className="text-lg" />}
                    </button>
                  </div>
                  {confirmPassword && confirmPassword !== newPassword && (
                    <p className="text-[11px] text-red-500 font-medium">Passwords do not match.</p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={updatingCredentials || !currentPassword}
                  className="w-full bg-slate-900 hover:bg-black text-white px-5 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {updatingCredentials ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Updating Credentials...</span>
                    </>
                  ) : (
                    <>
                      <HiLockClosed className="text-base text-amber-400" />
                      <span>Save Credentials</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
