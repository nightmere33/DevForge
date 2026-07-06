import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { ArrowRight, ArrowLeft, Check, CheckCircle2, Lock } from 'lucide-react';
import { fetchServices, createTicket } from '../api';
import { Service, TicketPriority } from '../types';
import { useAuth } from '../context/AuthContext';
import { Reveal } from '../components/ui';

const BUDGET_OPTIONS = ['< $300', '$300 - $1000', '$1000 - $3000', '$3000 - $8000', '> $8000'];

const OrderWizard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [params] = useSearchParams();
  const rtl = i18n.dir() === 'rtl';

  const [services, setServices] = useState<Service[]>([]);
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [createdId, setCreatedId] = useState<number | null>(null);
  const [form, setForm] = useState({
    service: params.get('service') || '',
    subject: '',
    description: '',
    budget: '',
    deadline: '',
    priority: 'medium' as TicketPriority,
    phone: '',
    whatsapp: '',
    whatsappSame: true,
  });

  useEffect(() => {
    fetchServices().then((r) => setServices(r.data)).catch(() => {});
  }, []);

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const steps = [t('order.step1'), t('order.step2'), t('order.step3')];
  const canNext = useMemo(() => {
    if (step === 0) return true;
    if (step === 1) return form.subject.trim() && form.description.trim();
    if (step === 2) return form.phone.trim();
    return false;
  }, [step, form]);

  const submit = async () => {
    setSaving(true);
    try {
      const res = await createTicket({
        subject: form.subject,
        description: form.description,
        service: form.service ? Number(form.service) : null,
        budget: form.budget === t('order.budget_na') ? '' : form.budget,
        deadline: form.deadline || null,
        priority: form.priority,
        phone: form.phone,
        whatsapp: form.whatsappSame ? form.phone : form.whatsapp,
      });
      setCreatedId(res.data.id);
    } catch {
      toast.error(t('common.error'));
    } finally {
      setSaving(false);
    }
  };

  // Guests must create an account first
  if (!user) {
    return (
      <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
        <Reveal className="card max-w-md p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-300">
            <Lock className="h-7 w-7" />
          </div>
          <h1 className="mt-5 font-display text-2xl font-bold text-white">{t('order.title')}</h1>
          <p className="mt-3 text-slate-400">{t('order.login_first')}</p>
          <div className="mt-8 flex flex-col gap-3">
            <Link to="/register" state={{ from: `/order${params.toString() ? `?${params}` : ''}` }} className="btn-primary">
              {t('auth.register')}
            </Link>
            <Link to="/login" state={{ from: `/order${params.toString() ? `?${params}` : ''}` }} className="btn-outline">
              {t('auth.login')}
            </Link>
          </div>
        </Reveal>
      </div>
    );
  }

  if (createdId) {
    return (
      <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
        <Reveal className="card max-w-lg p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <h1 className="mt-6 font-display text-3xl font-bold text-white">{t('order.success_title')}</h1>
          <p className="mt-3 text-slate-400">{t('order.success_text')}</p>
          <Link to={`/orders/${createdId}`} className="btn-primary mt-8">
            {t('order.success_button')} <ArrowRight className={`h-5 w-5 ${rtl ? 'rotate-180' : ''}`} />
          </Link>
        </Reveal>
      </div>
    );
  }

  return (
    <div className="container-page py-12 md:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold text-white md:text-4xl">{t('order.title')}</h1>
          <p className="mt-2 text-slate-400">{t('order.subtitle')}</p>
        </div>

        {/* Stepper */}
        <div className="mt-10 flex items-center justify-center">
          {steps.map((label, i) => (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold transition ${
                  i < step ? 'border-emerald-400 bg-emerald-400/20 text-emerald-300'
                  : i === step ? 'border-indigo-400 bg-indigo-400/20 text-white'
                  : 'border-white/15 text-slate-500'
                }`}>
                  {i < step ? <Check className="h-5 w-5" /> : i + 1}
                </div>
                <span className={`mt-2 text-xs font-medium ${i === step ? 'text-white' : 'text-slate-500'}`}>{label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`mx-2 mb-5 h-0.5 w-12 rounded transition sm:w-20 ${i < step ? 'bg-emerald-400/50' : 'bg-white/10'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="card mt-8 p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {step === 0 && (
                <div>
                  <h2 className="font-display text-xl font-semibold text-white">{t('order.step1_title')}</h2>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {services.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => set('service', String(s.id))}
                        className={`flex items-center gap-3 rounded-xl border p-4 text-start transition ${
                          form.service === String(s.id)
                            ? 'border-indigo-400/60 bg-indigo-400/10'
                            : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                        }`}
                      >
                        <span className="text-2xl">{s.icon || '⚡'}</span>
                        <span className="text-sm font-medium text-white">{s.title}</span>
                      </button>
                    ))}
                    <button
                      onClick={() => set('service', '')}
                      className={`flex items-center gap-3 rounded-xl border p-4 text-start transition ${
                        form.service === ''
                          ? 'border-indigo-400/60 bg-indigo-400/10'
                          : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                      }`}
                    >
                      <span className="text-2xl">💬</span>
                      <span className="text-sm font-medium text-white">{t('order.service_other')}</span>
                    </button>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-5">
                  <h2 className="font-display text-xl font-semibold text-white">{t('order.step2_title')}</h2>
                  <div>
                    <label className="label">{t('order.subject')}</label>
                    <input className="input" placeholder={t('order.subject_ph')} value={form.subject} onChange={(e) => set('subject', e.target.value)} />
                  </div>
                  <div>
                    <label className="label">{t('order.description')}</label>
                    <textarea rows={6} className="input resize-none" placeholder={t('order.description_ph')} value={form.description} onChange={(e) => set('description', e.target.value)} />
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="label">{t('order.budget')}</label>
                      <select className="input" value={form.budget} onChange={(e) => set('budget', e.target.value)}>
                        <option value="">{t('order.budget_ph')}</option>
                        {BUDGET_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
                        <option value={t('order.budget_na')}>{t('order.budget_na')}</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">{t('order.deadline')} <span className="text-slate-500">({t('common.optional')})</span></label>
                      <input type="date" className="input" value={form.deadline} onChange={(e) => set('deadline', e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <h2 className="font-display text-xl font-semibold text-white">{t('order.step3_title')}</h2>
                  <div>
                    <label className="label">{t('order.phone')}</label>
                    <input className="input" placeholder="+213 ..." value={form.phone} onChange={(e) => set('phone', e.target.value)} />
                    <p className="mt-1.5 text-xs text-slate-500">{t('order.phone_hint')}</p>
                  </div>
                  <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-300">
                    <input type="checkbox" className="h-4 w-4 accent-indigo-500" checked={form.whatsappSame} onChange={(e) => set('whatsappSame', e.target.checked)} />
                    {t('order.whatsapp_same')}
                  </label>
                  {!form.whatsappSame && (
                    <div>
                      <label className="label">{t('order.whatsapp')}</label>
                      <input className="input" placeholder="+213 ..." value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} />
                    </div>
                  )}

                  {/* Review summary */}
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">{t('order.review')}</p>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between gap-4">
                        <dt className="text-slate-500">{t('order.subject')}</dt>
                        <dd className="text-end text-slate-200">{form.subject || '—'}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-slate-500">{t('orderDetail.service')}</dt>
                        <dd className="text-end text-slate-200">
                          {services.find((s) => String(s.id) === form.service)?.title || t('order.service_other')}
                        </dd>
                      </div>
                      {form.budget && (
                        <div className="flex justify-between gap-4">
                          <dt className="text-slate-500">{t('order.budget')}</dt>
                          <dd className="text-end text-slate-200">{form.budget}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between gap-3">
            {step > 0 ? (
              <button className="btn-outline btn-small" onClick={() => setStep(step - 1)}>
                <ArrowLeft className={`h-4 w-4 ${rtl ? 'rotate-180' : ''}`} /> {t('common.previous')}
              </button>
            ) : <span />}
            {step < 2 ? (
              <button className="btn-primary" disabled={!canNext} onClick={() => setStep(step + 1)}>
                {t('common.next')} <ArrowRight className={`h-4 w-4 ${rtl ? 'rotate-180' : ''}`} />
              </button>
            ) : (
              <button className="btn-primary" disabled={!canNext || saving} onClick={submit}>
                {saving ? t('order.submitting') : t('order.submit')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderWizard;
