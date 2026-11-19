import { useEffect, useState, type FormEvent } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { coursesApi, type CourseRequest } from '../../api/courses';
import { getDepartments, type Department } from '../../api/departments';
import { usersApi } from '../../api/users';
import { enrollmentsApi } from '../../api/enrollments';
import type { Course, User, Enrollment } from '../../types';
import { BookOpen, Plus, Pencil, Trash2, Eye, EyeOff, RefreshCw, X, UserPlus } from 'lucide-react';

export const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [allStudents, setAllStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Course Roster & Student Enrollment Modal
  const [selectedRosterCourse, setSelectedRosterCourse] = useState<Course | null>(null);
  const [courseEnrollments, setCourseEnrollments] = useState<Enrollment[]>([]);
  const [studentToEnrollId, setStudentToEnrollId] = useState<number | ''>('');
  const [loadingRoster, setLoadingRoster] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDepartmentId, setFormDepartmentId] = useState<number | ''>('');
  const [formTeacherId, setFormTeacherId] = useState<number | ''>('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [coursesRes, deptRes, teachersRes, studentsRes] = await Promise.all([
        coursesApi.getAll(),
        getDepartments(),
        usersApi.getByRole('TEACHER'),
        usersApi.getByRole('STUDENT'),
      ]);
      setCourses(coursesRes.data.data || []);
      setDepartments(deptRes.data.data || []);
      setTeachers(teachersRes.data.data || []);
      setAllStudents(studentsRes.data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load courses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingCourse(null);
    setFormTitle('');
    setFormDescription('');
    setFormDepartmentId(departments[0]?.id || '');
    setFormTeacherId(teachers[0]?.id || '');
    setIsModalOpen(true);
  };

  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    setFormTitle(course.title);
    setFormDescription(course.description || '');
    setFormDepartmentId(course.departmentId || '');
    setFormTeacherId(course.teacherId || '');
    setIsModalOpen(true);
  };

  const openRosterModal = async (course: Course) => {
    setSelectedRosterCourse(course);
    setLoadingRoster(true);
    try {
      const enrRes = await enrollmentsApi.getCourseEnrollments(course.id);
      setCourseEnrollments(enrRes.data.data || []);
      setStudentToEnrollId('');
    } catch (err: any) {
      setError('Failed to load course enrollments.');
    } finally {
      setLoadingRoster(false);
    }
  };

  const handleEnrollStudent = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedRosterCourse || !studentToEnrollId) return;

    try {
      setError('');
      setSuccess('');
      await enrollmentsApi.manualEnroll(selectedRosterCourse.id, Number(studentToEnrollId));
      setSuccess('Student enrolled successfully!');
      const enrRes = await enrollmentsApi.getCourseEnrollments(selectedRosterCourse.id);
      setCourseEnrollments(enrRes.data.data || []);
      setStudentToEnrollId('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to enroll student.');
    }
  };

  const handleUnenrollStudent = async (studentId: number) => {
    if (!selectedRosterCourse) return;
    if (!window.confirm('Are you sure you want to remove this student from the course?')) return;

    try {
      setError('');
      setSuccess('');
      await enrollmentsApi.manualUnenroll(selectedRosterCourse.id, studentId);
      setSuccess('Student removed from course.');
      const enrRes = await enrollmentsApi.getCourseEnrollments(selectedRosterCourse.id);
      setCourseEnrollments(enrRes.data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove student.');
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!formDepartmentId) {
      setError('Please select a department.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const payload: CourseRequest = {
        title: formTitle.trim(),
        description: formDescription.trim(),
        departmentId: Number(formDepartmentId),
        teacherId: formTeacherId ? Number(formTeacherId) : undefined,
      };

      if (editingCourse) {
        await coursesApi.update(editingCourse.id, payload);
        setSuccess('Course updated successfully.');
      } else {
        await coursesApi.create(payload);
        setSuccess('Course created successfully.');
      }

      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save course.');
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (course: Course) => {
    try {
      setError('');
      setSuccess('');
      await coursesApi.publish(course.id, !course.isPublished);
      setSuccess(`Course ${!course.isPublished ? 'published' : 'unpublished'} successfully.`);
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to toggle publication status.');
    }
  };

  const handleDelete = async (course: Course) => {
    if (!window.confirm(`Are you sure you want to delete course "${course.title}"?`)) return;

    try {
      setError('');
      setSuccess('');
      await coursesApi.delete(course.id);
      setSuccess('Course deleted successfully.');
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete course.');
    }
  };

  const alreadyEnrolledStudentIds = new Set(courseEnrollments.map((e) => e.studentId));
  const availableStudentsToEnroll = allStudents.filter((s) => !alreadyEnrolledStudentIds.has(s.id));

  return (
    <AppShell title="Course Management">
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#1e3a5f]">Courses</h2>
            <p className="text-gray-500 mt-1">Manage curriculum, teacher assignments, student rosters, and publication.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={loadData} disabled={loading}>
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button variant="primary" onClick={openCreateModal}>
              <Plus className="w-4 h-4" />
              Create Course
            </Button>
          </div>
        </div>

        {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>}
        {success && <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-600">{success}</div>}

        {/* Courses Table */}
        <Card noPadding>
          {loading ? (
            <div className="py-20 flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : courses.length === 0 ? (
            <div className="py-16 text-center">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="font-semibold text-gray-700">No courses yet</p>
              <p className="text-sm text-gray-400 mt-1">Click "Create Course" to add the first one.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Course</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Department</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Teacher</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {courses.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{c.title}</p>
                          <p className="text-xs text-gray-400 truncate max-w-xs">{c.description || 'No description'}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-600">
                        {c.departmentName || '—'}
                      </td>
                      <td className="px-4 py-4 text-gray-600">
                        {c.teacherName || <span className="text-gray-400 italic">Unassigned</span>}
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant={c.isPublished ? 'success' : 'warning'}>
                          {c.isPublished ? 'Published' : 'Draft'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => openRosterModal(c)}
                            title="Manage Course Students"
                          >
                            <UserPlus className="w-3.5 h-3.5 text-blue-600" /> Students
                          </Button>
                          <button
                            onClick={() => togglePublish(c)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title={c.isPublished ? 'Unpublish' : 'Publish'}
                          >
                            {c.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => openEditModal(c)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Edit Course"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(c)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete Course"
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

        {/* Manage Students / Course Roster Modal for Admin */}
        {selectedRosterCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">Manage Course Roster: {selectedRosterCourse.title}</h3>
                  <p className="text-xs text-gray-400">Admin management of student enrollments</p>
                </div>
                <button onClick={() => setSelectedRosterCourse(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6">
                {/* Enroll New Student Form */}
                <form onSubmit={handleEnrollStudent} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Enroll Student</h4>
                  <div className="flex gap-2">
                    <select
                      required
                      value={studentToEnrollId}
                      onChange={(e) => setStudentToEnrollId(e.target.value ? Number(e.target.value) : '')}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                    >
                      <option value="">Select Student...</option>
                      {availableStudentsToEnroll.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.firstName} {s.lastName} ({s.email})
                        </option>
                      ))}
                    </select>
                    <Button type="submit" variant="primary" size="md" disabled={!studentToEnrollId}>
                      <UserPlus className="w-4 h-4" /> Enroll
                    </Button>
                  </div>
                </form>

                {/* Enrolled Students Table */}
                <div>
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Enrolled Students ({courseEnrollments.length})
                  </h4>
                  {loadingRoster ? (
                    <div className="py-8 flex justify-center">
                      <LoadingSpinner />
                    </div>
                  ) : courseEnrollments.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">No students are currently enrolled in this course.</p>
                  ) : (
                    <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
                      {courseEnrollments.map((enr) => (
                        <div key={enr.id} className="p-3 flex items-center justify-between hover:bg-gray-50 text-sm">
                          <div>
                            <p className="font-medium text-gray-900">{enr.studentName}</p>
                            <p className="text-xs text-gray-400">{enr.studentEmail}</p>
                          </div>
                          <button
                            onClick={() => handleUnenrollStudent(enr.studentId)}
                            className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                            title="Remove student from course"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-900">{editingCourse ? 'Edit Course' : 'Create Course'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Course Title *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Department *</label>
                  <select
                    required
                    value={formDepartmentId}
                    onChange={(e) => setFormDepartmentId(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  >
                    <option value="">Select Department</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Assigned Teacher</label>
                  <select
                    value={formTeacherId}
                    onChange={(e) => setFormTeacherId(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  >
                    <option value="">Select Teacher (Optional)</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>{t.firstName} {t.lastName} ({t.email})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" loading={saving}>
                    {editingCourse ? 'Save Changes' : 'Create Course'}
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
