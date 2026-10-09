import React, { useState } from 'react';
import { ExternalLink, AlertTriangle, Trash2, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface QuickExitButtonProps {
  className?: string;
}

const QuickExitButton: React.FC<QuickExitButtonProps> = ({ className = '' }) => {
  const {
    quickExit,
    quickExitAndDeletePlan,
    isAuthenticated,
    quickExitConfirmOpen,
    openQuickExitConfirm,
    closeQuickExitConfirm,
  } = useAuthStore();
  const [working, setWorking] = useState(false);

  const handleExitAndDelete = async () => {
    setWorking(true);
    await quickExitAndDeletePlan();
    // Redirect happens inside the action; no further state needed.
  };

  return (
    <>
      <button
        onClick={openQuickExitConfirm}
        className={`fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-50 flex items-center space-x-1 sm:space-x-2 bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg shadow-lg hover:bg-red-700 transition-colors touch-target ${className}`}
        title="Quickly exit to a safe site"
      >
        <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
        <span className="text-xs sm:text-sm">Exit</span>
      </button>

      {quickExitConfirmOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="quick-exit-title"
        >
          <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0" />
                <h2 id="quick-exit-title" className="text-lg font-semibold text-gray-900 dark:text-white">
                  Quick Exit
                </h2>
              </div>
              <button
                onClick={closeQuickExitConfirm}
                disabled={working}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
                title="Cancel"
                aria-label="Cancel"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md p-3 mb-4">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Quick Exit clears this site's data from this device and redirects you to a neutral
                website. It does <strong>not</strong> delete any Safety Plan you have saved to your
                account, and it does <strong>not</strong> erase your browser history.
              </p>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              How would you like to exit?
            </p>

            <div className="space-y-3">
              <button
                onClick={quickExit}
                disabled={working}
                className="w-full flex items-center justify-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Quick Exit only</span>
              </button>

              {isAuthenticated && (
                <button
                  onClick={handleExitAndDelete}
                  disabled={working}
                  className="w-full flex items-center justify-center space-x-2 bg-white dark:bg-gray-700 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg border-2 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>{working ? 'Deleting & exiting...' : 'Quick Exit + Delete saved Safety Plan'}</span>
                </button>
              )}

              <button
                onClick={closeQuickExitConfirm}
                disabled={working}
                className="w-full px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuickExitButton;
