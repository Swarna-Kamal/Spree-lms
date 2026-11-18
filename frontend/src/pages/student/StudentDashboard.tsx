import { AppShell } from '../../components/layout/AppShell';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../stores/authStore';
import {
  BookOpen,
  ClipboardList,
  ArrowRight,
  Clock,
  Megaphone,
  CheckCircle2,
  TrendingUp,
  Star,
} from 'lucide-react';

// Mock data
const mockEnrolledCourses = [
  { id: 1, title: 'Introduction to Mathematics', teacher: 'Dr. Alice Johnson', progress: 72, totalLessons: 18, completedLessons: 13 },
  { id: 2, title: 'World History', teacher: 'Ms. Clara Davis', progress: 45, totalLessons: 20, completedLessons: 9 },
  { id: 3, title: 'Introduction to Programming', teacher: 'Mr. David Lee', progress: 90, totalLessons: 15, completedLessons: 14 },
];

const mockAssignments = [
  { id: 1, title: 'Problem Set 3', course: 'Intro to Mathematics', dueDate: 'Tomorrow', status: 'pending' },
  { id: 2, title: 'History Essay', course: 'World History', dueDate: 'In 3 days', status: 'submitted' },
  { id: 3, title: 'Python Lab 2', course: 'Intro to Programming', dueDate: 'In 1 week', status: 'graded', grade: 92 },
  { id: 4, title: 'Problem Set 4', course: 'Intro to Mathematics', dueDate: 'In 2 weeks', status: 'pending' },
];

const mockAnnouncements = [
  { id: 1, title: 'Mid-term Exam Schedule Released', author: 'Admin', time: '2 hours ago', global: true },
  { id: 2, title: 'Office Hours Changed This Week', author: 'Dr. Alice Johnson', time: '1 day ago', global: false },
  { id: 3, title: 'New Learning Resources Added', author: 'Mr. David Lee', time: '3 days ago', global: false },
];

export const StudentDashboard = () => {
  const { user } = useAuthStore();

  const overallProgress = Math.round(
    mockEnrolledCourses.reduce((acc, c) => acc + c.progress, 0) / mockEnrolledCourses.length
  );

  return (
    <AppShell title="Dashboard">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-[#1e3a5f] to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                Welcome back, {user?.firstName}! 🎓
              </h2>
              <p className="text-blue-100 mt-1">
                You're making great progress. Keep it up!
              </p>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-blue-200 text-sm">Overall Progress</p>
              <p className="text-4xl font-bold">{overallProgress}%</p>
            </div>
          </div>
          <div className="mt-4 bg-white/20 rounded-full h-2">
            <div
              className="bg-white rounded-full h-2 transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <p className="text-blue-200 text-xs mt-1">
            {mockEnrolledCourses.length} courses enrolled
          </p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Courses', value: mockEnrolledCourses.length, icon: BookOpen, color: 'text-blue-600 bg-blue-100' },
            { label: 'Assignments Due', value: mockAssignments.filter(a => a.status === 'pending').length, icon: ClipboardList, color: 'text-orange-600 bg-orange-100' },
            { label: 'Avg. Grade', value: '87%', icon: Star, color: 'text-yellow-600 bg-yellow-100' },
            { label: 'Streak (days)', value: '7', icon: TrendingUp, color: 'text-green-600 bg-green-100' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ${color} mb-3`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Enrolled courses */}
          <div className="xl:col-span-2 space-y-4">
            <Card
              title="My Courses"
              description="Your enrolled courses and progress"
              action={
                <Button variant="ghost" size="sm" className="text-blue-600">
                  Browse all <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              }
            >
              <div className="space-y-4 mt-2">
                {mockEnrolledCourses.map((course) => (
                  <div
                    key={course.id}
                    className="p-4 bg-gray-50 rounded-xl hover:bg-blue-50/50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0 mr-3">
                        <p className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors truncate">
                          {course.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{course.teacher}</p>
                      </div>
                      <Badge variant={course.progress >= 80 ? 'success' : course.progress >= 50 ? 'info' : 'warning'}>
                        {course.progress}%
                      </Badge>
                    </div>
                    <div className="bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`rounded-full h-1.5 transition-all duration-500 ${
                          course.progress >= 80 ? 'bg-green-500' : course.progress >= 50 ? 'bg-blue-500' : 'bg-orange-400'
                        }`}
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      {course.completedLessons} of {course.totalLessons} lessons completed
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Assignments */}
            <Card
              title="Upcoming Assignments"
              action={
                <Button variant="ghost" size="sm" className="text-blue-600">
                  View all <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              }
              noPadding
            >
              <div className="divide-y divide-gray-50">
                {mockAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className={`flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 ${
                      assignment.status === 'graded' ? 'bg-green-100' :
                      assignment.status === 'submitted' ? 'bg-blue-100' : 'bg-orange-100'
                    }`}>
                      <ClipboardList className={`w-4 h-4 ${
                        assignment.status === 'graded' ? 'text-green-600' :
                        assignment.status === 'submitted' ? 'text-blue-600' : 'text-orange-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{assignment.title}</p>
                      <p className="text-xs text-gray-400">{assignment.course}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {assignment.status === 'graded' && (
                        <span className="text-sm font-bold text-green-600">{assignment.grade}%</span>
                      )}
                      {assignment.status !== 'graded' && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {assignment.dueDate}
                        </span>
                      )}
                      <Badge
                        variant={
                          assignment.status === 'graded' ? 'success' :
                          assignment.status === 'submitted' ? 'info' : 'warning'
                        }
                      >
                        {assignment.status === 'graded' ? 'Graded' :
                         assignment.status === 'submitted' ? 'Submitted' : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            {/* Announcements */}
            <Card title="Announcements">
              <div className="space-y-4 mt-1">
                {mockAnnouncements.map((ann) => (
                  <div key={ann.id} className="flex gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg flex-shrink-0 mt-0.5">
                      <Megaphone className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 leading-snug">
                        {ann.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {ann.author} · {ann.time}
                      </p>
                      {ann.global && (
                        <Badge variant="purple" className="mt-1">Global</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Completed summary */}
            <Card title="This Week">
              <div className="space-y-3">
                {[
                  { label: 'Lessons Completed', value: '8', icon: CheckCircle2, color: 'text-green-500' },
                  { label: 'Assignments Done', value: '3', icon: ClipboardList, color: 'text-blue-500' },
                  { label: 'Hours Studied', value: '12h', icon: Clock, color: 'text-purple-500' },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${color}`} />
                      <span className="text-sm text-gray-600">{label}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{value}</span>
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
