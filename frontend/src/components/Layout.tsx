import { ReactNode, useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, CalendarDays, ShoppingCart,
  Users, LogOut, Menu, X, Zap, Bell
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../lib/utils';

interface LayoutProps { children: ReactNode }

const SIDEBAR_KEY = 'minierp_sidebar_open';

export function Layout({ children }: LayoutProps) {
  const { user, logout, isAdmin, isManager } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    try {
      const stored = localStorage.getItem(SIDEBAR_KEY);
      return stored !== null ? stored === 'true' : false;
    } catch { return false; }
  });

  useEffect(() => {
    try { localStorage.setItem(SIDEBAR_KEY, String(sidebarOpen)); } catch {}
  }, [sidebarOpen]);

  const handleLogout = () => { logout(); navigate('/login'); };

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', show: true },
    { to: '/leave', icon: CalendarDays, label: 'Leave', show: true },
    { to: '/purchase', icon: ShoppingCart, label: 'Purchases', show: true },
    { to: '/users', icon: Users, label: 'Users', show: isAdmin },
  ].filter(item => item.show);

  const roleGradient = isAdmin
    ? 'from-violet-500 to-purple-600'
    : isManager
    ? 'from-blue-500 to-indigo-600'
    : 'from-emerald-500 to-teal-600';

  const roleLabel = isAdmin ? 'Admin' : isManager ? 'Manager' : 'Employee';

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0d1117' }}>
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-lg focus:text-sm"
      >
        Skip to main content
      </a>

      {/* ── SIDEBAR ── */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-30 w-64 flex flex-col transition-transform duration-200 ease-in-out',
        'border-r',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:relative lg:translate-x-0'
      )}
        style={{
          background: 'linear-gradient(180deg, #111827 0%, #0f172a 100%)',
          borderColor: '#1e2d45',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: '1px solid #1e2d45' }}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <Zap className="w-5 h-5 text-white" />
            <div className="absolute inset-0 rounded-xl" style={{ boxShadow: '0 0 16px rgba(99,102,241,0.5)' }} />
          </div>
          <div>
            <span className="font-bold text-white text-base leading-none">MiniERP</span>
            <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>Operations Hub</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden transition-colors hover:text-white"
            style={{ color: '#64748b' }}
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto" aria-label="Main navigation">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => cn(
                'relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 group',
                isActive ? 'text-white' : 'hover:text-white'
              )}
              style={({ isActive }) => isActive ? {
                background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15))',
                border: '1px solid rgba(99,102,241,0.3)',
                color: '#a5b4fc',
              } : {
                color: '#64748b',
                border: '1px solid transparent',
              }}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-full"
                      style={{ background: 'linear-gradient(180deg, #6366f1, #8b5cf6)' }} />
                  )}
                  <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-indigo-400' : 'text-current')} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User card */}
        <div className="p-4" style={{ borderTop: '1px solid #1e2d45' }}>
          <div className="flex items-center gap-3 p-3 rounded-xl mb-3"
            style={{ background: 'rgba(30,45,69,0.5)' }}>
            <div className={cn(
              'w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-gradient-to-br font-bold text-white text-sm',
              roleGradient
            )}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs truncate" style={{ color: '#64748b' }}>{user?.department}</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: 'rgba(99,102,241,0.15)',
                color: '#a5b4fc',
                border: '1px solid rgba(99,102,241,0.25)',
              }}>
              {roleLabel}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm rounded-xl transition-all active:scale-95 hover:text-red-400"
            style={{ color: '#64748b', border: '1px solid #1e2d45' }}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)' }}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── MAIN AREA ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center gap-4 px-6 py-4 shrink-0"
          style={{
            background: 'rgba(13,17,23,0.8)',
            borderBottom: '1px solid #1e2d45',
            backdropFilter: 'blur(12px)',
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden transition-colors hover:text-white"
            style={{ color: '#64748b' }}
            aria-label="Open navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1" />

          {/* Notification bell */}
          <button className="relative p-2 rounded-xl transition-colors hover:text-white"
            style={{ color: '#64748b', border: '1px solid #1e2d45', background: 'rgba(30,45,69,0.4)' }}>
            <Bell className="w-4 h-4" />
          </button>

          {/* User chip */}
          <div className="flex items-center gap-2.5 pl-3 pr-4 py-2 rounded-xl"
            style={{ background: 'rgba(30,45,69,0.5)', border: '1px solid #1e2d45' }}>
            <div className={cn(
              'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br shrink-0',
              roleGradient
            )}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-white hidden sm:block">{user?.name}</span>
          </div>
        </header>

        {/* Page content */}
        <main id="main-content" role="main" className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
