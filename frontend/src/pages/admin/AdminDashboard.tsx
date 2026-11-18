import { AppShell } from '../../components/layout/AppShell';
import { StatCard } from '../../components/ui/StatCard';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../stores/authStore';
import {
  Users,
  BookOpen,
  Building2,
  GraduationCap,
  Plus,
  UserPlus,
  FolderPlus,
  ArrowRight,
} from 'lucide-react';

// Mock data for phase 1 scaffold
const mockCourses = [
  { id: 1, title: 'Introduction to Mathematics', department: 'Science', teacher: 'Dr. Alice Johnson', students: 42, published: true },
  { id: 2, title: 'Advanced English Literature', department: 'Humanities', teacher: 'Prof. Bob Smith', students: 28, published: true },
  { id: 3, title: 'World History', department: 'Social Studies', teacher: 'Ms. Clara Davis', students: 35, published: false },
  { id: 4, title: 'Introduction to Programming', department: 'Computer Science', teacher: 'Mr. David Lee', students: 60, published: true },
  { id: 5, title: 'Biology 101', department: 'Science', teacher: 'Dr. Eve Martin', students: 50, published: true },
];

export const AdminDashboard = () => {
  const { user } = useAuthStore();

  return (
    <AppShell title="Dashboard">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#1e3a5f]">
              Welcome back, {user?.firstName}! 👋
            </h2>
            <p className="text-gray-500 mt-1">
              Here's what's happening on SPREE today.
            </p>
          </div>
          <Button variant="primary" size="md" className="hidden sm:flex">
            <Plus className="w-4 h-4" />
            Quick Add
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            label="Total Students"
            value="1,284"
            icon={<GraduationCap className="w-6 h-6 text-blue-600" />}
            iconBg="bg-blue-100"
            trend={{ value: 12, label: 'vs last month' }}
          />
          <StatCard
            label="Total Teachers"
            value="48"
            icon={<Users className="w-6 h-6 text-purple-600" />}
            iconBg="bg-purple-100"
            trend={{ value: 4, label: 'vs last month' }}
          />
          <StatCard
            label="Active Courses"
            value="96"
            icon={<BookOpen className="w-6 h-6 text-green-600" />}
            iconBg="bg-green-100"
            trend={{ value: 8, label: 'vs last month' }}
          />
          <StatCard
            label="Departments"
            value="12"
            icon={<Building2 className="w-6 h-6 text-orange-600" />}
            iconBg="bg-orange-100"
            trend={{ value: 0, label: 'vs last month' }}
          />
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Recent Courses table */}
          <div className="xl:col-span-2">
            <Card
              title="Recent Courses"
              description="Latest courses across all departments"
              action={
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                  View all <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              }
              noPadding
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                        Course
                      </th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 hidden md:table-cell">
                        Teacher
                      </th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 hidden sm:table-cell">
                        Students
                      </th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {mockCourses.map((course) => (
                      <tr key={course.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900 truncate max-w-[200px]">
                              {course.title}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">{course.department}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-600 hidden md:table-cell">
                          {course.teacher}
                        </td>
                        <td className="px-4 py-4 text-gray-600 hidden sm:table-cell">
                          <div className="flex items-center gap-1.5">
                            <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
                            {course.students}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <Badge variant={course.published ? 'success' : 'warning'}>
                            {course.published ? 'Published' : 'Draft'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <Card title="Quick Actions">
              <div className="space-y-3">
                {[
                  { icon: UserPlus, label: 'Add New User', desc: 'Create student or teacher account', color: 'text-blue-600 bg-blue-50' },
                  { icon: FolderPlus, label: 'Create Course', desc: 'Set up a new course', color: 'text-green-600 bg-green-50' },
                  { icon: Building2, label: 'Add Department', desc: 'Create a new department', color: 'text-purple-600 bg-purple-50' },
                  { icon: BookOpen, label: 'Manage Lessons', desc: 'Edit course content', color: 'text-orange-600 bg-orange-50' },
                ].map(({ icon: Icon, label, desc, color }) => (
                  <button
                    key={label}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left group"
                  >
                    <div className={`flex items-center justify-center w-9 h-9 rounded-lg ${color} flex-shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {label}
                      </p>
                      <p className="text-xs text-gray-400">{desc}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-blue-400 transition-colors" />
                  </button>
                ))}
              </div>
            </Card>

            {/* System summary */}
            <Card title="Platform Health" className="text-sm">
              <div className="space-y-3">
                {[
                  { label: 'Active Sessions', value: '234', color: 'bg-green-500' },
                  { label: 'Submissions Today', value: '89', color: 'bg-blue-500' },
                  { label: 'Pending Grades', value: '17', color: 'bg-yellow-500' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${color}`} />
                      <span className="text-gray-600">{label}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
};
