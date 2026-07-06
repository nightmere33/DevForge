import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Reveal } from '../components/ui';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(username, password);
      navigate(from);
    } catch {
      setError(t('auth.invalid'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <Reveal className="w-full max-w-md">
        <div className="card p-8 md:p-10">
          <h1 className="font-display text-3xl font-bold text-white">
            {t('auth.login_title_a')} <span className="gradient-text">{t('auth.login_title_b')}</span>
          </h1>
          <p className="mt-2 text-sm text-slate-400">{t('auth.login_sub')}</p>
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-200">{error}</div>
            )}
            <div>
              <label htmlFor="username" className="label">{t('auth.username')}</label>
              <input id="username" type="text" required className="input" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div>
              <label htmlFor="password" className="label">{t('auth.password')}</label>
              <input id="password" type="password" required className="input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? t('auth.logging_in') : t('auth.login')}
            </button>
            <p className="text-center text-sm text-slate-400">
              {t('auth.no_account')}{' '}
              <Link to="/register" className="font-semibold text-cyan-300 hover:text-cyan-200">{t('auth.create_one')}</Link>
            </p>
          </form>
        </div>
      </Reveal>
    </div>
  );
};

export default Login;
