'use client';

import { useState } from 'react';
import SettingsNav from '@/components/settings/SettingsNav';
import SettingsSection from '@/components/settings/SettingsSection';

type ToastType = 'success' | 'error';
interface Toast {
  message: string;
  type: ToastType;
}

function ToastNotification({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  return (
    <div
      className={`fixed top-4 right-4 left-4 md:left-auto md:w-96 z-50 rounded-xl p-4 shadow-lg flex items-start gap-3 ${
        toast.type === 'success'
          ? 'bg-green-50 border border-green-200 text-green-800'
          : 'bg-red-50 border border-red-200 text-red-800'
      }`}
    >
      <div className="flex-1 text-sm font-medium">{toast.message}</div>
      <button
        onClick={onDismiss}
        className="flex-shrink-0 text-current opacity-60 hover:opacity-100"
        aria-label="Dismiss"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AccountSettingsPage() {
  const [toast, setToast] = useState<Toast | null>(null);

  // Email form state
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailErrors, setEmailErrors] = useState<{ newEmail?: string; confirmEmail?: string }>({});

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const validateEmailForm = () => {
    const errors: typeof emailErrors = {};
    if (!newEmail.trim()) {
      errors.newEmail = 'Email is required';
    } else if (!EMAIL_REGEX.test(newEmail.trim())) {
      errors.newEmail = 'Please enter a valid email address';
    }
    if (!confirmEmail.trim()) {
      errors.confirmEmail = 'Please confirm your new email';
    } else if (newEmail.trim() !== confirmEmail.trim()) {
      errors.confirmEmail = 'Email addresses do not match';
    }
    setEmailErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePasswordForm = () => {
    const errors: typeof passwordErrors = {};
    if (!currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    if (!newPassword) {
      errors.newPassword = 'New password is required';
    } else if (newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmailForm()) return;

    setEmailLoading(true);
    try {
      const response = await fetch('/api/settings/update-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newEmail: newEmail.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.error || 'Failed to update email', 'error');
        return;
      }

      showToast(data.message, 'success');
      setNewEmail('');
      setConfirmEmail('');
      setEmailErrors({});
    } catch {
      showToast('An unexpected error occurred. Please try again.', 'error');
    } finally {
      setEmailLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;

    setPasswordLoading(true);
    try {
      const response = await fetch('/api/settings/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.error || 'Failed to update password', 'error');
        return;
      }

      showToast(data.message, 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordErrors({});
    } catch {
      showToast('An unexpected error occurred. Please try again.', 'error');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && <ToastNotification toast={toast} onDismiss={() => setToast(null)} />}

      <div className="max-w-lg mx-auto px-4 py-8">
        <SettingsNav title="Email & Password" />

        <div className="space-y-6">
          {/* Change Email */}
          <SettingsSection
            title="Change Email"
            description="Update the email address associated with your account. A confirmation will be sent to your new email."
          >
            <form onSubmit={handleEmailSubmit} className="space-y-4 mt-2">
              <div>
                <label
                  htmlFor="newEmail"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  New Email Address
                </label>
                <input
                  id="newEmail"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter new email"
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    emailErrors.newEmail
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300'
                  }`}
                />
                {emailErrors.newEmail && (
                  <p className="text-xs text-red-600 mt-1">{emailErrors.newEmail}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmEmail"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm New Email
                </label>
                <input
                  id="confirmEmail"
                  type="email"
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                  placeholder="Confirm new email"
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    emailErrors.confirmEmail
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300'
                  }`}
                />
                {emailErrors.confirmEmail && (
                  <p className="text-xs text-red-600 mt-1">{emailErrors.confirmEmail}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={emailLoading}
                className="w-full py-2 px-4 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {emailLoading ? 'Sending confirmation...' : 'Update Email'}
              </button>
            </form>
          </SettingsSection>

          {/* Change Password */}
          <SettingsSection
            title="Change Password"
            description="Choose a strong password with at least 8 characters."
          >
            <form onSubmit={handlePasswordSubmit} className="space-y-4 mt-2">
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    passwordErrors.currentPassword
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300'
                  }`}
                />
                {passwordErrors.currentPassword && (
                  <p className="text-xs text-red-600 mt-1">{passwordErrors.currentPassword}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min. 8 characters)"
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    passwordErrors.newPassword
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300'
                  }`}
                />
                {passwordErrors.newPassword && (
                  <p className="text-xs text-red-600 mt-1">{passwordErrors.newPassword}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    passwordErrors.confirmPassword
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300'
                  }`}
                />
                {passwordErrors.confirmPassword && (
                  <p className="text-xs text-red-600 mt-1">{passwordErrors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full py-2 px-4 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {passwordLoading ? 'Updating password...' : 'Update Password'}
              </button>
            </form>
          </SettingsSection>
        </div>
      </div>
    </div>
  );
}
