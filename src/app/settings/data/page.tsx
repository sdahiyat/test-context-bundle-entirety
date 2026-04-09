'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SettingsNav from '@/components/settings/SettingsNav';
import SettingsSection from '@/components/settings/SettingsSection';

export default function DataPrivacyPage() {
  const router = useRouter();

  // Export state
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  // Delete account state
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleExportData = async () => {
    setExporting(true);
    setExportError(null);
    try {
      const response = await fetch('/api/settings/export-data');
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to export data');
      }

      // Get the filename from Content-Disposition header if available
      const contentDisposition = response.headers.get('Content-Disposition');
      let fileName = 'nutritrack-export.json';
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match) {
          fileName = match[1];
        }
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setExportError(err instanceof Error ? err.message : 'Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return;

    setDeleting(true);
    setDeleteError(null);
    try {
      const response = await fetch('/api/settings/delete-account', {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete account');
      }

      // Sign out and redirect to landing page
      router.push('/');
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete account');
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-8">
        <SettingsNav title="Data & Privacy" />

        <div className="space-y-6">
          {/* Export Data */}
          <SettingsSection
            title="Export Your Data"
            description="Download a copy of all your NutriTrack data including meals, profile, and settings in JSON format."
          >
            <div className="mt-3">
              {exportError && (
                <p className="text-sm text-red-600 mb-3">{exportError}</p>
              )}
              <button
                onClick={handleExportData}
                disabled={exporting}
                className="flex items-center gap-2 py-2 px-4 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {exporting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Preparing export...
                  </>
                ) : (
                  <>
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
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Download My Data
                  </>
                )}
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Your export will include all meals logged, nutrition data, profile information, and
                app settings.
              </p>
            </div>
          </SettingsSection>

          {/* Delete Account */}
          <SettingsSection
            title="Danger Zone"
            description="Permanently delete your account and all associated data. This action cannot be undone."
            danger
          >
            <div className="mt-3 space-y-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <h3 className="text-sm font-semibold text-red-800 mb-1">
                  ⚠️ This action is permanent
                </h3>
                <ul className="text-xs text-red-700 space-y-1">
                  <li>• All your meals and nutrition data will be deleted</li>
                  <li>• Your profile and goals will be removed</li>
                  <li>• Your account cannot be recovered</li>
                  <li>• You will be immediately signed out</li>
                </ul>
              </div>

              <div>
                <label
                  htmlFor="deleteConfirm"
                  className="block text-sm font-medium text-red-700 mb-1"
                >
                  Type{' '}
                  <span className="font-mono font-bold text-red-800 bg-red-100 px-1 rounded">
                    DELETE
                  </span>{' '}
                  to confirm
                </label>
                <input
                  id="deleteConfirm"
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Type DELETE here"
                  className="w-full px-3 py-2 border border-red-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                />
              </div>

              {deleteError && <p className="text-sm text-red-700">{deleteError}</p>}

              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== 'DELETE' || deleting}
                className="w-full py-2 px-4 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {deleting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting account...
                  </span>
                ) : (
                  'Permanently Delete My Account'
                )}
              </button>
            </div>
          </SettingsSection>
        </div>
      </div>
    </div>
  );
}
