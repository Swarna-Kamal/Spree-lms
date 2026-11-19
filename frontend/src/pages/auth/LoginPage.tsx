import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Eye, EyeOff, AlertCircle, BookOpen, Users, Award, ShieldCheck } from 'lucide-react';
import { authApi } from '../../api/auth';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import type { ApiError } from '../../types';
import type { AxiosError } from 'axios';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const newErrors: Partial<typeof form> = {};
    if (!form.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Enter a valid email';
    if (!form.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setApiError('');
    setLoading(true);
    try {
      const res = await authApi.login(form);
      setAuth(res.data.data);
      const role = res.data.data.role;
      if (role === 'ADMIN') navigate('/admin');
      else if (role === 'TEACHER') navigate('/teacher');
      else navigate('/student');
    } catch (err) {
      const axiosErr = err as AxiosError<ApiError>;
      setApiError(
        axiosErr.response?.data?.message || 'Invalid credentials. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50/50">
      {/* Left: AstroWind Branding panel */}
      <div className="hidden lg:flex lg:w-5/12 bg-[#030620] flex-col justify-between p-12 relative overflow-hidden text-white border-r border-slate-800">
        {/* Ambient background glow */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-accent/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3.5 mb-14 group">
            <div className="flex items-center justify-center w-12 h-12 bg-primary hover:bg-secondary rounded-2xl shadow-lg shadow-blue-500/30 transition-all group-hover:scale-105">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight text-white block">SPREE</span>
              <span className="text-xs text-blue-400 font-medium tracking-wider uppercase">
                Learning Experience Platform
              </span>
            </div>
          </Link>

          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-xs font-semibold text-blue-400 mb-6">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Next-Gen Enterprise Academy</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white leading-tight">
              Elevate your campus knowledge & structured learning.
            </h2>
            <p className="mt-4 text-slate-300 text-sm leading-relaxed">
              SPREE unifies curriculum management, interactive lesson delivery, multi-role course enrollments, and real-time grading in one modern workspace.
            </p>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="relative z-10 grid grid-cols-3 gap-4 pt-8 border-t border-slate-800/80">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center flex-shrink-0 text-blue-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Coursework</p>
              <p className="text-[11px] text-slate-400">Modular syllabus</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center flex-shrink-0 text-purple-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Rosters</p>
              <p className="text-[11px] text-slate-400">Managed access</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center flex-shrink-0 text-emerald-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Grading</p>
              <p className="text-[11px] text-slate-400">Instant feedback</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Form panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16 relative">
        {/* Back to Home Button */}
        <Link
          to="/"
          className="absolute top-6 right-6 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-primary hover:bg-slate-100 transition-all border border-slate-200/80 bg-white shadow-xs"
        >
          ← Back to Home
        </Link>

        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-2xl shadow-sm">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">SPREE</span>
          </Link>

          <div className="card-astrowind p-8 sm:p-10 border border-slate-200/80 bg-white">
            <div className="mb-8">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome back</h1>
              <p className="text-sm text-slate-500 mt-1.5">
                Sign in with your registered account to continue.
              </p>
            </div>

            {apiError && (
              <div className="mb-6 flex items-start gap-3 p-4 bg-rose-50 border border-rose-200/80 rounded-2xl text-rose-700 text-xs leading-relaxed animate-fade">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{apiError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <Input
                label="Email address"
                type="email"
                placeholder="you@institution.edu"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                error={errors.email}
                required
                autoComplete="email"
                className="rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20"
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  error={errors.password}
                  required
                  autoComplete="current-password"
                  className="rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-[38px] text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  loading={loading}
                  className="w-full py-3 rounded-xl font-semibold shadow-md shadow-blue-600/20"
                  size="lg"
                >
                  Sign in to SPREE
                </Button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-primary hover:text-secondary font-semibold hover:underline"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
