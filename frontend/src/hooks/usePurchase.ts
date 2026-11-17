import { useState, useEffect, useCallback } from 'react';
import api from '../lib/api';
import type { PurchaseRequest } from '../types';

export function usePurchase() {
  const [myRequests, setMyRequests] = useState<PurchaseRequest[]>([]);
  const [pendingManagerRequests, setPendingManagerRequests] = useState<PurchaseRequest[]>([]);
  const [pendingAdminRequests, setPendingAdminRequests] = useState<PurchaseRequest[]>([]);
  const [allRequests, setAllRequests] = useState<PurchaseRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMyRequests = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/purchase/my-requests');
      setMyRequests(data.data || data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPendingManager = useCallback(async () => {
    try {
      const { data } = await api.get('/purchase/pending-manager');
      setPendingManagerRequests(data.data || data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load manager queue');
    }
  }, []);

  const fetchPendingAdmin = useCallback(async () => {
    try {
      const { data } = await api.get('/purchase/pending-admin');
      setPendingAdminRequests(data.data || data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load admin queue');
    }
  }, []);

  const fetchAll = useCallback(async () => {
    try {
      const { data } = await api.get('/purchase/all');
      setAllRequests(data.data || data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load all requests');
    }
  }, []);

  const createRequest = useCallback(async (payload: {
    title: string;
    description: string;
    itemName: string;
    quantity: number;
    estimatedCost: number;
    vendorName?: string;
  }) => {
    const { data } = await api.post('/purchase/create', payload);
    return data;
  }, []);

  const managerApprove = useCallback(async (id: number) => {
    const { data } = await api.patch(`/purchase/${id}/manager-approve`);
    return data;
  }, []);

  const managerReject = useCallback(async (id: number, reason: string) => {
    const { data } = await api.patch(`/purchase/${id}/manager-reject`, { reason });
    return data;
  }, []);

  const adminApprove = useCallback(async (id: number) => {
    const { data } = await api.patch(`/purchase/${id}/admin-approve`);
    return data;
  }, []);

  const adminReject = useCallback(async (id: number, reason: string) => {
    const { data } = await api.patch(`/purchase/${id}/admin-reject`, { reason });
    return data;
  }, []);

  useEffect(() => {
    fetchMyRequests();
  }, [fetchMyRequests]);

  return {
    myRequests,
    pendingManagerRequests,
    pendingAdminRequests,
    allRequests,
    loading,
    error,
    fetchMyRequests,
    fetchPendingManager,
    fetchPendingAdmin,
    fetchAll,
    createRequest,
    managerApprove,
    managerReject,
    adminApprove,
    adminReject,
  };
}
// add: refetch after create
// add: error state reset on new fetch
