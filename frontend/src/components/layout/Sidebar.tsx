import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Building2,
  ClipboardList,
  FileQuestion,
  Megaphone,
  TrendingUp,
  LogOut,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
}

const adminNav: NavItem[] = [
  { label: 'Dashboard', to: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Users', to: '/admin/users', icon: <Users className="w-5 h-5" /> },
  { label: 'Departments', to: '/admin/departments', icon: <Building2 className="w-5 h-5" /> },
  { label: 'Courses', to: '/admin/courses', icon: <BookOpen className="w-5 h-5" /> },
];

const teacherNav: NavItem[] = [
  { label: 'Dashboard', to: '/teacher', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'My Courses', to: '/teacher/courses', icon: <BookOpen className="w-5 h-5" /> },
  { label: 'Assignments', to: '/teacher/assignments', icon: <ClipboardList className="w-5 h-5" /> },
  { label: 'Quizzes', to: '/teacher/quizzes', icon: <FileQuestion className="w-5 h-5" /> },
  { label: 'Announcements', to: '/teacher/announcements', icon: <Megaphone className="w-5 h-5" /> },
];

const studentNav: NavItem[] = [
  { label: 'Dashboard', to: '/student', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'My Courses', to: '/student/courses', icon: <BookOpen className="w-5 h-5" /> },
  { label: 'Assignments', to: '/student/assignments', icon: <ClipboardList className="w-5 h-5" /> },
  { label: 'Quizzes', to: '/student/quizzes', icon: <FileQuestion className="w-5 h-5" /> },
  { label: 'Progress', to: '/student/progress', icon: <TrendingUp className="w-5 h-5" /> },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { role, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const navItems =
    role === 'ADMIN' ? adminNav : role === 'TEACHER' ? teacherNav : studentNav;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : '??';

  return (
    <aside
      className={clsx(
        'relative flex flex-col h-screen bg-[#1e3a5f] text-white transition-all duration-300 flex-shrink-0',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="flex items-center justify-center w-9 h-9 bg-blue-500 rounded-lg flex-shrink-0">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div>
            <span className="text-lg font-bold tracking-wide">SPREE</span>
            <p className="text-xs text-blue-300 leading-none mt-0.5">LMS Platform</p>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-7 w-6 h-6 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors z-10"
      >
        {collapsed ? (
          <ChevronRight className="w-3.5 h-3.5" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5" />
        )}
      </button>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {!collapsed && (
          <p className="px-4 mb-2 text-xs font-semibold text-blue-300/70 uppercase tracking-wider">
            {role === 'ADMIN' ? 'Administration' : role === 'TEACHER' ? 'Teaching' : 'Learning'}
          </p>
        )}
        <ul className="space-y-0.5 px-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/admin' || item.to === '/teacher' || item.to === '/student'}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'bg-blue-500/30 text-white'
                      : 'text-blue-100/70 hover:bg-white/10 hover:text-white'
                  )
                }
                title={collapsed ? item.label : undefined}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User + Logout */}
      <div className="border-t border-white/10 p-3">
        <div
          className={clsx(
            'flex items-center gap-3 px-2 py-2 rounded-lg',
            collapsed && 'justify-center'
          )}
        >
          <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-blue-300/70 truncate">{user?.email}</p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={handleLogout}
              className="ml-auto p-1.5 rounded-lg text-blue-200/70 hover:text-white hover:bg-white/10 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
        {collapsed && (
          <button
            onClick={handleLogout}
            className="mt-1 w-full flex items-center justify-center p-2 rounded-lg text-blue-200/70 hover:text-white hover:bg-white/10 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
};
