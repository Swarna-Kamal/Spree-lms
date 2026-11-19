import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Sun,
  Moon,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Menu,
  X,
  BookOpen,
  Users,
  Building2,
  Megaphone,
  LayoutDashboard,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { Button } from '../ui/Button';

interface NavItem {
  label: string;
  to: string;
  icon?: React.ReactNode;
}

export const TopNavbar = () => {
  const { user, role, token, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  // Sync dark class on mount
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user
    ? `${user.firstName?.[0] || '?'}${user.lastName?.[0] || '?'}`.toUpperCase()
    : '??';

  // Role-specific primary and more links
  const getNavLinks = (): { primary: NavItem[]; more: NavItem[] } => {
    if (!token) {
      return {
        primary: [
          { label: 'Home', to: '/' },
          { label: 'Explore Courses', to: '/explore' },
        ],
        more: [],
      };
    }

    if (role === 'ADMIN') {
      return {
        primary: [
          { label: 'Home', to: '/' },
          { label: 'Dashboard', to: '/admin', icon: <LayoutDashboard className="w-4 h-4 mr-1.5" /> },
          { label: 'Courses', to: '/admin/courses', icon: <BookOpen className="w-4 h-4 mr-1.5" /> },
          { label: 'Users', to: '/admin/users', icon: <Users className="w-4 h-4 mr-1.5" /> },
          { label: 'Departments', to: '/admin/departments', icon: <Building2 className="w-4 h-4 mr-1.5" /> },
        ],
        more: [
          { label: 'Announcements', to: '/admin/announcements', icon: <Megaphone className="w-4 h-4 mr-2" /> },
        ],
      };
    }

    if (role === 'TEACHER') {
      return {
        primary: [
          { label: 'Home', to: '/' },
          { label: 'Dashboard', to: '/teacher', icon: <LayoutDashboard className="w-4 h-4 mr-1.5" /> },
          { label: 'Explore Catalog', to: '/explore', icon: <BookOpen className="w-4 h-4 mr-1.5" /> },
        ],
        more: [],
      };
    }

    // STUDENT
    return {
      primary: [
        { label: 'Home', to: '/' },
        { label: 'Dashboard', to: '/student', icon: <LayoutDashboard className="w-4 h-4 mr-1.5" /> },
        { label: 'Explore Catalog', to: '/explore', icon: <BookOpen className="w-4 h-4 mr-1.5" /> },
      ],
      more: [],
    };
  };

  const navLinks = getNavLinks();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-[#030620]/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 transition-colors shadow-[0_1px_4px_0_rgba(0,0,0,0.03)]">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14">
        {/* 3-Column True Center Layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 items-center h-16">
          {/* Left Column: Logo & Brand */}
          <div className="flex items-center justify-start">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-primary hover:bg-secondary flex items-center justify-center text-white shadow-md shadow-blue-500/20 transition-all duration-200 group-hover:scale-105">
                <GraduationCap className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
                  SPREE
                </span>
                <span className="text-[10px] font-semibold text-primary dark:text-blue-400 tracking-wider uppercase mt-0.5">
                  LMS Academy
                </span>
              </div>
            </Link>
          </div>

          {/* Center Column: Navigation Links Truly Centered */}
          <nav className="hidden md:flex items-center justify-center space-x-1 lg:space-x-1.5">
            {navLinks.primary.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/' || item.to === '/admin' || item.to === '/teacher' || item.to === '/student'}
                className={({ isActive }) =>
                  `inline-flex items-center px-3.5 py-2 rounded-xl text-sm font-bold transition-all duration-150 ${
                    isActive
                      ? 'text-primary dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 shadow-xs border border-blue-200/70 dark:border-blue-800'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}

            {/* More Dropdown */}
            {navLinks.more.length > 0 && (
              <div className="relative" ref={moreRef}>
                <button
                  type="button"
                  onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                  className="inline-flex items-center px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-all cursor-pointer"
                >
                  More
                  <ChevronDown className="w-3.5 h-3.5 ml-1 opacity-70" />
                </button>

                {moreDropdownOpen && (
                  <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-52 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-fade">
                    {navLinks.more.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setMoreDropdownOpen(false)}
                        className="flex items-center px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Right Column: Theme Toggle & Profile Area */}
          <div className="flex items-center justify-end gap-2.5">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 stroke-[2.2]" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600 stroke-[2.2]" />
              )}
            </button>

            {/* Authenticated User Menu */}
            {token && user ? (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center text-white text-xs font-bold shadow-xs">
                    {initials}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-bold text-slate-900 dark:text-white leading-none">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-semibold uppercase tracking-wider">
                      {role}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-fade">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <GraduationCap className="w-3.5 h-3.5 mr-2 text-slate-400" />
                        Public Home
                      </Link>
                      <Link
                        to={role === 'ADMIN' ? '/admin' : role === 'TEACHER' ? '/teacher' : '/student'}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <UserIcon className="w-3.5 h-3.5 mr-2 text-slate-400" />
                        My Workspace
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-xs font-semibold">
                    Sign in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm" className="text-xs font-semibold shadow-xs">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#030620]/95 backdrop-blur-md px-4 pt-3 pb-5 space-y-1.5 animate-fade">
          {navLinks.primary.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}

          {navLinks.more.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}

          {!token && (
            <div className="pt-3 grid grid-cols-2 gap-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="secondary" size="sm" className="w-full text-xs">
                  Sign in
                </Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" size="sm" className="w-full text-xs">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
