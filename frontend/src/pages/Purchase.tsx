import { useEffect, useState, FormEvent } from 'react';
import { ShoppingCart, Send, CheckCircle, XCircle, Package } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { StatusBadge } from '../components/StatusBadge';
import { ApprovalTimeline } from '../components/ApprovalTimeline';
import { EmptyState } from '../components/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Modal } from '../components/Modal';
import api from '../lib/api';
import type { PurchaseRequest } from '../types';

type Tab = 'new' | 'my-requests' | 'approve' | 'all';

export function Purchase() {
  const { isAdmin, isManager } = useAuth();
  const [tab, setTab] = useState<Tab>('new');
  const [myRequests, setMyRequests] = useState<PurchaseRequest[]>([]);
  const [pendingQueue, setPendingQueue] = useState<PurchaseRequest[]>([]);
  const [allRequests, setAllRequests] = useState<PurchaseRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [estimatedCost, setEstimatedCost] = useState('');
  const [vendorName, setVendorName] = useState('');

  // Reject modal
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectingId, setRejectingId] = useState('');
  const [rejectType, setRejectType] = useState<'manager' | 'admin'>('manager');
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [myRes] = await Promise.all([api.get('/purchase/my-requests')]);
      setMyRequests(myRes.data);

      if (isAdmin || isManager) {
        const pRes = await api.get('/purchase/pending-manager');
        const pendingAdmin = isAdmin ? await api.get('/purchase/pending-admin') : { data: [] };
        setPendingQueue([...pRes.data, ...pendingAdmin.data]);
      }

      if (isAdmin) {
        const allRes = await api.get('/purchase/all');
        setAllRequests(allRes.data);
      }
    } catch { } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setSubmitting(true);
    try {
      await api.post('/purchase/create', {
        title, description, itemName,
        quantity: Number(quantity),
        estimatedCost: Number(estimatedCost),
        vendorName: vendorName || undefined,
      });
      setSuccess('Purchase request submitted!');
      setTitle(''); setDescription(''); setItemName('');
      setQuantity(1); setEstimatedCost(''); setVendorName('');
      fetchData();
      setTimeout(() => { setTab('my-requests'); setSuccess(''); }, 1500);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleManagerApprove = async (id: string) => {
    setActionLoading(true);
    try { await api.patch('/purchase/'+id+'/manager-approve'); fetchData(); }
    catch (err: any) { setError(err?.response?.data?.message || 'Failed'); }
    finally { setActionLoading(false); }
  };

  const handleAdminApprove = async (id: string) => {
    setActionLoading(true);
    try { await api.patch('/purchase/'+id+'/admin-approve'); fetchData(); }
    catch (err: any) { setError(err?.response?.data?.message || 'Failed'); }
    finally { setActionLoading(false); }
  };

  const handleMarkOrdered = async (id: string) => {
    try { await api.patch('/purchase/'+id+'/mark-ordered'); fetchData(); } catch {}
  };

  const handleMarkReceived = async (id: string) => {
    try { await api.patch('/purchase/'+id+'/mark-received'); fetchData(); } catch {}
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    setActionLoading(true);
    try {
      const endpoint = '/purchase/'+rejectingId+'/'+(rejectType === 'manager' ? 'manager-reject' : 'admin-reject');
      await api.patch(endpoint, { reason: rejectReason });
      setRejectModal(false); setRejectReason('');
      fetchData();
    } catch (err: any) { setError(err?.response?.data?.message || 'Failed'); }
    finally { setActionLoading(false); }
  };

  const tabs: { key: Tab; label: string; show: boolean }[] = [
    { key: 'new', label: 'New Request', show: true },
    { key: 'my-requests', label: 'My Requests', show: true },
    { key: 'approve', label: 'Approve Queue', show: isAdmin || isManager },
    { key: 'all', label: 'All Requests', show: isAdmin },
  ].filter(t => t.show);

  const totalSpend = allRequests
    .filter(r => ['APPROVED', 'ORDERED', 'RECEIVED'].includes(r.status))
    .reduce((sum, r) => sum + r.estimatedCost, 0);

  const filteredAll = statusFilter ? allRequests.filter(r => r.status === statusFilter) : allRequests;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Purchase Requests</h1>
        <p className="text-gray-500 text-sm mt-1">Raise and manage purchase approval workflows</p>
      </div>

      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={px-4 py-2 rounded-lg text-sm font-medium transition-colors +
              (tab === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900')}>
            {t.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
          <XCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {/* NEW REQUEST */}
      {tab === 'new' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl">
          <h2 className="text-base font-semibold text-gray-900 mb-5">New Purchase Request</h2>
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> {success}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. MacBook Pro for development"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={3} placeholder="Provide business justification..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Item Name</label>
                <input value={itemName} onChange={e => setItemName(e.target.value)} required placeholder="e.g. MacBook Pro 14 M3"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Quantity</label>
                <input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} min={1} required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Estimated Cost (?)</label>
                <input type="number" value={estimatedCost} onChange={e => setEstimatedCost(e.target.value)} required min={0} placeholder="0"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Vendor Name <span className="text-gray-400">(optional)</span></label>
                <input value={vendorName} onChange={e => setVendorName(e.target.value)} placeholder="e.g. Apple India"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <button type="submit" disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 text-sm">
              <Send className="w-4 h-4" />
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>
      )}

      {/* MY REQUESTS */}
      {tab === 'my-requests' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">My Purchase Requests</h2>
          </div>
          {loading ? <div className="py-20"><LoadingSpinner /></div> :
           myRequests.length === 0 ? (
            <EmptyState icon={<ShoppingCart className="w-12 h-12" />} title="No requests yet" description="Create a new purchase request to get started" />
          ) : (
            <div className="divide-y divide-gray-100">
              {myRequests.map(req => (
                <div key={req.id} className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{req.title}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{req.itemName} × {req.quantity} · ?{req.estimatedCost.toLocaleString('en-IN')}</p>
                    </div>
                    <StatusBadge status={req.status} />
                  </div>
                  <div className="mt-4">
                    <ApprovalTimeline status={req.status} />
                  </div>
                  {req.rejectionReason && (
                    <p className="mt-3 text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">Rejected: {req.rejectionReason}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* APPROVE QUEUE */}
      {tab === 'approve' && (isAdmin || isManager) && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Approval Queue</h2>
            <span className="text-sm text-gray-500">{pendingQueue.length} pending</span>
          </div>
          {loading ? <div className="py-20"><LoadingSpinner /></div> :
           pendingQueue.length === 0 ? (
            <EmptyState icon={<CheckCircle className="w-12 h-12" />} title="Queue is clear" description="No purchase requests need your approval" />
          ) : (
            <div className="divide-y divide-gray-100">
              {pendingQueue.map(req => (
                <div key={req.id} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{req.title}</h3>
                        <StatusBadge status={req.status} />
                      </div>
                      <p className="text-sm text-gray-500 mb-2">
                        {req.raisedBy?.name} · {req.raisedBy?.department} · {req.itemName} × {req.quantity}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">{req.description}</p>
                      <p className="text-lg font-bold text-gray-900">?{req.estimatedCost.toLocaleString('en-IN')}</p>
                      {req.vendorName && <p className="text-xs text-gray-400">Vendor: {req.vendorName}</p>}
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      {req.status === 'PENDING_MANAGER' && (
                        <>
                          <button onClick={() => handleManagerApprove(req.id)} disabled={actionLoading}
                            className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50">
                            <CheckCircle className="w-4 h-4" /> Approve
                          </button>
                          <button onClick={() => { setRejectingId(req.id); setRejectType('manager'); setRejectModal(true); }} disabled={actionLoading}
                            className="flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-medium rounded-lg border border-red-200 transition-colors disabled:opacity-50">
                            <XCircle className="w-4 h-4" /> Reject
                          </button>
                        </>
                      )}
                      {req.status === 'PENDING_ADMIN' && isAdmin && (
                        <>
                          <button onClick={() => handleAdminApprove(req.id)} disabled={actionLoading}
                            className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50">
                            <CheckCircle className="w-4 h-4" /> Final Approve
                          </button>
                          <button onClick={() => { setRejectingId(req.id); setRejectType('admin'); setRejectModal(true); }} disabled={actionLoading}
                            className="flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-medium rounded-lg border border-red-200 transition-colors disabled:opacity-50">
                            <XCircle className="w-4 h-4" /> Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ALL REQUESTS - admin only */}
      {tab === 'all' && isAdmin && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-base font-semibold text-gray-900">All Purchase Requests</h2>
              <p className="text-sm text-gray-500 mt-0.5">Total approved spend: ?{totalSpend.toLocaleString('en-IN')}</p>
            </div>
            <div className="flex items-center gap-3">
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">All statuses</option>
                {['PENDING_MANAGER','PENDING_ADMIN','APPROVED','REJECTED','ORDERED','RECEIVED'].map(s => (
                  <option key={s} value={s}>{s.replace('_', ' ')}</option>
                ))}
              </select>
              {isAdmin && (
                <div className="flex gap-2">
                  {allRequests.filter(r => r.status === 'APPROVED').map(r => (
                    <div key={r.id} className="hidden" />
                  ))}
                </div>
              )}
            </div>
          </div>
          {loading ? <div className="py-20"><LoadingSpinner /></div> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    {['Title', 'Raised By', 'Item', 'Cost', 'Status', 'Date'].map(h => (
                      <th key={h} className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAll.map(req => (
                    <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate">{req.title}</td>
                      <td className="px-6 py-4 text-gray-600">{req.raisedBy?.name}<br/><span className="text-xs text-gray-400">{req.raisedBy?.department}</span></td>
                      <td className="px-6 py-4 text-gray-600">{req.itemName} × {req.quantity}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">?{req.estimatedCost.toLocaleString('en-IN')}</td>
                      <td className="px-6 py-4"><StatusBadge status={req.status} /></td>
                      <td className="px-6 py-4 text-gray-500">{new Date(req.createdAt).toLocaleDateString('en-IN')}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {req.status === 'APPROVED' && (
                            <button onClick={() => handleMarkOrdered(req.id)} className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors">
                              Mark Ordered
                            </button>
                          )}
                          {req.status === 'ORDERED' && (
                            <button onClick={() => handleMarkReceived(req.id)} className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors">
                              Mark Received
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <Modal isOpen={rejectModal} onClose={() => { setRejectModal(false); setRejectReason(''); }} title="Reject Purchase Request" size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Reason for rejection</label>
            <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={3} placeholder="Provide a clear reason..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none" />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setRejectModal(false)} className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
            <button onClick={handleReject} disabled={!rejectReason.trim() || actionLoading}
              className="flex-1 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50">
              {actionLoading ? 'Rejecting...' : 'Reject'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

