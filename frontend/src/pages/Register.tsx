import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Reveal } from '../components/ui';

const Register: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ username: '', email: '', password: '', password2: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || '/dashboard';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.password2) {
      setError(t('auth.pw_mismatch'));
      return;
    }
    setLoading(true);
    setError('');
    try {
      await register(formData);
      await login(formData.username, formData.password);
      navigate(from);
    } catch (err: any) {
      if (err.response?.data) {
        const firstError = Object.values(err.response.data).flat()[0] as string;
        setError(firstError || t('common.error'));
      } else {
        setError(t('common.error'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <Reveal className="w-full max-w-md">
        <div className="card p-8 md:p-10">
          <h1 className="font-display text-3xl font-bold text-white">
            {t('auth.register_title_a')} <span className="gradient-text">{t('auth.register_title_b')}</span>
          </h1>
          <p className="mt-2 text-sm text-slate-400">{t('auth.register_sub')}</p>
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-200">{error}</div>
            )}
            <div>
              <label htmlFor="username" className="label">{t('auth.username')}</label>
              <input id="username" name="username" type="text" required className="input" value={formData.username} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="email" className="label">{t('auth.email')}</label>
              <input id="email" name="email" type="email" required className="input" value={formData.email} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="password" className="label">{t('auth.password')}</label>
              <input id="password" name="password" type="password" required className="input" placeholder="••••••••" value={formData.password} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="password2" className="label">{t('auth.password2')}</label>
              <input id="password2" name="password2" type="password" required className="input" placeholder="••••••••" value={formData.password2} onChange={handleChange} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? t('auth.registering') : t('auth.register')}
            </button>
            <p className="text-center text-sm text-slate-400">
              {t('auth.have_account')}{' '}
              <Link to="/login" className="font-semibold text-cyan-300 hover:text-cyan-200">{t('auth.sign_in')}</Link>
            </p>
          </form>
        </div>
      </Reveal>
    </div>
  );
};

export default Register;
