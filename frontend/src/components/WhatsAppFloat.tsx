import React from 'react';
import { useSiteConfig } from '../context/SiteConfigContext';
import { WhatsAppIcon } from './icons';

/** Floating WhatsApp button — a proven conversion booster for MENA clients. */
const WhatsAppFloat: React.FC = () => {
  const { config } = useSiteConfig();
  if (!config?.whatsapp) return null;

  return (
    <a
      href={`https://wa.me/${config.whatsapp.replace(/[^0-9]/g, '')}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 end-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 transition hover:scale-110 hover:bg-emerald-400 animate-pulse-ring"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
};

export default WhatsAppFloat;
