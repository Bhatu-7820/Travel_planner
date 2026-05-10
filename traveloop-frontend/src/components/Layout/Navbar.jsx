import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiMoon, FiSun, FiChevronDown, FiLogOut, FiMenu, FiX, FiUser, FiBell } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/slices/authSlice';
import { toggleTheme } from '@/store/slices/uiSlice';
import { authService } from '@/services/authService';
import { getInitials, cn } from '@/utils/helpers';
import toast from 'react-hot-toast';

const navLinkClass = ({ isActive }) =>
  cn(
    'rounded-full px-4 py-2 text-sm font-medium transition',
    isActive
      ? 'bg-teal-500 text-white shadow-soft'
      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
  );

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const theme = useSelector((state) => state.ui.theme);
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { items: notifications } = useSelector((state) => state.notifications || { items: [] });
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const navItems = useMemo(
    () => [
      { to: '/', label: 'Dashboard' },
      { to: '/my-trips', label: 'My Trips' },
      { to: '/create-trip', label: 'Create Trip' },
      { to: '/agents', label: 'Agents' },
      { to: '/profile', label: 'Profile' },
      { to: '/support', label: 'Support' },
      ...(user?.role === 'admin' ? [{ to: '/admin', label: 'Admin' }] : []),
    ],
    [user]
  );

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // ignore mock logout error
    }
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/20 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-teal-500 via-blue-500 to-orange-400 text-lg font-black text-white shadow-soft">
            T
          </div>
          <div>
            <p className="text-lg font-extrabold tracking-tight">Traveloop</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Plan smarter, travel lighter</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => dispatch(toggleTheme())}
            className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
          </button>

          <div className="relative">
            <button
              onClick={() => setNotifOpen((v) => !v)}
              className="relative grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <FiBell />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 grid h-4 w-4 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50">
                <div className="p-3 border-b border-slate-200 dark:border-slate-800 font-bold">Notifications</div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-sm text-slate-500 text-center">No notifications</div>
                  ) : (
                    notifications.map(n => (
                      <div key={n._id} className={`p-3 text-sm border-b border-slate-100 dark:border-slate-800 ${n.read ? 'opacity-60' : 'bg-slate-50 dark:bg-slate-800/50'}`}>
                        <p className="font-medium">{n.title}</p>
                        <p className="text-xs text-slate-500">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1.5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="grid h-8 w-8 place-items-center overflow-hidden rounded-full bg-teal-500 text-sm font-bold text-white">
                {user?.photoUrl ? (
                  <img src={user.photoUrl} alt={user?.name} className="h-full w-full object-cover" />
                ) : (
                  getInitials(user?.name || 'U')
                )}
              </div>
              <span className="hidden max-w-[120px] truncate text-sm font-medium sm:inline">{user?.name || 'Account'}</span>
              <FiChevronDown className="text-slate-500" />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate('/profile');
                  }}
                  className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <FiUser /> Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <FiLogOut /> Logout
                </button>
              </div>
            )}
          </div>

          <button
            className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 lg:hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Open menu"
          >
            {mobileOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden dark:border-slate-800 dark:bg-slate-950">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={navLinkClass} onClick={() => setMobileOpen(false)}>
                {item.label}
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="rounded-full px-4 py-2 text-left text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
