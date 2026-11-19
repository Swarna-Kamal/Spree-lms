import { useEffect, useState } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useAuthStore } from '../../stores/authStore';
import { dashboardApi } from '../../api/dashboard';
import type { AdminStats } from '../../types';
import {
  Users,
  BookOpen,
  Building2,
  GraduationCap,
  Plus,
  UserPlus,
  FolderPlus,
  ArrowRight,
  ClipboardList,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminDashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await dashboardApi.getAdminStats();
      setStats(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <AppShell title="Administrative Overview">
      <div className="w-full space-y-6">
        {/* Welcome header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Welcome back, {user?.firstName}! 👋
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Real-time administrative telemetry and system management.
            </p>
          </div>
          <Button variant="primary" size="md" onClick={() => navigate('/admin/courses')} className="font-semibold shadow-sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Manage Courses
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200/80 rounded-2xl text-xs font-semibold text-rose-700 animate-fade">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : stats ? (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <StatCard
                label="Total Students"
                value={stats.totalStudents}
                icon={<GraduationCap className="w-6 h-6 text-primary dark:text-blue-400" />}
                iconBg="bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-800"
              />
              <StatCard
                label="Faculty Members"
                value={stats.totalTeachers}
                icon={<Users className="w-6 h-6 text-accent dark:text-purple-400" />}
                iconBg="bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-800"
              />
              <StatCard
                label="Active Courses"
                value={stats.activeCourses}
                icon={<BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />}
                iconBg="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800"
              />
              <StatCard
                label="Departments"
                value={stats.totalDepartments}
                icon={<Building2 className="w-6 h-6 text-amber-600 dark:text-amber-400" />}
                iconBg="bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-800"
              />
            </div>

            {/* Main content */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Recent Courses table */}
              <div className="xl:col-span-2">
                <div className="card-astrowind dark:bg-slate-900/50 p-6">
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Courses</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Latest courses added to the curriculum</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary dark:text-blue-400 text-sm font-semibold"
                      onClick={() => navigate('/admin/courses')}
                    >
                      View all <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">
                          <th className="text-left font-bold px-4 py-3">Course</th>
                          <th className="text-left font-bold px-4 py-3 hidden md:table-cell">Teacher</th>
                          <th className="text-left font-bold px-4 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {stats.recentCourses && stats.recentCourses.length > 0 ? (
                          stats.recentCourses.map((course) => (
                            <tr key={course.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                              <td className="px-4 py-4">
                                <div>
                                  <p className="font-semibold text-slate-900 dark:text-white truncate max-w-[240px] text-sm">
                                    {course.title}
                                  </p>
                                  <p className="text-xs text-slate-400 mt-0.5">
                                    {course.departmentName || 'No department'}
                                  </p>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-slate-600 dark:text-slate-300 hidden md:table-cell font-medium text-sm">
                                {course.teacherName || 'Unassigned'}
                              </td>
                              <td className="px-4 py-4">
                                <Badge variant={course.isPublished ? 'success' : 'warning'}>
                                  {course.isPublished ? 'Published' : 'Draft'}
                                </Badge>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3} className="px-4 py-8 text-center text-slate-400 text-sm">
                              No courses created yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Quick Actions & Platform Overview */}
              <div className="space-y-4">
                <div className="card-astrowind dark:bg-slate-900/50 p-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    {[
                      { icon: UserPlus, label: 'Manage Users', desc: 'Add or update accounts', to: '/admin/users', color: 'text-primary bg-blue-50 dark:bg-blue-950/40' },
                      { icon: FolderPlus, label: 'Manage Courses', desc: 'Course assignments & syllabus', to: '/admin/courses', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' },
                      { icon: Building2, label: 'Departments', desc: 'Academic departments', to: '/admin/departments', color: 'text-accent bg-purple-50 dark:bg-purple-950/40' },
                      { icon: ClipboardList, label: 'Announcements', desc: 'Broadcast notices', to: '/admin/announcements', color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40' },
                    ].map(({ icon: Icon, label, desc, to, color }) => (
                      <button
                        key={label}
                        onClick={() => navigate(to)}
                        className="w-full flex items-center gap-3 p-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left group border border-transparent hover:border-slate-200/80 dark:hover:border-slate-700 cursor-pointer"
                      >
                        <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${color} flex-shrink-0`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                            {label}
                          </p>
                          <p className="text-xs text-slate-400 truncate">{desc}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 ml-auto group-hover:text-primary transition-colors flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="card-astrowind dark:bg-slate-900/50 p-6 text-sm">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Platform Health</h3>
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span className="text-slate-600 dark:text-slate-400 font-medium">Total Enrollments</span>
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">{stats.totalEnrollments}</span>
                    </div>
                    <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <span className="text-slate-600 dark:text-slate-400 font-medium">Pending Submissions</span>
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">{stats.pendingSubmissions}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                        <span className="text-slate-600 dark:text-slate-400 font-medium">Total Courses</span>
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">{stats.totalCourses}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </AppShell>
  );
};
