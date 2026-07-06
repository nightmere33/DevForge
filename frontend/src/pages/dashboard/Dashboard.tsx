import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, PackageOpen, MessageSquare } from 'lucide-react';
import { fetchTickets, fetchSubscriptions } from '../../api';
import { Ticket, TicketStatus, Subscription } from '../../types';
import { STATUS_CLASSES, PRIORITY_CLASSES, SUB_STATUS_CLASSES, ACTIVE_STATUSES, formatDate, formatDay } from '../../utils/tickets';
import { Reveal, RevealGroup, RevealItem, ProgressBar, EmptyState, CardSkeleton } from '../../components/ui';

type Filter = 'all' | 'active' | 'completed';

const Dashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');
  const lang = i18n.language;

  useEffect(() => {
    Promise.all([
      fetchTickets().then((r) => setTickets(r.data)).catch(() => {}),
      fetchSubscriptions().then((r) => setSubs(r.data)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const filtered = tickets.filter((tk) => {
    if (filter === 'active') return ACTIVE_STATUSES.includes(tk.status);
    if (filter === 'completed') return (['delivered', 'closed'] as TicketStatus[]).includes(tk.status);
    return true;
  });

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: `${t('dash.all')} (${tickets.length})` },
    { key: 'active', label: `${t('dash.active')} (${tickets.filter((tk) => ACTIVE_STATUSES.includes(tk.status)).length})` },
    { key: 'completed', label: `${t('dash.completed')} (${tickets.filter((tk) => (['delivered', 'closed'] as TicketStatus[]).includes(tk.status)).length})` },
  ];

  return (
    <div className="container-page py-12 md:py-16">
      <Reveal className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">{t('dash.title')}</h1>
          <p className="mt-1 text-slate-400">{t('dash.subtitle')}</p>
        </div>
        <Link to="/order" className="btn-primary btn-small">
          <Plus className="h-4 w-4" /> {t('dash.new_order')}
        </Link>
      </Reveal>

      <div className="mt-8 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              filter === f.key
                ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white'
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        {loading && [1, 2].map((i) => <CardSkeleton key={i} />)}

        {!loading && filtered.length === 0 && (
          <EmptyState
            icon={<PackageOpen className="h-8 w-8" />}
            title={t('dash.empty_title')}
            text={t('dash.empty_text')}
            action={<Link to="/order" className="btn-primary btn-small"><Plus className="h-4 w-4" /> {t('dash.empty_button')}</Link>}
          />
        )}

        <RevealGroup className="space-y-4">
          {filtered.map((tk) => (
            <RevealItem key={tk.id}>
              <Link to={`/orders/${tk.id}`} className="card card-hover block p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-sm font-semibold text-slate-500">#{tk.id}</span>
                      <h3 className="font-display text-lg font-semibold text-white">{tk.subject}</h3>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      {tk.service_title && <span>🛠 {tk.service_title}</span>}
                      <span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" /> {tk.message_count}</span>
                      {tk.unread_count > 0 && (
                        <span className="badge border border-rose-400/30 bg-rose-400/10 text-rose-300">{tk.unread_count} new</span>
                      )}
                      <span>{t('dash.updated')} {formatDate(tk.updated_at, lang)}</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <span className={`badge border ${STATUS_CLASSES[tk.status]}`}>{t(`status.${tk.status}`)}</span>
                    <span className={`badge border ${PRIORITY_CLASSES[tk.priority]}`}>{t(`priority.${tk.priority}`)}</span>
                  </div>
                </div>
                {ACTIVE_STATUSES.includes(tk.status) && (
                  <div className="mt-4">
                    <div className="mb-1 flex justify-between text-xs text-slate-500">
                      <span>{t('dash.progress')}</span>
                      <span>{tk.progress}%</span>
                    </div>
                    <ProgressBar value={tk.progress} />
                  </div>
                )}
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>

      {/* Subscriptions */}
      {subs.length > 0 && (
        <Reveal className="mt-14">
          <h2 className="font-display text-2xl font-bold text-white">{t('dash.my_subscriptions')}</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {subs.map((sub) => (
              <div key={sub.id} className="card p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold text-white">{sub.plan_name}</h3>
                  <span className={`badge border ${SUB_STATUS_CLASSES[sub.status]}`}>{t(`support.status_${sub.status}`)}</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">
                  {sub.plan_price} {sub.plan_currency} {t('support.per_month')}
                </p>
                {sub.end_date && (
                  <p className="mt-3 text-xs text-slate-500">{t('dash.sub_until')} {formatDay(sub.end_date, lang)}</p>
                )}
              </div>
            ))}
          </div>
        </Reveal>
      )}
    </div>
  );
};

export default Dashboard;
