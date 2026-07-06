import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { CheckCircle2 } from 'lucide-react';
import { sendContactMessage } from '../api';
import { useSiteConfig } from '../context/SiteConfigContext';
import {
  MailIcon, PhoneIcon, MapPinIcon, GitHubIcon, LinkedInIcon, TwitterIcon, WhatsAppIcon, SendIcon,
} from '../components/icons';
import { Reveal } from '../components/ui';

const Contact: React.FC = () => {
  const { t } = useTranslation();
  const { config } = useSiteConfig();
  const [params] = useSearchParams();
  const [form, setForm] = useState({ name: '', email: '', subject: params.get('subject') || '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  if (!config) return <div className="py-32 text-center text-slate-400">{t('common.loading')}</div>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await sendContactMessage(form);
      setSent(true);
    } catch {
      toast.error(t('common.error'));
    } finally {
      setSending(false);
    }
  };

  const infoItems = [
    config.email && { icon: <MailIcon className="h-5 w-5" />, label: t('contact.email'), value: config.email, href: `mailto:${config.email}` },
    config.phone && { icon: <PhoneIcon className="h-5 w-5" />, label: t('contact.phone'), value: config.phone, href: `tel:${config.phone}` },
    config.location && { icon: <MapPinIcon className="h-5 w-5" />, label: t('contact.location'), value: config.location },
    config.whatsapp && {
      icon: <WhatsAppIcon className="h-5 w-5" />, label: t('contact.whatsapp'), value: config.whatsapp,
      href: `https://wa.me/${config.whatsapp.replace(/[^0-9]/g, '')}`,
    },
  ].filter(Boolean) as { icon: React.JSX.Element; label: string; value: string; href?: string }[];

  const socials = [
    { href: config.github_url, icon: <GitHubIcon />, label: 'GitHub' },
    { href: config.linkedin_url, icon: <LinkedInIcon />, label: 'LinkedIn' },
    { href: config.twitter_url, icon: <TwitterIcon />, label: 'Twitter / X' },
  ].filter((s) => s.href);

  return (
    <div className="container-page py-16 md:py-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-4xl font-bold text-white md:text-5xl">
          {t('contact.title_a')} <span className="gradient-text">{t('contact.title_b')}</span>
        </h1>
        <p className="mt-4 text-lg text-slate-400">{t('contact.subtitle')}</p>
      </Reveal>

      <div className="mt-16 grid gap-8 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          {infoItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.href?.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className={`card flex items-center gap-4 p-5 ${item.href ? 'card-hover' : ''}`}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
                {item.icon}
              </span>
              <span>
                <span className="block text-xs uppercase tracking-wide text-slate-500">{item.label}</span>
                <span className="text-sm font-medium text-slate-200">{item.value}</span>
              </span>
            </a>
          ))}

          {config.availability && (
            <div className="card flex items-center gap-3 border-emerald-400/20 bg-emerald-400/5 p-5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span className="text-sm font-medium text-emerald-200">{config.availability}</span>
            </div>
          )}

          {socials.length > 0 && (
            <div className="card p-5">
              <p className="mb-3 text-xs uppercase tracking-wide text-slate-500">{t('contact.find_me')}</p>
              <div className="flex gap-4">
                {socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white">
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="card p-8 lg:col-span-3">
          {sent ? (
            <div className="flex h-full flex-col items-center justify-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
                <CheckCircle2 className="h-9 w-9" />
              </div>
              <h3 className="mt-6 font-display text-2xl font-semibold text-white">{t('contact.sent_title')}</h3>
              <p className="mt-2 text-slate-400">{t('contact.sent_text')}</p>
              <button className="btn-outline btn-small mt-8" onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}>
                {t('contact.send_another')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="label">{t('contact.your_name')}</label>
                  <input id="name" name="name" required className="input" value={form.name} onChange={handleChange} />
                </div>
                <div>
                  <label htmlFor="email" className="label">{t('contact.your_email')}</label>
                  <input id="email" name="email" type="email" required className="input" value={form.email} onChange={handleChange} />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="label">{t('contact.subject')}</label>
                <input id="subject" name="subject" required className="input" placeholder={t('contact.subject_ph')} value={form.subject} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="message" className="label">{t('contact.message')}</label>
                <textarea id="message" name="message" required rows={6} className="input resize-none" placeholder={t('contact.message_ph')} value={form.message} onChange={handleChange} />
              </div>
              <button type="submit" disabled={sending} className="btn-primary w-full">
                <SendIcon /> {sending ? t('common.sending') : t('contact.send')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
