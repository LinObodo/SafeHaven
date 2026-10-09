import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Briefcase, Plus, Clock } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNGOCaseStore } from '../store/ngoCaseStore';
import { NGOCaseStatus } from '../types';
import QuickExitButton from '../components/Common/QuickExitButton';

const STATUS_OPTIONS: { value: NGOCaseStatus; label: string }[] = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
];

const statusBadgeClass: Record<NGOCaseStatus, string> = {
  open: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
  in_progress: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300',
  resolved: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300',
  closed: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

const Cases: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { cases, loading, saving, error, loadCases, createCase, updateStatus } = useNGOCaseStore();
  const [form, setForm] = useState({ assignedNgo: '', notes: '' });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      loadCases();
    }
  }, [isAuthenticated, loadCases]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    const result = await createCase(form);
    if (result.error) {
      setFormError(result.error);
    } else {
      setForm({ assignedNgo: '', notes: '' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <QuickExitButton />

      {/* Header */}
      <section className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <Briefcase className="h-12 w-12 text-primary-600 mx-auto mb-3" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            NGO Case Referrals
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Refer your situation to a support organization and track the status of your case.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Create case */}
        <form
          onSubmit={handleCreate}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <Plus className="h-5 w-5 text-primary-600" />
            <span>Refer a new case</span>
          </h2>

          {formError && <p className="text-sm text-red-600 dark:text-red-400 mb-3">{formError}</p>}

          <div className="space-y-4">
            <div>
              <label htmlFor="assignedNgo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                NGO ID
              </label>
              <input
                id="assignedNgo"
                type="text"
                placeholder="The ID of the NGO you want to refer to"
                value={form.assignedNgo}
                onChange={(e) => setForm((prev) => ({ ...prev, assignedNgo: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes (optional)
              </label>
              <textarea
                id="notes"
                rows={3}
                placeholder="Any context you want to share with the NGO"
                value={form.notes}
                onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>{saving ? 'Creating...' : 'Create Case'}</span>
            </button>
          </div>
        </form>

        {/* Case list */}
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Your cases</h2>

          {loading ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">Loading cases...</p>
          ) : cases.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <Briefcase className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">
                You don't have any cases yet. Refer one above to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cases.map((c) => {
                const isNgo = user?.id === c.assignedNGO;
                return (
                  <div
                    key={c.id}
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {isNgo ? 'Referred to you' : 'Referred by you'}
                        </p>
                        <p className="font-mono text-sm text-gray-700 dark:text-gray-300 truncate">
                          {isNgo ? `Survivor: ${c.survivorId}` : `NGO: ${c.assignedNGO}`}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusBadgeClass[c.status]}`}
                      >
                        {STATUS_OPTIONS.find((s) => s.value === c.status)?.label}
                      </span>
                    </div>

                    {c.notes && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 whitespace-pre-wrap">
                        {c.notes}
                      </p>
                    )}

                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <span className="text-xs text-gray-400 flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>Updated {c.updatedAt.toLocaleDateString()}</span>
                      </span>

                      <div className="flex items-center space-x-2">
                        <label htmlFor={`status-${c.id}`} className="text-sm text-gray-600 dark:text-gray-400">
                          Status
                        </label>
                        <select
                          id={`status-${c.id}`}
                          value={c.status}
                          onChange={(e) => updateStatus(c.id, e.target.value as NGOCaseStatus)}
                          className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cases;
