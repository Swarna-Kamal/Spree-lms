
import { useEffect, useState, type FormEvent } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  type Department,
} from '../../api/departments';
import {
  Building2,
  Plus,
  Pencil,
  Trash2,
  X,
  RefreshCw,
} from 'lucide-react';

export const DepartmentPage = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadDepartments = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getDepartments();
      setDepartments(response.data.data || []);
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Failed to load departments.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setDescription('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) {
      setError('Department name is required.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const data = {
        name: name.trim(),
        description: description.trim(),
      };

      if (editingId !== null) {
        await updateDepartment(editingId, data);
        setSuccess('Department updated successfully.');
      } else {
        await createDepartment(data);
        setSuccess('Department created successfully.');
      }

      resetForm();
      await loadDepartments();
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Unable to save department.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (department: Department) => {
    setEditingId(department.id);
    setName(department.name);
    setDescription(department.description || '');
    setError('');
    setSuccess('');
  };

  const handleDelete = async (department: Department) => {
    const confirmed = window.confirm(
      `Delete "${department.name}"? Existing courses will remain, but their department assignment will be cleared.`
    );

    if (!confirmed) return;

    try {
      setError('');
      setSuccess('');
      await deleteDepartment(department.id);
      setSuccess('Department deleted successfully.');

      if (editingId === department.id) {
        resetForm();
      }

      await loadDepartments();
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Unable to delete department.'
      );
    }
  };

  return (
    <AppShell title="Department Management">
      <div className="w-full space-y-6">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-[#1e3a5f]">
              Departments
            </h2>
            <p className="text-gray-500 mt-1">
              Create and manage academic departments.
            </p>
          </div>

          <Button
            variant="secondary"
            onClick={loadDepartments}
            disabled={loading}
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">

          {/* Form Column */}
          <div className="xl:col-span-4">
            <Card
              title={editingId !== null ? 'Edit Department' : 'Add Department'}
              description={
                editingId !== null
                  ? 'Update department information'
                  : 'Create a new academic department'
              }
            >
              <form onSubmit={handleSubmit} className="space-y-5">

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Department Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Computer Science & AI"
                    maxLength={255}
                    required
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe this department's domain, academic scope, or purpose..."
                    rows={5}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-base text-slate-900 dark:text-white placeholder:text-slate-400 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                  />
                </div>

                <div className="flex gap-3 pt-1">
                  <Button
                    type="submit"
                    loading={saving}
                    disabled={saving || !name.trim()}
                    className="flex-1"
                  >
                    {editingId !== null ? (
                      <>
                        <Pencil className="w-4 h-4 mr-1.5" />
                        Update Department
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-1.5" />
                        Create Department
                      </>
                    )}
                  </Button>

                  {editingId !== null && (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={resetForm}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </Card>
          </div>

          {/* Table Column */}
          <div className="xl:col-span-8">
            <Card
              title="All Departments"
              description={`${departments.length} department(s) registered in the curriculum`}
              noPadding
            >
              {loading ? (
                <div className="p-12 text-center text-slate-500 dark:text-slate-400 text-base">
                  Loading departments...
                </div>
              ) : departments.length === 0 ? (
                <div className="p-12 text-center">
                  <Building2 className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="font-semibold text-lg text-slate-700 dark:text-slate-200">
                    No departments yet
                  </p>
                  <p className="text-base text-slate-400 mt-1">
                    Create your first department using the form on the left.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
                        <th className="px-6 py-4 text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                          Department
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider hidden sm:table-cell">
                          Created Date
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {departments.map((department) => (
                        <tr
                          key={department.id}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 border border-blue-100 dark:border-blue-800/50">
                                <Building2 className="w-5 h-5" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-base text-slate-900 dark:text-white">
                                  {department.name}
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 break-words">
                                  {department.description || 'No description provided'}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 hidden sm:table-cell whitespace-nowrap">
                            {department.createdAt
                              ? new Date(department.createdAt).toLocaleDateString(undefined, {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })
                              : '—'}
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex justify-end items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleEdit(department)}
                                title="Edit department"
                                className="p-2.5 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/40 transition-colors"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDelete(department)}
                                title="Delete department"
                                className="p-2.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/40 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
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
          </div>

        </div>
      </div>
    </AppShell>
  );
};
