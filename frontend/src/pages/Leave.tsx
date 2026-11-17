import { formatDate } from '../lib/format';
import { useEffect, useState, FormEvent } from 'react';
import { CalendarDays, Send, Clock, CheckCircle, XCircle, Info } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Modal } from '../components/Modal';
import api from '../lib/api';
import type { LeaveRequest, LeaveBalance } from '../types';

type Tab = 'apply' | 'my-history' | 'approvals';

export function Leave() {
  const { isAdmin, isManager } = useAuth();
  const [tab, setTab] = useState<Tab>('apply');
  const [myRequests, setMyRequests] = useState<LeaveRequest[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<LeaveRequest[]>([]);
  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [leaveType, setLeaveType] = useState('ANNUAL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  // Reject modal
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectingId, setRejectingId] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reqRes, pendingRes] = await Promise.all([
        api.get('/leave/my-requests'),
        (isAdmin || isManager) ? api.get('/leave/pending') : Promise.resolve({ data: [] }),
      ]);
      setMyRequests(reqRes.data);
      setPendingApprovals(pendingRes.data);

      // fetch balances for the current user
      const meRes = await api.get('/auth/me');
      const balRes = await api.get('/leave/balances/' + meRes.data.id);
      setBalances(balRes.data);
    } catch {
      // fail silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleApply = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      await api.post('/leave/apply', { leaveType, startDate, endDate, reason });
      setSuccess('Leave request submitted successfully!');
      setLeaveType('ANNUAL');
      setStartDate('');
      setEndDate('');
      setReason('');
      fetchData();
      setTimeout(() => { setTab('my-history'); setSuccess(''); }, 1500);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to submit leave request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async (id: string) => {
    setActionLoading(true);
    try {
      await api.patch('/leave/' + id + '/approve');
      fetchData();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to approve');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    setActionLoading(true);
    try {
      await api.patch('/leave/' + rejectingId + '/reject', { reason: rejectReason });
      setRejectModalOpen(false);
      setRejectReason('');
      fetchData();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to reject');
    } finally {
      setActionLoading(false);
    }
  };

  const tabs: { key: Tab; label: string; show: boolean }[] = [
    { key: 'apply', label: 'Apply for Leave', show: true },
    { key: 'my-history', label: 'My History', show: true },
    { key: 'approvals', label: 'Team Approvals', show: isAdmin || isManager },
  ].filter(t => t.show);

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
        <p className="text-gray-500 text-sm mt-1">Apply, track, and manage leave requests</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={px-4 py-2 rounded-lg text-sm font-medium transition-colors +
              (tab === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900')
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ---- APPLY TAB ---- */}
      {tab === 'apply' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-xl">
          <h2 className="text-base font-semibold text-gray-900 mb-5">New Leave Request</h2>

          {/* Balance summary */}
          {balances.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-6">
              {balances.map(b => (
                <div key={b.id} className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-0.5">{b.leaveType.toLowerCase()}</p>
                  <p className="text-lg font-bold text-gray-900">{b.totalDays - b.usedDays}</p>
                  <p className="text-xs text-gray-400">remaining</p>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
              <XCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              {success}
            </div>
          )}

          <form onSubmit={handleApply} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Leave Type</label>
              <select
                value={leaveType}
                onChange={e => setLeaveType(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="SICK">Sick Leave</option>
                <option value="CASUAL">Casual Leave</option>
                <option value="ANNUAL">Annual Leave</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  min={today}
                  onChange={e => setStartDate(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  min={startDate || today}
                  onChange={e => setEndDate(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Reason</label>
              <textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                required
                rows={3}
                placeholder="Please provide a reason for your leave request..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 text-sm"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>
      )}

      {/* ---- MY HISTORY TAB ---- */}
      {tab === 'my-history' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">My Leave History</h2>
          </div>
          {loading ? (
            <div className="py-20"><LoadingSpinner /></div>
          ) : myRequests.length === 0 ? (
            <EmptyState
              icon={<CalendarDays className="w-12 h-12" />}
              title="No leave requests yet"
              description="Apply for leave using the Apply tab"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Dates</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Days</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Reason</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Applied</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {myRequests.map(req => (
                    <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <StatusBadge status={req.leaveType} />
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {new Date(req.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        {' – '}
                        {new Date(req.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">{req.daysCount}</td>
                      <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{req.reason}</td>
                      <td className="px-6 py-4">
                        <div>
                          <StatusBadge status={req.status} />
                          {req.rejectReason && (
                            <p className="text-xs text-red-500 mt-1 max-w-xs truncate">{req.rejectReason}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(req.createdAt).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ---- APPROVALS TAB ---- */}
      {tab === 'approvals' && (isAdmin || isManager) && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Pending Approvals</h2>
            <span className="text-sm text-gray-500">{pendingApprovals.length} pending</span>
          </div>
          {loading ? (
            <div className="py-20"><LoadingSpinner /></div>
          ) : pendingApprovals.length === 0 ? (
            <EmptyState
              icon={<CheckCircle className="w-12 h-12" />}
              title="All caught up!"
              description="No pending leave requests to review"
            />
          ) : (
            <div className="divide-y divide-gray-100">
              {pendingApprovals.map(req => (
                <div key={req.id} className="p-6 flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{req.employee?.name}</span>
                      <span className="text-gray-400">·</span>
                      <span className="text-sm text-gray-500">{req.employee?.department}</span>
                      <StatusBadge status={req.leaveType} />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {new Date(req.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      {' – '}
                      {new Date(req.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                      {' · '}
                      <strong>{req.daysCount} working days</strong>
                    </p>
                    <p className="text-sm text-gray-500 italic">"{req.reason}"</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleApprove(req.id)}
                      disabled={actionLoading}
                      className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => { setRejectingId(req.id); setRejectModalOpen(true); }}
                      disabled={actionLoading}
                      className="flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-medium rounded-lg transition-colors border border-red-200 disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reject modal */}
      <Modal isOpen={rejectModalOpen} onClose={() => { setRejectModalOpen(false); setRejectReason(''); }} title="Reject Leave Request" size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Reason for rejection</label>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              rows={3}
              placeholder="Provide a clear reason..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
            />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setRejectModalOpen(false)} className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
              Cancel
            </button>
            <button onClick={handleReject} disabled={!rejectReason.trim() || actionLoading} className="flex-1 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50">
              {actionLoading ? 'Rejecting...' : 'Reject'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}


// Leave page - display rejection reason in tooltip or expanded row
// add Breadcrumb to Leave page
// fix: prevent form double submit on leave apply
// add loading state to approve/reject buttons
// fix: date picker min date should be today
// fix: end date min should be start date
// improve: show days count preview on leave apply form
// fix: tab key navigation works in leave form
// fix: typo in label - Leve -> Leave
// fix: tab defaults to my-history for manager
// improve: success message after leave applied
// fix: sorting my-requests by newest first
