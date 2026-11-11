import { useState, useEffect, useCallback } from 'react';
import api from '../lib/api';
import type { LeaveRequest, LeaveBalance } from '../types';

export function useLeave() {
  const [myRequests, setMyRequests] = useState<LeaveRequest[]>([]);
  const [pendingRequests, setPendingRequests] = useState<LeaveRequest[]>([]);
  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMyRequests = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/leave/my-requests');
      setMyRequests(data.data || data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load leave requests');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPendingRequests = useCallback(async () => {
    try {
      const { data } = await api.get('/leave/pending');
      setPendingRequests(data.data || data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load pending requests');
    }
  }, []);

  const fetchBalances = useCallback(async (userId: number) => {
    try {
      const { data } = await api.get(`/leave/balances/${userId}`);
      setBalances(data.data || data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load balances');
    }
  }, []);

  const applyLeave = useCallback(async (payload: {
    leaveType: string;
    startDate: string;
    endDate: string;
    reason: string;
  }) => {
    const { data } = await api.post('/leave/apply', payload);
    return data;
  }, []);

  const approveLeave = useCallback(async (id: number) => {
    const { data } = await api.patch(`/leave/${id}/approve`);
    return data;
  }, []);

  const rejectLeave = useCallback(async (id: number, reason: string) => {
    const { data } = await api.patch(`/leave/${id}/reject`, { reason });
    return data;
  }, []);

  useEffect(() => {
    fetchMyRequests();
  }, [fetchMyRequests]);

  return {
    myRequests,
    pendingRequests,
    balances,
    loading,
    error,
    fetchMyRequests,
    fetchPendingRequests,
    fetchBalances,
    applyLeave,
    approveLeave,
    rejectLeave,
  };
}
