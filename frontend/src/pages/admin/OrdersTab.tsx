import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Phone } from 'lucide-react';
import { fetchTickets } from '../../api';
import { Ticket, TicketStatus } from '../../types';
import { STATUS_CLASSES, PRIORITY_CLASSES, ACTIVE_STATUSES, formatDate } from '../../utils/tickets';

type Filter = 'all' | 'active' | TicketStatus;

const OrdersTab: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    fetchTickets().then((r) => setTickets(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = tickets.filter((t) => {
    if (filter === 'all') return true;
    if (filter === 'active') return ACTIVE_STATUSES.includes(t.status);
    return t.status === filter;
  });

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: `All (${tickets.length})` },
    { key: 'active', label: `Active (${tickets.filter((t) => ACTIVE_STATUSES.includes(t.status)).length})` },
    { key: 'new', label: `New (${tickets.filter((t) => t.status === 'new').length})` },
    { key: 'delivered', label: `Delivered (${tickets.filter((t) => t.status === 'delivered').length})` },
  ];

  if (loading) return <p className="text-slate-400">Loading orders...</p>;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="hidden font-display text-2xl font-bold text-white lg:block">Orders</h1>
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                filter === f.key ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-14 text-center text-slate-400">No orders in this view.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((t) => (
            <div key={t.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-slate-500">#{t.id}</span>
                    <h3 className="font-semibold text-white">{t.subject}</h3>
                    {t.unread_count > 0 && (
                      <span className="badge border border-rose-400/30 bg-rose-400/10 text-rose-300">{t.unread_count} new</span>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span>👤 {t.client_username}</span>
                    {t.phone && (
                      <a href={`tel:${t.phone}`} className="flex items-center gap-1 text-cyan-300 hover:text-cyan-200">
                        <Phone className="h-3 w-3" /> {t.phone}
                      </a>
                    )}
                    {t.service_title && <span>🛠 {t.service_title}</span>}
                    {t.budget && <span>💰 {t.budget}</span>}
                    <span>{formatDate(t.updated_at)}</span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className={`badge border ${STATUS_CLASSES[t.status]}`}>{t.status.replace('_', ' ')}</span>
                  <span className={`badge border ${PRIORITY_CLASSES[t.priority]}`}>{t.priority}</span>
                  <Link to={`/orders/${t.id}`} className="btn-outline btn-small">
                    Open <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
              {ACTIVE_STATUSES.includes(t.status) && (
                <div className="mt-3 h-1.5 rounded-full bg-white/5">
                  <div className="h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400" style={{ width: `${t.progress}%` }} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersTab;
