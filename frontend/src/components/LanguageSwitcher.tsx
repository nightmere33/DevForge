import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import { LANGUAGES } from '../i18n';

const LanguageSwitcher: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
        aria-label="Change language"
      >
        <Globe className="h-4 w-4" />
        <span className="uppercase">{i18n.language}</span>
      </button>
      {open && (
        <div className="absolute end-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-xl border border-white/10 bg-night-800 shadow-xl">
          {LANGUAGES.map((lng) => (
            <button
              key={lng}
              onClick={() => {
                i18n.changeLanguage(lng);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition hover:bg-white/5 ${
                i18n.language === lng ? 'text-cyan-300' : 'text-slate-300'
              }`}
            >
              {t(`langs.${lng}`)}
              {i18n.language === lng && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
