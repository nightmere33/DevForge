import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchServices } from '../api';
import { Service } from '../types';
import { Reveal, RevealGroup, RevealItem, CardSkeleton } from '../components/ui';
import { ArrowRight } from 'lucide-react';

const Services: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const rtl = i18n.dir() === 'rtl';

  useEffect(() => {
    fetchServices().then((r) => setServices(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="container-page py-16 md:py-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-4xl font-bold text-white md:text-5xl">
          {t('services.title_a')} <span className="gradient-text">{t('services.title_b')}</span>
        </h1>
        <p className="mt-4 text-lg text-slate-400">{t('services.subtitle')}</p>
      </Reveal>

      {loading ? (
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <RevealGroup className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <RevealItem key={service.id} className="card card-hover flex flex-col p-8">
              <div className="text-4xl">{service.icon || '⚡'}</div>
              <h3 className="mt-4 font-display text-xl font-semibold text-white">{service.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">{service.description}</p>
              {service.price_range && (
                <p className="mt-4 text-sm font-semibold text-cyan-300">
                  {t('common.from')} {service.price_range}
                </p>
              )}
              <Link to="/order" className="btn-outline btn-small mt-6">
                {t('services.order')} <ArrowRight className={`h-4 w-4 ${rtl ? 'rotate-180' : ''}`} />
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      )}

      {!loading && services.length === 0 && (
        <p className="mt-16 text-center text-slate-400">{t('services.empty')}</p>
      )}
    </div>
  );
};

export default Services;
