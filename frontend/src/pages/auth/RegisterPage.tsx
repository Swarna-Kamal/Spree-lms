import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Eye, EyeOff, AlertCircle, Sparkles, BookOpen, Users, Award } from 'lucide-react';
import { authApi } from '../../api/auth';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import type { ApiError } from '../../types';
import type { AxiosError } from 'axios';

type Role = 'STUDENT' | 'TEACHER';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [role, setRole] = useState<Role>('STUDENT');
  const [errors, setErrors] = useState<Partial<typeof form & { role: string }>>({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const newErrors: Partial<typeof form> = {};
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!form.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Enter a valid email';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (form.confirmPassword !== form.password) newErrors.confirmPassword = 'Passwords do not match';
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
      const res = await authApi.register({
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        roleName: role,
      });
      setAuth(res.data.data);
      if (res.data.data.role === 'TEACHER') navigate('/teacher');
      else navigate('/student');
    } catch (err) {
      const axiosErr = err as AxiosError<ApiError>;
      setApiError(
        axiosErr.response?.data?.message || 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50/50">
      {/* Left: AstroWind Branding panel */}
      <div className="hidden lg:flex lg:w-5/12 bg-[#030620] flex-col justify-between p-12 relative overflow-hidden text-white border-r border-slate-800">
        {/* Glow effects */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-accent/25 rounded-full blur-3xl pointer-events-none" />

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
              <Sparkles className="w-3.5 h-3.5" />
              <span>Join Your Institutional Workspace</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white leading-tight">
              Start your academic and teaching journey today.
            </h2>
            <p className="mt-4 text-slate-300 text-sm leading-relaxed">
              Create your account as a student or educator to connect with your faculty, access modular course tracks, and complete verified assignments.
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
              <p className="text-xs font-semibold text-white">Curriculum</p>
              <p className="text-[11px] text-slate-400">Step-by-step</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center flex-shrink-0 text-purple-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Classrooms</p>
              <p className="text-[11px] text-slate-400">Cohesive batches</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center flex-shrink-0 text-emerald-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Scores</p>
              <p className="text-[11px] text-slate-400">Verified grades</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Registration form */}
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
            <div className="mb-6">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create your account</h1>
              <p className="text-sm text-slate-500 mt-1.5">
                Join the SPREE community and get connected.
              </p>
            </div>

            {/* Role selector tabs */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                I am registering as:
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setRole('STUDENT')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    role === 'STUDENT'
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole('TEACHER')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    role === 'TEACHER'
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Faculty / Teacher
                </button>
              </div>
            </div>

            {apiError && (
              <div className="mb-6 flex items-start gap-3 p-4 bg-rose-50 border border-rose-200/80 rounded-2xl text-rose-700 text-xs leading-relaxed animate-fade">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{apiError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="First Name"
                  placeholder="Jane"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  error={errors.firstName}
                  required
                  className="rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20"
                />
                <Input
                  label="Last Name"
                  placeholder="Doe"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  error={errors.lastName}
                  required
                  className="rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20"
                />
              </div>

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
                  placeholder="At least 8 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  error={errors.password}
                  required
                  autoComplete="new-password"
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

              <Input
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Re-enter password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                error={errors.confirmPassword}
                required
                autoComplete="new-password"
                className="rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20"
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  loading={loading}
                  className="w-full py-3 rounded-xl font-semibold shadow-md shadow-blue-600/20"
                  size="lg"
                >
                  Create Account
                </Button>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-primary hover:text-secondary font-semibold hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
