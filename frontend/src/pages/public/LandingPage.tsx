import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  ArrowRight,
  FileText,
  Upload,
  Sparkles,
  HelpCircle,
  Award,
} from 'lucide-react';
import { TopNavbar } from '../../components/layout/TopNavbar';
import { Footer } from '../../components/layout/Footer';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { publicApi, type PublicStats } from '../../api/public';
import type { Course } from '../../types';

export const LandingPage: React.FC = () => {
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const [statsRes, coursesRes] = await Promise.all([
          publicApi.getStats().catch(() => null),
          publicApi.getCourses().catch(() => null),
        ]);

        if (statsRes?.data?.data) setStats(statsRes.data.data);
        if (coursesRes?.data?.data) setFeaturedCourses(coursesRes.data.data.slice(0, 6));
      } catch {
        // Fallback gracefully
      }
    };

    fetchPublicData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60 dark:bg-[#030620] text-slate-900 dark:text-slate-100 antialiased transition-colors duration-200">
      <TopNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32">
        {/* Glow background effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-primary/15 via-blue-500/10 to-accent/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800 text-xs font-semibold text-primary dark:text-blue-400 mb-8 animate-fade">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Generation Learning Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.12]">
            Transform Education with{' '}
            <span className="text-primary dark:text-blue-400">Modular Curricula</span> & Real-Time Grading.
          </h1>

          <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            SPREE LMS provides universities and educational institutions with seamless coursework management, authenticated PDF/Word document sharing, and student submissions.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/explore">
              <Button size="lg" className="w-full sm:w-auto font-bold shadow-lg shadow-blue-500/25 px-8">
                Explore Courses <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto font-semibold px-8">
                Get Started Free
              </Button>
            </Link>
          </div>

          {/* Real Statistics Strip */}
          {stats && (
            <div className="mt-16 pt-12 border-t border-slate-200/80 dark:border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="card-astrowind p-4 dark:bg-slate-900/40">
                <p className="text-3xl font-extrabold text-primary dark:text-blue-400">{stats.totalStudents}</p>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Enrolled Students</p>
              </div>
              <div className="card-astrowind p-4 dark:bg-slate-900/40">
                <p className="text-3xl font-extrabold text-primary dark:text-blue-400">{stats.totalTeachers}</p>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Faculty Members</p>
              </div>
              <div className="card-astrowind p-4 dark:bg-slate-900/40">
                <p className="text-3xl font-extrabold text-primary dark:text-blue-400">{stats.totalCourses}</p>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Active Courses</p>
              </div>
              <div className="card-astrowind p-4 dark:bg-slate-900/40">
                <p className="text-3xl font-extrabold text-primary dark:text-blue-400">{stats.totalDepartments}</p>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Academic Depts</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16 bg-white dark:bg-[#030620]/60 border-y border-slate-200/80 dark:border-slate-800">
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary dark:text-blue-400">
                Curriculum Catalog
              </p>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                Featured Courses
              </h2>
            </div>
            <Link
              to="/explore"
              className="mt-4 md:mt-0 text-sm font-semibold text-primary dark:text-blue-400 hover:underline inline-flex items-center gap-1"
            >
              Browse All Courses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {featuredCourses.length === 0 ? (
            <div className="card-astrowind p-12 text-center text-slate-400">
              <BookOpen className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
                Courses are being scheduled for this semester.
              </p>
              <p className="text-xs text-slate-400 mt-1">Check back shortly or log in to check your assigned classes.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCourses.map((c) => (
                <div
                  key={c.id}
                  className="card-astrowind dark:bg-slate-900/50 p-6 flex flex-col justify-between hover:border-primary/40 transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="info">{c.departmentName || 'General Studies'}</Badge>
                      <span className="text-[11px] text-slate-400 font-medium">Instructor-Led</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                      {c.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {c.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-slate-400">Faculty</p>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {c.teacherName || 'Faculty Assigned'}
                      </p>
                    </div>
                    <Link to="/login">
                      <Button variant="secondary" size="sm" className="text-xs">
                        View Course
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Platform Features Section */}
      <section className="py-20 lg:py-24">
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-primary dark:text-blue-400">
              Core Architecture
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
              Everything Needed for Modern Campus Learning
            </h2>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              Engineered with clean separation of concerns, secure document storage, and authenticated workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-astrowind dark:bg-slate-900/50 p-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-primary dark:text-blue-400 flex items-center justify-center mb-5">
                <FileText className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                PDF & Word Course Materials
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Teachers can upload lecture notes, slides, and syllabus files (≤ 1 MB) with authenticated access control.
              </p>
            </div>

            <div className="card-astrowind dark:bg-slate-900/50 p-8">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-accent dark:text-purple-400 flex items-center justify-center mb-5">
                <Upload className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Document Submissions
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Students submit answers as formatted documents or structured text. Supports deadline checks and resubmissions.
              </p>
            </div>

            <div className="card-astrowind dark:bg-slate-900/50 p-8">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5">
                <Award className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Real-Time Grade Reflection
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Faculty evaluate submissions and post scores and notes that immediately reflect in the student's learning space.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How SPREE Works */}
      <section className="py-20 bg-white dark:bg-[#030620]/60 border-t border-slate-200/80 dark:border-slate-800">
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              How SPREE Works
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              A structured hierarchy from department administration to individual lessons.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center mx-auto mb-3 shadow-md shadow-blue-500/20">
                1
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Department Setup</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Admins organize academic departments and assign faculty chairs.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center mx-auto mb-3 shadow-md shadow-blue-500/20">
                2
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Course & Lesson Design</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Teachers create structured modules, publish lessons, and attach resources.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center mx-auto mb-3 shadow-md shadow-blue-500/20">
                3
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Enrolled Learning</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Students access course tracks, study lesson notes, and download materials.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center mx-auto mb-3 shadow-md shadow-blue-500/20">
                4
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Submission & Grading</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Assignments are completed online, uploaded, graded, and stored securely.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Common questions about SPREE LMS capabilities and document uploads.
            </p>
          </div>

          <div className="space-y-4">
            <div className="card-astrowind dark:bg-slate-900/50 p-5">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-primary" /> What file formats can be uploaded?
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 pl-6 leading-relaxed">
                Both teachers and students can upload PDF (.pdf) and Microsoft Word (.doc, .docx) documents. Files are strictly capped at 1 MB per document for high performance and integrity.
              </p>
            </div>

            <div className="card-astrowind dark:bg-slate-900/50 p-5">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-primary" /> How is file security enforced?
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 pl-6 leading-relaxed">
                Files are stored outside the public document directory. Downloads require Spring Security JWT authentication and enrollment verification to prevent unauthorized access.
              </p>
            </div>

            <div className="card-astrowind dark:bg-slate-900/50 p-5">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-primary" /> Can students resubmit their assignments?
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 pl-6 leading-relaxed">
                Yes! Students can resubmit answers or upload updated documents anytime prior to the assignment's specified deadline.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
