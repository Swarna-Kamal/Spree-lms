import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, Filter, User } from 'lucide-react';
import { TopNavbar } from '../../components/layout/TopNavbar';
import { Footer } from '../../components/layout/Footer';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { publicApi } from '../../api/public';
import type { Course, Department } from '../../types';

export const ExploreCoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        const [courseRes, deptRes] = await Promise.all([
          publicApi.getCourses().catch(() => null),
          publicApi.getDepartments().catch(() => null),
        ]);
        if (courseRes?.data?.data) setCourses(courseRes.data.data);
        if (deptRes?.data?.data) setDepartments(deptRes.data.data);
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(search.toLowerCase()));
    const matchesDept =
      selectedDept === 'ALL' || c.departmentName === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60 dark:bg-[#030620] text-slate-900 dark:text-slate-100 antialiased transition-colors duration-200">
      <TopNavbar />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-10 xl:px-14 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-primary dark:text-blue-400">
            Academy Catalog
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
            Explore Academic Courses
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse published courses, academic departments, and faculty curriculum tracks.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="card-astrowind dark:bg-slate-900/50 p-4 mb-8 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search courses by keyword, topic, or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary/20 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 focus:border-primary"
            >
              <option value="ALL">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="card-astrowind dark:bg-slate-900/50 p-12 text-center text-slate-400">
            <BookOpen className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
              No matching courses found.
            </p>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search criteria or department filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((c) => (
              <div
                key={c.id}
                className="card-astrowind dark:bg-slate-900/50 p-6 flex flex-col justify-between hover:border-primary/40 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="info">{c.departmentName || 'General Studies'}</Badge>
                    <span className="text-[11px] text-slate-400 font-medium">Published</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {c.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 text-primary dark:text-blue-400 flex items-center justify-center text-xs font-bold">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400">Faculty</p>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {c.teacherName || 'Assigned Instructor'}
                      </p>
                    </div>
                  </div>
                  <Link to="/login">
                    <Button variant="secondary" size="sm" className="text-xs">
                      Enroll / View
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
