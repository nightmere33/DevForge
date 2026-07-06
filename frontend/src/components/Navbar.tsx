import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LayoutDashboard, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { fetchUnreadCount } from '../api';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { config } = useSiteConfig();
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/services', label: t('nav.services') },
    { to: '/projects', label: t('nav.projects') },
    { to: '/support', label: t('nav.support') },
    { to: '/contact', label: t('nav.contact') },
  ];

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!user) {
      setUnread(0);
      return;
    }
    const load = () => fetchUnreadCount().then((r) => setUnread(r.data.unread)).catch(() => {});
    load();
    const id = setInterval(load, 20000);
    return () => clearInterval(id);
  }, [user, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative text-sm font-medium transition ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'}`;

  return (
    <header className="glass-panel sticky top-0 z-50">
      <nav className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-1 font-display text-xl font-bold text-white">
          <span className="gradient-text">&lt;/&gt;</span>
          <span>{config?.site_name || 'DevForge'}</span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={navLinkClass} end={l.to === '/'}>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <LanguageSwitcher />
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="relative flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                <LayoutDashboard className="h-4 w-4" />
                {t('nav.my_orders')}
                {unread > 0 && (
                  <span className="absolute -end-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-bold text-white">
                    {unread}
                  </span>
                )}
              </Link>
              {user.role === 'developer' && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-cyan-300 transition hover:bg-white/5"
                >
                  <Settings className="h-4 w-4" />
                  {t('nav.admin')}
                </Link>
              )}
              <button onClick={handleLogout} className="btn-ghost btn-small">
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost btn-small">
                {t('nav.login')}
              </Link>
              <Link to="/order" className="btn-primary btn-small">
                {t('nav.order_now')}
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <LanguageSwitcher />
          <button
            className="rounded-lg p-2 text-slate-300 transition hover:bg-white/5"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-white/10 bg-night-900/95 lg:hidden"
          >
            <div className="container-page flex flex-col gap-1 py-4">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === '/'}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                      isActive ? 'bg-white/5 text-white' : 'text-slate-300 hover:bg-white/5'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <hr className="my-2 border-white/10" />
              {user ? (
                <>
                  <Link to="/dashboard" className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5">
                    {t('nav.my_orders')} {unread > 0 && <span className="ms-1 text-rose-400">({unread})</span>}
                  </Link>
                  {user.role === 'developer' && (
                    <Link to="/admin" className="rounded-lg px-3 py-2.5 text-sm font-medium text-cyan-300 hover:bg-white/5">
                      {t('nav.admin')}
                    </Link>
                  )}
                  <button onClick={handleLogout} className="btn-outline btn-small mt-2">
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <div className="mt-2 flex gap-2">
                  <Link to="/login" className="btn-outline btn-small flex-1">
                    {t('nav.login')}
                  </Link>
                  <Link to="/order" className="btn-primary btn-small flex-1">
                    {t('nav.order_now')}
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
