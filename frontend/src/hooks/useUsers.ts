import { useState, useEffect, useCallback } from 'react';
import api from '../lib/api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  isActive: boolean;
  createdAt: string;
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users');
      setUsers(data.data || data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRole = useCallback(async (userId: number, role: string) => {
    const { data } = await api.patch(`/users/${userId}/role`, { role });
    return data;
  }, []);

  const deactivate = useCallback(async (userId: number) => {
    const { data } = await api.patch(`/users/${userId}/deactivate`);
    return data;
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, fetchUsers, updateRole, deactivate };
}
// fix: refetch users after role change
// add: search/filter helper
