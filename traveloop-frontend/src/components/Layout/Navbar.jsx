import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiMoon, FiSun, FiChevronDown, FiLogOut, FiMenu, FiX, FiUser, FiBell, FiCheck, FiTrash2 } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/slices/authSlice';
import { toggleTheme } from '@/store/slices/uiSlice';
import { fetchNotifications, markAsRead, markAllAsRead, deleteNotification } from '@/store/slices/notificationSlice';
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
  const { items: notifications, status: notifStatus } = useSelector((state) => state.notifications || { items: [], status: 'idle' });
  const unreadCount = notifications.filter(n => !n.read).length;

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Fetch notifications on mount and when user logs in
  useEffect(() => {
    if (user && notifStatus === 'idle') {
      dispatch(fetchNotifications());
    }
  }, [user, notifStatus, dispatch]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileOpen]);

  const navItems = useMemo(
    () => [
      { to: '/', label: 'Dashboard' },
      { to: '/ai-hub', label: 'Travel Lab' },
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

  const handleMarkAsRead = (e, id) => {
    e.stopPropagation();
    dispatch(markAsRead(id));
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    dispatch(deleteNotification(id));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  return (
    <header className="sticky top-0 z-[60] border-b border-white/20 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-teal-500 via-blue-500 to-orange-400 text-base font-black text-white shadow-soft sm:h-10 sm:w-10 sm:text-lg">
            T
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-extrabold tracking-tight sm:text-lg">Traveloop</p>
            <p className="hidden truncate text-xs text-slate-500 dark:text-slate-400 sm:block">Plan smarter, travel lighter</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClass}>
              <span className="flex items-center gap-1">
                {item.label}
                {item.label === 'Travel Lab' && (
                  <span className="rounded bg-gradient-to-r from-teal-400 to-indigo-500 px-1 py-0.2 text-[8px] font-black text-white shadow-soft">
                    LAB
                  </span>
                )}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => dispatch(toggleTheme())}
            className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
          </button>

          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen((v) => !v)}
              className="relative grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              aria-label="Notifications"
            >
              <FiBell />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 grid h-4 w-4 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="fixed left-3 right-3 top-16 z-50 max-h-[calc(100dvh-5rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:absolute sm:left-auto sm:right-0 sm:top-auto sm:mt-2 sm:w-80">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-sm">Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="flex items-center gap-1 text-xs text-teal-500 hover:text-teal-600 font-medium transition"
                      title="Mark all as read"
                    >
                      <FiCheck size={14} />
                      Mark all read
                    </button>
                  )}
                </div>

                {/* List */}
                <div className="max-h-[min(18rem,calc(100dvh-10rem))] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {notifStatus === 'loading' ? (
                    <div className="p-4 text-sm text-slate-500 text-center">Loading…</div>
                  ) : notifications.length === 0 ? (
                    <div className="p-6 text-sm text-slate-500 text-center flex flex-col items-center gap-2">
                      <FiBell size={24} className="text-slate-300" />
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n._id}
                        className={`group flex items-start gap-3 px-4 py-3 text-sm transition cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                          n.read ? 'opacity-60' : 'bg-teal-50/50 dark:bg-teal-900/10'
                        }`}
                        onClick={(e) => !n.read && handleMarkAsRead(e, n._id)}
                      >
                        {/* Unread dot */}
                        <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? 'bg-transparent' : 'bg-teal-500'}`} />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{n.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
                          {!n.read && (
                            <button
                              onClick={(e) => handleMarkAsRead(e, n._id)}
                              className="p-1 rounded hover:bg-teal-100 dark:hover:bg-teal-900/30 text-teal-500"
                              title="Mark as read"
                            >
                              <FiCheck size={13} />
                            </button>
                          )}
                          <button
                            onClick={(e) => handleDelete(e, n._id)}
                            className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-400"
                            title="Delete"
                          >
                            <FiTrash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer refresh */}
                <div className="border-t border-slate-200 dark:border-slate-700 px-4 py-2 text-center">
                  <button
                    onClick={() => dispatch(fetchNotifications())}
                    className="text-xs text-slate-400 hover:text-teal-500 transition"
                  >
                    Refresh
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-1.5 py-1.5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:gap-2 sm:px-2"
            >
              <div className="grid h-8 w-8 place-items-center overflow-hidden rounded-full bg-teal-500 text-sm font-bold text-white">
                {user?.photoUrl ? (
                  <img
                    src={user.photoUrl}
                    alt={user?.name}
                    className="h-full w-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
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
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      <div className={`fixed inset-0 z-50 lg:hidden ${mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'}`} aria-hidden={!mobileOpen}>
        <button
          type="button"
          className={`absolute inset-0 bg-slate-950/45 backdrop-blur-[2px] transition-opacity duration-200 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu overlay"
        />
        <aside
          className={`absolute right-0 top-0 flex h-dvh w-[min(88vw,360px)] flex-col overflow-hidden border-l border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-out dark:border-slate-800 dark:bg-slate-950 ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 dark:border-slate-800">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-teal-500 via-blue-500 to-orange-400 text-base font-black text-white shadow-soft">
                T
              </div>
              <div className="min-w-0">
                <p className="truncate text-base font-extrabold">Traveloop</p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">Plan smarter, travel lighter</p>
              </div>
            </div>
            <button
              className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-200"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <FiX />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="grid gap-2">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={navLinkClass} onClick={() => setMobileOpen(false)}>
                <span className="flex items-center gap-1">
                  {item.label}
                  {item.label === 'Travel Lab' && (
                    <span className="rounded bg-gradient-to-r from-teal-400 to-indigo-500 px-1 py-0.2 text-[8px] font-black text-white shadow-soft">
                      LAB
                    </span>
                  )}
                </span>
              </NavLink>
            ))}
          </div>
          </div>

          <div className="border-t border-slate-200 p-4 dark:border-slate-800">
            <button
              onClick={() => {
                setMobileOpen(false);
                handleLogout();
              }}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-bold text-white dark:bg-teal-600"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </aside>
      </div>
    </header>
  );
}
