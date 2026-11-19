import type { ReactNode } from 'react';
import { TopNavbar } from './TopNavbar';
import { Footer } from './Footer';

interface AppShellProps {
  children: ReactNode;
  title?: string;
  showFooter?: boolean;
}

export const AppShell = ({ children, title, showFooter = true }: AppShellProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70 dark:bg-[#030620] text-slate-900 dark:text-slate-100 antialiased transition-colors duration-200">
      <TopNavbar />
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-10 xl:px-14 py-8">
        {title && (
          <div className="mb-6 pb-4 border-b border-slate-200/90 dark:border-slate-800">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {title}
            </h1>
          </div>
        )}
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};
