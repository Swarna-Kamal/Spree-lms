import { useEffect, useState, type FormEvent } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { announcementsApi, type AnnouncementRequest } from '../../api/announcements';
import { coursesApi } from '../../api/courses';
import type { Announcement, Course } from '../../types';
import { Megaphone, Plus, Trash2, RefreshCw, X, Globe, BookOpen } from 'lucide-react';

export const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formIsGlobal, setFormIsGlobal] = useState(true);
  const [formCourseId, setFormCourseId] = useState<number | ''>('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [annRes, courseRes] = await Promise.all([
        announcementsApi.getAll(),
        coursesApi.getAll(),
      ]);
      setAnnouncements(annRes.data.data || []);
      setCourses(courseRes.data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load announcements.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setFormTitle('');
    setFormContent('');
    setFormIsGlobal(true);
    setFormCourseId('');
    setIsModalOpen(true);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const payload: AnnouncementRequest = {
        title: formTitle.trim(),
        content: formContent.trim(),
        isGlobal: formIsGlobal,
        courseId: !formIsGlobal && formCourseId ? Number(formCourseId) : undefined,
      };

      await announcementsApi.create(payload);
      setSuccess('Announcement created successfully.');
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create announcement.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (ann: Announcement) => {
    if (!window.confirm(`Are you sure you want to delete announcement "${ann.title}"?`)) return;

    try {
      setError('');
      setSuccess('');
      await announcementsApi.delete(ann.id);
      setSuccess('Announcement deleted successfully.');
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete announcement.');
    }
  };

  return (
    <AppShell title="Announcements">
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#1e3a5f]">Announcements</h2>
            <p className="text-gray-500 mt-1">Broadcast institution-wide updates or course-specific notices.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={loadData} disabled={loading}>
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button variant="primary" onClick={openCreateModal}>
              <Plus className="w-4 h-4" />
              New Announcement
            </Button>
          </div>
        </div>

        {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>}
        {success && <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-600">{success}</div>}

        {/* Announcements List */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : announcements.length === 0 ? (
          <Card>
            <div className="py-16 text-center">
              <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="font-semibold text-gray-700">No announcements yet</p>
              <p className="text-sm text-gray-400 mt-1">Create an announcement to share news with students and teachers.</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {announcements.map((ann) => (
              <Card key={ann.id} className="relative flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      {ann.isGlobal ? (
                        <Badge variant="purple">
                          <span className="flex items-center gap-1">
                            <Globe className="w-3 h-3" /> Global
                          </span>
                        </Badge>
                      ) : (
                        <Badge variant="info">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" /> {ann.courseName || 'Course'}
                          </span>
                        </Badge>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(ann)}
                      className="text-gray-400 hover:text-red-600 p-1 rounded-md transition-colors"
                      title="Delete Announcement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2">{ann.title}</h3>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{ann.content}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                  <span>Posted by <strong className="text-gray-600">{ann.authorName}</strong></span>
                  <span>{new Date(ann.createdAt).toLocaleDateString()}</span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Create Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Post Announcement</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer mb-2">
                    <input
                      type="checkbox"
                      checked={formIsGlobal}
                      onChange={(e) => setFormIsGlobal(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Global Announcement (Visible to everyone)</span>
                  </label>
                </div>

                {!formIsGlobal && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Specific Course *</label>
                    <select
                      required={!formIsGlobal}
                      value={formCourseId}
                      onChange={(e) => setFormCourseId(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                    >
                      <option value="">Select Course</option>
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Content *</label>
                  <textarea
                    rows={4}
                    required
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" loading={saving}>
                    Post Announcement
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
