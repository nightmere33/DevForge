import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Mail } from 'lucide-react';
import { fetchSubscriptions, updateSubscription } from '../../api';
import { Subscription, SubscriptionStatus } from '../../types';
import { SUB_STATUS_CLASSES, formatDay } from '../../utils/tickets';

const SubscriptionsTab: React.FC = () => {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => fetchSubscriptions().then((r) => setSubs(r.data)).catch(() => {}).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const patch = async (id: number, data: Partial<Subscription>) => {
    try {
      const res = await updateSubscription(id, data);
      setSubs((all) => all.map((s) => (s.id === id ? { ...s, ...res.data } : s)));
      toast.success('Updated');
    } catch {
      toast.error('Could not update');
    }
  };

  const activate = (sub: Subscription) => {
    const start = new Date();
    const end = new Date();
    end.setMonth(end.getMonth() + sub.plan_period_months);
    patch(sub.id, {
      status: 'active',
      start_date: start.toISOString().slice(0, 10),
      end_date: end.toISOString().slice(0, 10),
    });
  };

  if (loading) return <p className="text-slate-400">Loading subscriptions...</p>;

  return (
    <div>
      <h1 className="mb-6 hidden font-display text-2xl font-bold text-white lg:block">Subscriptions</h1>
      {subs.length === 0 ? (
        <div className="card p-14 text-center text-slate-400">No subscription requests yet.</div>
      ) : (
        <div className="space-y-3">
          {subs.map((sub) => (
            <div key={sub.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-white">{sub.plan_name}</h3>
                    <span className="text-sm text-cyan-300">{sub.plan_price} {sub.plan_currency}/{sub.plan_period_months}mo</span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span>👤 {sub.client_username}</span>
                    {sub.client_email && (
                      <a href={`mailto:${sub.client_email}`} className="flex items-center gap-1 text-cyan-300 hover:text-cyan-200">
                        <Mail className="h-3 w-3" /> {sub.client_email}
                      </a>
                    )}
                    {sub.start_date && <span>{formatDay(sub.start_date)} → {formatDay(sub.end_date)}</span>}
                  </div>
                  {sub.note && <p className="mt-2 rounded-lg bg-white/5 p-3 text-sm text-slate-300">{sub.note}</p>}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span className={`badge border ${SUB_STATUS_CLASSES[sub.status]}`}>{sub.status}</span>
                  <select
                    className="input !w-auto !py-1.5 text-sm"
                    value={sub.status}
                    onChange={(e) => {
                      const val = e.target.value as SubscriptionStatus;
                      if (val === 'active' && sub.status !== 'active') activate(sub);
                      else patch(sub.id, { status: val });
                    }}
                  >
                    <option value="requested">Requested</option>
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubscriptionsTab;
