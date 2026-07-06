import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Check, Star, X, CheckCircle2, Headset } from 'lucide-react';
import { fetchPlans, createSubscription } from '../api';
import { SupportPlan } from '../types';
import { useAuth } from '../context/AuthContext';
import { Reveal, RevealGroup, RevealItem, CardSkeleton } from '../components/ui';

const Support: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<SupportPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalPlan, setModalPlan] = useState<SupportPlan | null>(null);
  const [note, setNote] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    fetchPlans().then((r) => setPlans(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const openSubscribe = (plan: SupportPlan) => {
    if (!user) {
      navigate('/login', { state: { from: '/support' } });
      return;
    }
    setModalPlan(plan);
    setNote('');
    setDone(false);
  };

  const subscribe = async () => {
    if (!modalPlan) return;
    setSending(true);
    try {
      await createSubscription(modalPlan.id, note);
      setDone(true);
    } catch {
      toast.error(t('common.error'));
    } finally {
      setSending(false);
    }
  };

  const how = [
    { icon: <Check className="h-6 w-6" />, text: t('support.how_1') },
    { icon: <Headset className="h-6 w-6" />, text: t('support.how_2') },
    { icon: <Star className="h-6 w-6" />, text: t('support.how_3') },
  ];

  return (
    <div className="container-page py-16 md:py-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-4xl font-bold text-white md:text-5xl">
          {t('support.title_a')} <span className="gradient-text">{t('support.title_b')}</span>
        </h1>
        <p className="mt-4 text-lg text-slate-400">{t('support.subtitle')}</p>
      </Reveal>

      {loading ? (
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <RevealGroup className="mt-16 grid items-stretch gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <RevealItem key={plan.id} className="h-full">
              <div className={`card flex h-full flex-col p-8 ${plan.popular ? 'border-indigo-400/50 shadow-glow' : ''}`}>
                {plan.popular && (
                  <span className="badge mb-4 w-fit border border-indigo-400/30 bg-indigo-400/10 text-indigo-300">
                    <Star className="h-3 w-3 fill-indigo-300" /> {t('support.popular')}
                  </span>
                )}
                <h3 className="font-display text-xl font-semibold text-white">{plan.name}</h3>
                <p className="mt-2 text-sm text-slate-400">{plan.description}</p>
                <p className="mt-5">
                  <span className="font-display text-4xl font-bold text-white">{plan.price} {plan.currency}</span>
                  <span className="text-slate-400"> {t('support.per_month')}</span>
                </p>
                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.split('\n').filter(Boolean).map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" /> {f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => openSubscribe(plan)} className={`mt-8 w-full ${plan.popular ? 'btn-primary' : 'btn-outline'}`}>
                  {t('support.subscribe')}
                </button>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      )}

      {/* How it works */}
      <Reveal className="mt-24">
        <h2 className="section-title text-center">{t('support.how_title')}</h2>
        <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-3">
          {how.map((h, i) => (
            <div key={i} className="card p-7 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">{h.icon}</div>
              <p className="mt-4 text-sm text-slate-300">{h.text}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Subscribe modal */}
      <AnimatePresence>
        {modalPlan && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={() => setModalPlan(null)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.94, opacity: 0 }}
              className="card w-full max-w-md p-8"
              onClick={(e) => e.stopPropagation()}
            >
              {done ? (
                <div className="py-6 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-bold text-white">{t('support.requested_title')}</h3>
                  <p className="mt-2 text-sm text-slate-400">{t('support.requested_text')}</p>
                  <button className="btn-primary mt-6 w-full" onClick={() => setModalPlan(null)}>{t('common.close')}</button>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-display text-xl font-bold text-white">{modalPlan.name}</h3>
                      <p className="text-sm text-cyan-300">{modalPlan.price} {modalPlan.currency} {t('support.per_month')}</p>
                    </div>
                    <button onClick={() => setModalPlan(null)} className="text-slate-500 hover:text-white"><X className="h-5 w-5" /></button>
                  </div>
                  <label className="label mt-6">{t('support.note_title')}</label>
                  <textarea rows={4} className="input resize-none" placeholder={t('support.note_ph')} value={note} onChange={(e) => setNote(e.target.value)} />
                  <button onClick={subscribe} disabled={sending} className="btn-primary mt-5 w-full">
                    {sending ? t('common.sending') : t('support.request')}
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Support;
