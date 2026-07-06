import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSiteConfig } from '../context/SiteConfigContext';
import { GitHubIcon, LinkedInIcon, TwitterIcon, WhatsAppIcon, MailIcon } from './icons';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const { config } = useSiteConfig();
  if (!config) return null;

  const socials = [
    { href: config.github_url, icon: <GitHubIcon />, label: 'GitHub' },
    { href: config.linkedin_url, icon: <LinkedInIcon />, label: 'LinkedIn' },
    { href: config.twitter_url, icon: <TwitterIcon />, label: 'Twitter / X' },
    { href: config.whatsapp ? `https://wa.me/${config.whatsapp.replace(/[^0-9]/g, '')}` : '', icon: <WhatsAppIcon />, label: 'WhatsApp' },
    { href: config.email ? `mailto:${config.email}` : '', icon: <MailIcon />, label: 'Email' },
  ].filter((s) => s.href);

  return (
    <footer className="mt-24 border-t border-white/10 bg-night-900/40">
      <div className="container-page grid gap-10 py-14 md:grid-cols-3">
        <div>
          <Link to="/" className="flex items-center gap-1 font-display text-lg font-bold text-white">
            <span className="gradient-text">&lt;/&gt;</span>
            <span>{config.site_name}</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-slate-400">{config.tagline}</p>
          {config.email && (
            <a href={`mailto:${config.email}`} className="mt-4 inline-block text-sm text-cyan-300 hover:text-cyan-200">
              {config.email}
            </a>
          )}
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">{t('footer.quick_links')}</h4>
          <ul className="space-y-2.5 text-sm text-slate-400">
            <li><Link to="/services" className="hover:text-white">{t('footer.services')}</Link></li>
            <li><Link to="/projects" className="hover:text-white">{t('footer.portfolio')}</Link></li>
            <li><Link to="/support" className="hover:text-white">{t('footer.support')}</Link></li>
            <li><Link to="/contact" className="hover:text-white">{t('footer.contact')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">{config.site_name}</h4>
          <div className="flex gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page py-5 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} {config.site_name}. {t('footer.rights')}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
