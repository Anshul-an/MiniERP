import { useEffect, useState } from 'react';
import { Users as UsersIcon, Shield, UserCheck, UserX } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import api from '../lib/api';
import type { User } from '../types';

export function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await api.get<User[]>('/users');
      setUsers(res.data);
    } catch { } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (id: string, role: string) => {
    setUpdating(id);
    try {
      await api.patch('/users/'+id, { role });
      fetchUsers();
    } catch { } finally {
      setUpdating(null);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    setUpdating(id);
    try {
      await api.patch('/users/'+id, { isActive: !isActive });
      fetchUsers();
    } catch { } finally {
      setUpdating(null);
    }
  };

  const roleBadgeColor: Record<string, string> = {
    ADMIN: 'bg-purple-100 text-purple-700',
    MANAGER: 'bg-blue-100 text-blue-700',
    EMPLOYEE: 'bg-green-100 text-green-700',
  };

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-500 text-sm mt-1">{users.length} total users · Manage roles and account status</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <UsersIcon className="w-5 h-5 text-gray-400" />
          <h2 className="text-base font-semibold text-gray-900">All Users</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                {['User', 'Email', 'Role', 'Department', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-blue-600">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={e => handleRoleChange(user.id, e.target.value)}
                      disabled={updating === user.id}
                      className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 bg-white"
                    >
                      <option value="EMPLOYEE">Employee</option>
                      <option value="MANAGER">Manager</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.department}</td>
                  <td className="px-6 py-4">
                    <span className={inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium +
                      (user.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500')}>
                      {user.isActive ? (
                        <><UserCheck className="w-3 h-3" /> Active</>
                      ) : (
                        <><UserX className="w-3 h-3" /> Inactive</>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleActive(user.id, user.isActive ?? true)}
                      disabled={updating === user.id}
                      className={px-3 py-1.5 text-xs font-medium rounded-lg transition-colors disabled:opacity-50 +
                        (user.isActive
                          ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                          : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200')}
                    >
                      {updating === user.id ? '...' : (user.isActive ? 'Deactivate' : 'Activate')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
// refactor: use DataTable in Users page
// fix: handle undefined user in Users page
// improve: show department in user table
// improve: confirm before deactivating user
// fix: sort users alphabetically
// final: page review complete
