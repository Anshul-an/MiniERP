import { useState, FormEvent, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Eye, EyeOff, AlertCircle, Shield, BarChart3, Users } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage } from '../lib/api';

const FEATURES = [
  { icon: Shield, label: 'Role-Based Access Control', desc: 'Admin, Manager, Employee views' },
  { icon: BarChart3, label: 'Multi-Stage Approvals', desc: 'Leave & purchase workflows' },
  { icon: Users, label: 'Real-Time Dashboards', desc: 'Charts, stats, activity feeds' },
];

const DEMO_ROLES = [
  { key: 'admin' as const,    label: 'Admin',    color: '#c084fc', bg: 'rgba(139,92,246,0.1)',  border: 'rgba(139,92,246,0.25)' },
  { key: 'manager' as const,  label: 'Manager',  color: '#60a5fa', bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.25)' },
  { key: 'employee' as const, label: 'Employee', color: '#34d399', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.25)' },
];

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const submitTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (submitTimeout.current) return;
    submitTimeout.current = setTimeout(() => { submitTimeout.current = null; }, 500);

    setError('');
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password.trim());
      navigate('/dashboard');
    } catch (err: any) {
      const msg = getErrorMessage(err);
      setError(msg.includes('Session expired') || msg.includes('Invalid request')
        ? 'Invalid credentials — check your email and password, then try again.'
        : msg);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role: 'admin' | 'manager' | 'employee') => {
    const creds = {
      admin:    { email: 'admin@minierp.com',    password: 'Admin@123' },
      manager:  { email: 'manager@minierp.com',  password: 'Manager@123' },
      employee: { email: 'employee@minierp.com', password: 'Employee@123' },
    };
    setEmail(creds[role].email);
    setPassword(creds[role].password);
    setError('');
  };

  const inputStyle = {
    background: 'rgba(30,45,69,0.5)',
    border: '1px solid #252d3d',
    color: '#e2e8f0',
    outline: 'none',
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#0d1117' }}>
      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-5/12 flex-col justify-between p-14 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #111827 0%, #0f172a 60%, #0d1117 100%)', borderRight: '1px solid #1e2d45' }}>

        {/* Background glow orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', transform: 'translate(-30%,-30%)' }} />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)', transform: 'translate(30%,30%)' }} />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="relative w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">MiniERP</span>
        </div>

        {/* Hero text */}
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white leading-tight mb-4 tracking-tight">
            Internal Operations<br />
            <span style={{ background: 'linear-gradient(90deg, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Reimagined
            </span>
          </h1>
          <p className="text-lg leading-relaxed mb-10" style={{ color: '#64748b' }}>
            Manage leave requests, purchase approvals, and team operations all in one place.
          </p>
          <div className="space-y-5">
            {FEATURES.map(({ icon: Icon, label, desc }, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
                  <Icon className="w-4 h-4" style={{ color: '#818cf8' }} />
                </div>
                <div>
                  <span className="text-sm font-semibold text-white">{label}</span>
                  <span className="text-sm ml-1.5" style={{ color: '#475569' }}>— {desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs relative z-10" style={{ color: '#334155' }}>MiniERP v1.0 &bull; Built for StrainX</p>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-center justify-center p-6"
        style={{ background: '#0d1117' }}>
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-white">MiniERP</span>
          </div>

          {/* Card */}
          <div className="rounded-2xl p-8"
            style={{ background: 'linear-gradient(135deg, #161b27, #1a2035)', border: '1px solid #252d3d', boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}>

            <h2 className="text-2xl font-bold text-white mb-1">Sign in</h2>
            <p className="text-sm mb-7" style={{ color: '#64748b' }}>Enter your credentials to access the platform</p>

            {error && (
              <div className="mb-5 p-3.5 rounded-xl flex items-start gap-2.5 text-sm"
                role="alert"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label htmlFor="login-email" className="block text-xs font-semibold uppercase tracking-wider mb-2"
                  style={{ color: '#64748b' }}>Email</label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onBlur={e => setEmail(e.target.value.trim().toLowerCase())}
                  required
                  autoComplete="email"
                  placeholder="you@company.com"
                  className="w-full h-11 px-4 rounded-xl text-sm transition-all"
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)'; }}
                />
              </div>

              <div>
                <label htmlFor="login-password" className="block text-xs font-semibold uppercase tracking-wider mb-2"
                  style={{ color: '#64748b' }}>Password</label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full h-11 px-4 pr-11 rounded-xl text-sm transition-all"
                    style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)'; }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors hover:text-white active:scale-95"
                    style={{ color: '#475569' }}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 font-semibold rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm text-white"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: loading ? 'none' : '0 4px 20px rgba(99,102,241,0.35)' }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in…
                  </span>
                ) : 'Sign in'}
              </button>
            </form>

            {/* Demo buttons */}
            <div className="mt-7 pt-6" style={{ borderTop: '1px solid #252d3d' }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#475569' }}>Try a demo account</p>
              <div className="grid grid-cols-3 gap-2">
                {DEMO_ROLES.map(({ key, label, color, bg, border }) => (
                  <button
                    key={key}
                    onClick={() => fillDemo(key)}
                    type="button"
                    className="py-2.5 px-3 min-h-[44px] text-xs font-semibold rounded-xl transition-all active:scale-95 hover:-translate-y-0.5"
                    style={{ background: bg, color, border: `1px solid ${border}` }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
