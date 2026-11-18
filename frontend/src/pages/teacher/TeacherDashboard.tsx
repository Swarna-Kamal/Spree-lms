import { AppShell } from '../../components/layout/AppShell';
import { StatCard } from '../../components/ui/StatCard';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../stores/authStore';
import {
  BookOpen,
  ClipboardList,
  Users,
  Clock,
  ArrowRight,
  FileText,
  Plus,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

// Mock data for phase 1
const mockCourses = [
  { id: 1, title: 'Introduction to Mathematics', students: 42, lessons: 18, lastUpdated: '2 days ago' },
  { id: 2, title: 'Advanced Calculus', students: 24, lessons: 12, lastUpdated: '1 week ago' },
  { id: 3, title: 'Statistics 101', students: 36, lessons: 15, lastUpdated: '3 days ago' },
];

const mockSubmissions = [
  { id: 1, student: 'Alice Johnson', assignment: 'Math Problem Set 3', submittedAt: '2 hours ago', status: 'SUBMITTED' as const },
  { id: 2, student: 'Bob Smith', assignment: 'Calculus Homework 7', submittedAt: '5 hours ago', status: 'GRADED' as const },
  { id: 3, student: 'Clara Davis', assignment: 'Statistics Quiz 2', submittedAt: '1 day ago', status: 'SUBMITTED' as const },
  { id: 4, student: 'David Lee', assignment: 'Math Problem Set 3', submittedAt: '1 day ago', status: 'GRADED' as const },
];

export const TeacherDashboard = () => {
  const { user } = useAuthStore();

  return (
    <AppShell title="Dashboard">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#1e3a5f]">
              Good day, {user?.firstName}! 👋
            </h2>
            <p className="text-gray-500 mt-1">
              You have {mockSubmissions.filter(s => s.status === 'SUBMITTED').length} submissions awaiting review.
            </p>
          </div>
          <Button variant="primary" size="md" className="hidden sm:flex">
            <Plus className="w-4 h-4" />
            New Course
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            label="My Courses"
            value={mockCourses.length}
            icon={<BookOpen className="w-6 h-6 text-blue-600" />}
            iconBg="bg-blue-100"
          />
          <StatCard
            label="Total Students"
            value="102"
            icon={<Users className="w-6 h-6 text-purple-600" />}
            iconBg="bg-purple-100"
            trend={{ value: 5 }}
          />
          <StatCard
            label="Pending Submissions"
            value={mockSubmissions.filter(s => s.status === 'SUBMITTED').length}
            icon={<ClipboardList className="w-6 h-6 text-orange-600" />}
            iconBg="bg-orange-100"
          />
          <StatCard
            label="Avg. Completion"
            value="74%"
            icon={<CheckCircle2 className="w-6 h-6 text-green-600" />}
            iconBg="bg-green-100"
            trend={{ value: 3 }}
          />
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* My Courses */}
          <div className="xl:col-span-2 space-y-4">
            <Card
              title="My Courses"
              description="Manage your active courses"
              action={
                <Button variant="ghost" size="sm" className="text-blue-600">
                  View all <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              }
            >
              <div className="space-y-3 mt-2">
                {mockCourses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-blue-50/50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg flex-shrink-0">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors truncate">
                        {course.title}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" /> {course.students} students
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3" /> {course.lessons} lessons
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Updated {course.lastUpdated}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Submissions */}
            <Card
              title="Recent Submissions"
              description="Student submissions requiring attention"
              action={
                <Button variant="ghost" size="sm" className="text-blue-600">
                  View all <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              }
              noPadding
            >
              <div className="divide-y divide-gray-50">
                {mockSubmissions.map((sub) => (
                  <div key={sub.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-xs font-bold text-gray-600 flex-shrink-0">
                      {sub.student.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{sub.student}</p>
                      <p className="text-xs text-gray-400 truncate">{sub.assignment}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-gray-400">{sub.submittedAt}</span>
                      <Badge variant={sub.status === 'GRADED' ? 'success' : 'info'}>
                        {sub.status === 'GRADED' ? 'Graded' : 'Review'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <Card title="Quick Actions">
              <div className="space-y-2">
                {[
                  { icon: Plus, label: 'Add Lesson', color: 'text-blue-600 bg-blue-50' },
                  { icon: ClipboardList, label: 'Create Assignment', color: 'text-green-600 bg-green-50' },
                  { icon: AlertCircle, label: 'Post Announcement', color: 'text-orange-600 bg-orange-50' },
                ].map(({ icon: Icon, label, color }) => (
                  <button
                    key={label}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${color} flex-shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                    <ArrowRight className="w-4 h-4 text-gray-300 ml-auto" />
                  </button>
                ))}
              </div>
            </Card>

            <Card title="Upcoming Deadlines">
              <div className="space-y-3">
                {[
                  { title: 'Problem Set 4', course: 'Intro to Math', due: 'Tomorrow', urgent: true },
                  { title: 'Quiz 3', course: 'Statistics 101', due: 'In 3 days', urgent: false },
                  { title: 'Final Project', course: 'Calculus', due: 'In 1 week', urgent: false },
                ].map(({ title, course, due, urgent }) => (
                  <div key={title} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${urgent ? 'bg-red-400' : 'bg-blue-400'}`} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{title}</p>
                      <p className="text-xs text-gray-400">{course} · {due}</p>
                    </div>
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
