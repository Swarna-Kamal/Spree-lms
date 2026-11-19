import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Github, Twitter, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-[#030620] border-t border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-primary flex items-center justify-center text-white shadow-sm">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                SPREE
              </span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Modern Learning Management System powering academic curricula, modular lessons, course materials, and real-time grading.
            </p>
            <div className="flex items-center space-x-3 text-slate-400">
              <a href="#github" className="hover:text-primary transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#twitter" className="hover:text-primary transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#linkedin" className="hover:text-primary transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Overview
                </Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-primary transition-colors">
                  Course Catalog
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary transition-colors">
                  Student Portal
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary transition-colors">
                  Faculty Workspace
                </Link>
              </li>
            </ul>
          </div>

          {/* Academic Features */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Capabilities
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>PDF & Word Materials</li>
              <li>Online Assignment Submissions</li>
              <li>Role-Based Access Control</li>
              <li>Syllabus & Lesson Tracking</li>
              <li>Real-Time Grade Feedback</li>
            </ul>
          </div>

          {/* Institutional Compliance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Enterprise Academy
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Engineered with Spring Boot 3, Supabase PostgreSQL, and modern React for high scalability and secure document sharing.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800">
                System Active • Production Ready
              </span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} SPREE LMS Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with modern web standards and AstroWind design aesthetics.
          </p>
        </div>
      </div>
    </footer>
  );
};
