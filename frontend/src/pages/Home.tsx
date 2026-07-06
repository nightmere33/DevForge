import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  ArrowRight, CheckCircle2, MessageSquare, Eye, ShieldCheck, Sparkles,
  PhoneCall, FileCheck2, Rocket, Star, ChevronDown,
} from 'lucide-react';
import { fetchServices, fetchProjects, fetchTestimonials, fetchFaqs, fetchPlans } from '../api';
import { mediaUrl } from '../api/axios';
import { Service, Project, Testimonial, FAQ, SupportPlan } from '../types';
import { useSiteConfig } from '../context/SiteConfigContext';
import { useAuth } from '../context/AuthContext';
import { Reveal, RevealGroup, RevealItem, CountUp, Stars } from '../components/ui';

const Home: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { config } = useSiteConfig();
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [plans, setPlans] = useState<SupportPlan[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const rtl = i18n.dir() === 'rtl';

  useEffect(() => {
    fetchServices().then((r) => setServices(r.data)).catch(() => {});
    fetchProjects().then((r) => setProjects(r.data)).catch(() => {});
    fetchTestimonials().then((r) => setTestimonials(r.data)).catch(() => {});
    fetchFaqs().then((r) => setFaqs(r.data)).catch(() => {});
    fetchPlans().then((r) => setPlans(r.data)).catch(() => {});
  }, []);

  if (!config) return <div className="py-32 text-center text-slate-400">{t('common.loading')}</div>;

  const orderLink = user ? '/order' : '/order';
  const featured = projects.filter((p) => p.featured);
  const shownProjects = (featured.length ? featured : projects).slice(0, 3);
  const stats = [
    { value: config.years_experience, label: t('hero.stat_years') },
    { value: config.projects_completed, label: t('hero.stat_projects') },
    { value: config.happy_clients, label: t('hero.stat_clients') },
  ];
  const trust = [t('hero.trust_1'), t('hero.trust_2'), t('hero.trust_3')];
  const guarantees = [
    { icon: <MessageSquare className="h-6 w-6" />, title: t('home.guarantee_1_title'), text: t('home.guarantee_1_text') },
    { icon: <Eye className="h-6 w-6" />, title: t('home.guarantee_2_title'), text: t('home.guarantee_2_text') },
    { icon: <ShieldCheck className="h-6 w-6" />, title: t('home.guarantee_3_title'), text: t('home.guarantee_3_text') },
  ];
  const steps = [
    { icon: <PhoneCall className="h-6 w-6" />, title: t('home.step1_title'), text: t('home.step1_text') },
    { icon: <FileCheck2 className="h-6 w-6" />, title: t('home.step2_title'), text: t('home.step2_text') },
    { icon: <Eye className="h-6 w-6" />, title: t('home.step3_title'), text: t('home.step3_text') },
    { icon: <Rocket className="h-6 w-6" />, title: t('home.step4_title'), text: t('home.step4_text') },
  ];

  return (
    <div className="overflow-hidden">
      {/* ===== HERO ===== */}
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 start-1/4 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
          <div className="absolute top-20 end-0 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl" />
        </div>
        <div className="container-page py-20 md:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="badge animate-pulse-ring border border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              {config.availability || t('hero.available')}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 font-display text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-7xl"
            >
              {t('hero.title_a')} <span className="gradient-text">{t('hero.title_b')}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mx-auto mt-6 max-w-2xl text-lg text-slate-400 md:text-xl"
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link to={orderLink} className="btn-primary w-full text-base sm:w-auto">
                {t('hero.cta_primary')} <ArrowRight className={`h-5 w-5 ${rtl ? 'rotate-180' : ''}`} />
              </Link>
              <Link to="/projects" className="btn-outline w-full text-base sm:w-auto">
                {t('hero.cta_secondary')}
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-400"
            >
              {trust.map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> {item}
                </span>
              ))}
            </motion.div>
          </div>

          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-3 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="card px-3 py-6 text-center">
                <p className="font-display text-3xl font-bold text-white md:text-5xl">
                  <CountUp value={s.value} suffix="+" />
                </p>
                <p className="mt-1 text-xs text-slate-400 md:text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== GUARANTEES ===== */}
      <section className="container-page py-16">
        <Reveal className="mb-12 text-center">
          <h2 className="section-title">{t('home.guarantee_title')}</h2>
        </Reveal>
        <RevealGroup className="grid gap-6 md:grid-cols-3">
          {guarantees.map((g) => (
            <RevealItem key={g.title} className="card card-hover p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
                {g.icon}
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-white">{g.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{g.text}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* ===== SERVICES ===== */}
      {services.length > 0 && (
        <section className="border-t border-white/5 py-20">
          <div className="container-page">
            <Reveal className="mb-12 text-center">
              <span className="badge mx-auto border border-indigo-400/30 bg-indigo-400/10 text-indigo-300">
                <Sparkles className="h-3.5 w-3.5" /> {t('nav.services')}
              </span>
              <h2 className="section-title mt-4">{t('home.services_title')}</h2>
              <p className="mx-auto mt-3 max-w-xl text-slate-400">{t('home.services_sub')}</p>
            </Reveal>
            <RevealGroup className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.slice(0, 6).map((service) => (
                <RevealItem key={service.id}>
                  <Link to={orderLink} className="card card-hover flex h-full flex-col p-8">
                    <div className="text-4xl">{service.icon || '⚡'}</div>
                    <h3 className="mt-4 font-display text-xl font-semibold text-white">{service.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">{service.description}</p>
                    {service.price_range && (
                      <p className="mt-4 text-sm font-semibold text-cyan-300">
                        {t('common.from')} {service.price_range}
                      </p>
                    )}
                  </Link>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>
      )}

      {/* ===== PROCESS ===== */}
      <section className="border-t border-white/5 bg-night-900/30 py-20">
        <div className="container-page">
          <Reveal className="mb-14 text-center">
            <h2 className="section-title">{t('home.process_title')}</h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-400">{t('home.process_sub')}</p>
          </Reveal>
          <RevealGroup className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <RevealItem key={step.title} className="relative">
                <div className="card h-full p-7">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/30 to-cyan-500/20 text-cyan-300">
                      {step.icon}
                    </div>
                    <span className="font-display text-5xl font-bold text-white/5">{i + 1}</span>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.text}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ===== PORTFOLIO ===== */}
      {shownProjects.length > 0 && (
        <section className="border-t border-white/5 py-20">
          <div className="container-page">
            <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="section-title">{t('home.portfolio_title')}</h2>
                <p className="mt-2 text-slate-400">{t('home.portfolio_sub')}</p>
              </div>
              <Link to="/projects" className="text-sm font-semibold text-cyan-300 hover:text-cyan-200">
                {t('common.view_all')} →
              </Link>
            </Reveal>
            <RevealGroup className="grid gap-6 md:grid-cols-3">
              {shownProjects.map((project) => (
                <RevealItem key={project.id}>
                  <div className="card card-hover group h-full overflow-hidden">
                    {project.image ? (
                      <div className="h-44 overflow-hidden">
                        <img
                          src={mediaUrl(project.image) || ''}
                          alt={project.title}
                          className="h-44 w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="flex h-44 items-center justify-center bg-gradient-to-br from-indigo-600/30 to-cyan-500/20 font-display text-3xl text-white/50">
                        {'</>'}
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="font-display text-lg font-semibold text-white">{project.title}</h3>
                      <p className="mt-2 text-sm text-slate-400">
                        {project.description.length > 100 ? `${project.description.slice(0, 100)}...` : project.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.technologies.split(',').slice(0, 4).map((tech) => (
                          <span key={tech} className="chip">{tech.trim()}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>
      )}

      {/* ===== TESTIMONIALS ===== */}
      {testimonials.length > 0 && (
        <section className="border-t border-white/5 bg-night-900/30 py-20">
          <div className="container-page">
            <Reveal className="mb-12 text-center">
              <div className="mx-auto flex w-fit items-center gap-1"><Stars rating={5} className="h-5 w-5" /></div>
              <h2 className="section-title mt-4">{t('home.testimonials_title')}</h2>
              <p className="mx-auto mt-3 max-w-xl text-slate-400">{t('home.testimonials_sub')}</p>
            </Reveal>
            <RevealGroup className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((tst) => (
                <RevealItem key={tst.id} className="card p-7">
                  <Stars rating={tst.rating} />
                  <p className="mt-4 text-sm leading-relaxed text-slate-300">"{tst.content}"</p>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/60 to-cyan-500/40 font-semibold text-white">
                      {tst.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{tst.name}</p>
                      {tst.role && <p className="text-xs text-slate-400">{tst.role}</p>}
                    </div>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>
      )}

      {/* ===== PLANS TEASER ===== */}
      {plans.length > 0 && (
        <section className="border-t border-white/5 py-20">
          <div className="container-page">
            <Reveal className="mb-12 text-center">
              <h2 className="section-title">{t('home.plans_title')}</h2>
              <p className="mx-auto mt-3 max-w-xl text-slate-400">{t('home.plans_sub')}</p>
            </Reveal>
            <RevealGroup className="grid gap-6 md:grid-cols-3">
              {plans.slice(0, 3).map((plan) => (
                <RevealItem key={plan.id}>
                  <div className={`card h-full p-8 ${plan.popular ? 'border-indigo-400/40 shadow-glow' : ''}`}>
                    {plan.popular && (
                      <span className="badge mb-4 border border-indigo-400/30 bg-indigo-400/10 text-indigo-300">
                        <Star className="h-3 w-3 fill-indigo-300" /> {t('support.popular')}
                      </span>
                    )}
                    <h3 className="font-display text-xl font-semibold text-white">{plan.name}</h3>
                    <p className="mt-3">
                      <span className="font-display text-4xl font-bold text-white">{plan.price} {plan.currency}</span>
                      <span className="text-slate-400"> {t('support.per_month')}</span>
                    </p>
                    <Link to="/support" className={`mt-6 w-full ${plan.popular ? 'btn-primary' : 'btn-outline'}`}>
                      {t('support.subscribe')}
                    </Link>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>
      )}

      {/* ===== FAQ ===== */}
      {faqs.length > 0 && (
        <section className="border-t border-white/5 bg-night-900/30 py-20">
          <div className="container-page mx-auto max-w-3xl">
            <Reveal className="mb-12 text-center">
              <h2 className="section-title">{t('home.faq_title')}</h2>
            </Reveal>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <Reveal key={faq.id}>
                  <div className="card overflow-hidden">
                    <button
                      className="flex w-full items-center justify-between gap-4 p-5 text-start"
                      onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                    >
                      <span className="font-medium text-white">{faq.question}</span>
                      <ChevronDown className={`h-5 w-5 shrink-0 text-slate-400 transition ${openFaq === faq.id ? 'rotate-180' : ''}`} />
                    </button>
                    {openFaq === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="overflow-hidden"
                      >
                        <p className="border-t border-white/10 p-5 text-sm leading-relaxed text-slate-400">{faq.answer}</p>
                      </motion.div>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== FINAL CTA ===== */}
      <section className="container-page py-20">
        <Reveal>
          <div className="card relative overflow-hidden px-6 py-16 text-center md:py-20">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-transparent to-cyan-500/20" />
            <div className="relative">
              <h2 className="section-title text-3xl md:text-5xl">{t('home.cta_title')}</h2>
              <p className="mx-auto mt-4 max-w-xl text-slate-300">{t('home.cta_text')}</p>
              <Link to={orderLink} className="btn-primary mt-8 text-base">
                {t('home.cta_button')} <ArrowRight className={`h-5 w-5 ${rtl ? 'rotate-180' : ''}`} />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
};

export default Home;
