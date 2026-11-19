import { useEffect, useState, type FormEvent } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { usersApi, type UserCreateRequest, type UserUpdateRequest } from '../../api/users';
import type { User } from '../../types';
import { Users, Plus, Pencil, Search, RefreshCw, UserCheck, UserX, X } from 'lucide-react';

export const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formFirstName, setFormFirstName] = useState('');
  const [formLastName, setFormLastName] = useState('');
  const [formRole, setFormRole] = useState<'ADMIN' | 'TEACHER' | 'STUDENT'>('STUDENT');

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      let res;
      if (searchQuery.trim()) {
        res = await usersApi.search(searchQuery.trim());
      } else if (roleFilter !== 'ALL') {
        res = await usersApi.getByRole(roleFilter);
      } else {
        res = await usersApi.getAll();
      }
      setUsers(res.data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [roleFilter]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    loadUsers();
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setFormEmail('');
    setFormPassword('');
    setFormFirstName('');
    setFormLastName('');
    setFormRole('STUDENT');
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormEmail(user.email);
    setFormFirstName(user.firstName);
    setFormLastName(user.lastName);
    setFormRole(user.role);
    setFormPassword('');
    setIsModalOpen(true);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      if (editingUser) {
        const updateData: UserUpdateRequest = {
          email: formEmail,
          firstName: formFirstName,
          lastName: formLastName,
          roleName: formRole,
        };
        await usersApi.update(editingUser.id, updateData);
        setSuccess('User updated successfully.');
      } else {
        const createData: UserCreateRequest = {
          email: formEmail,
          password: formPassword,
          firstName: formFirstName,
          lastName: formLastName,
          roleName: formRole,
        };
        await usersApi.create(createData);
        setSuccess('User created successfully.');
      }

      setIsModalOpen(false);
      loadUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save user.');
    } finally {
      setSaving(false);
    }
  };

  const toggleUserStatus = async (user: User) => {
    const action = user.isActive ? 'deactivate' : 'activate';
    if (!window.confirm(`Are you sure you want to ${action} ${user.firstName} ${user.lastName}?`)) return;

    try {
      setError('');
      setSuccess('');
      await usersApi.toggleActive(user.id, !user.isActive);
      setSuccess(`User ${action}d successfully.`);
      loadUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || `Failed to ${action} user.`);
    }
  };

  return (
    <AppShell title="User Management">
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#1e3a5f]">Users</h2>
            <p className="text-gray-500 mt-1">Manage accounts, assign roles, and access control.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={loadUsers} disabled={loading}>
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button variant="primary" onClick={openCreateModal}>
              <Plus className="w-4 h-4" />
              Add User
            </Button>
          </div>
        </div>

        {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>}
        {success && <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-600">{success}</div>}

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-96">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <Button type="submit" variant="secondary" size="md">
              <Search className="w-4 h-4" />
            </Button>
          </form>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {['ALL', 'ADMIN', 'TEACHER', 'STUDENT'].map((role) => (
              <button
                key={role}
                onClick={() => {
                  setRoleFilter(role);
                  setSearchQuery('');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  roleFilter === role ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <Card noPadding>
          {loading ? (
            <div className="py-20 flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : users.length === 0 ? (
            <div className="py-16 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="font-semibold text-gray-700">No users found</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Role</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Created</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-xs">
                            {u.firstName?.[0] || '?'}{u.lastName?.[0] || '?'}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{u.firstName} {u.lastName}</p>
                            <p className="text-xs text-gray-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant={u.role === 'ADMIN' ? 'purple' : u.role === 'TEACHER' ? 'info' : 'default'}>
                          {u.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant={u.isActive ? 'success' : 'danger'}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-xs text-gray-400 hidden sm:table-cell">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(u)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Edit User"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleUserStatus(u)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              u.isActive ? 'text-gray-500 hover:text-red-600 hover:bg-red-50' : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
                            }`}
                            title={u.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {u.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Create/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-900">{editingUser ? 'Edit User' : 'Add New User'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">First Name *</label>
                    <input
                      type="text"
                      required
                      value={formFirstName}
                      onChange={(e) => setFormFirstName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={formLastName}
                      onChange={(e) => setFormLastName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {!editingUser && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Password *</label>
                    <input
                      type="password"
                      required
                      value={formPassword}
                      onChange={(e) => setFormPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Role *</label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  >
                    <option value="STUDENT">Student</option>
                    <option value="TEACHER">Teacher</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" loading={saving}>
                    {editingUser ? 'Save Changes' : 'Create User'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
};
