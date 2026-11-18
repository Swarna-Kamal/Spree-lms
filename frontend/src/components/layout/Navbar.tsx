import { Bell, Search } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

interface NavbarProps {
  title?: string;
}

export const Navbar = ({ title }: NavbarProps) => {
  const { user, role } = useAuthStore();

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : '??';

  const roleLabel =
    role === 'ADMIN' ? 'Administrator' : role === 'TEACHER' ? 'Teacher' : 'Student';

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between flex-shrink-0">
      {/* Left: Page title */}
      <div>
        {title && (
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        )}
      </div>

      {/* Right: search, bell, user */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <Search className="w-5 h-5" />
        </button>

        {/* Notification bell */}
        <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
        </button>

        {/* User pill */}
        <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900 leading-none">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{roleLabel}</p>
          </div>
          <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full text-xs font-bold text-white flex-shrink-0">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
};
