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
    role === 'ADMIN' ? 'Administrator' : role === 'TEACHER' ? 'Faculty Member' : 'Student';

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 flex items-center justify-between flex-shrink-0 sticky top-0 z-10 transition-all">
      {/* Left: Page title */}
      <div>
        {title && (
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h1>
        )}
      </div>

      {/* Right: search, bell, user */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 rounded-xl transition-all cursor-pointer">
          <Search className="w-4 h-4" />
        </button>

        {/* Notification bell */}
        <button className="relative p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 rounded-xl transition-all cursor-pointer">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-white" />
        </button>

        {/* User pill */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 leading-none">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-slate-500 mt-1 font-medium">{roleLabel}</p>
          </div>
          <div className="flex items-center justify-center w-9 h-9 bg-gradient-to-tr from-primary to-blue-500 rounded-full text-xs font-bold text-white shadow-sm ring-2 ring-primary/20 flex-shrink-0">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
};
