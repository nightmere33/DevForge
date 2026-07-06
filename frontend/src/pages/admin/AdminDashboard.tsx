import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import {
  ClipboardList, Loader, CheckCircle2, DollarSign, Users, MessageSquare, CreditCard, Mail,
} from 'lucide-react';
import { fetchAdminStats } from '../../api';
import { AdminStats } from '../../types';

const STATUS_COLORS: Record<string, string> = {
  new: '#38bdf8', contacted: '#a78bfa', in_progress: '#fbbf24',
  review: '#e879f9', delivered: '#34d399', closed: '#94a3b8', cancelled: '#fb7185',
};

const monthLabel = (m: string) => {
  const [y, mo] = m.split('-');
  return new Date(Number(y), Number(mo) - 1).toLocaleDateString('en', { month: 'short' });
};

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-night-800 px-3 py-2 text-xs shadow-xl">
      <p className="text-slate-400">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="font-semibold text-white">{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats().then((r) => setStats(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-slate-400">Loading analytics...</p>;
  if (!stats) return <p className="text-slate-400">Could not load analytics.</p>;

  const k = stats.kpis;
  const kpiCards = [
    { label: 'Total Orders', value: k.total_orders, icon: <ClipboardList className="h-5 w-5" />, color: 'text-sky-300 bg-sky-400/10' },
    { label: 'Active Orders', value: k.active_orders, icon: <Loader className="h-5 w-5" />, color: 'text-amber-300 bg-amber-400/10' },
    { label: 'Completed', value: k.completed_orders, icon: <CheckCircle2 className="h-5 w-5" />, color: 'text-emerald-300 bg-emerald-400/10' },
    { label: 'Revenue', value: `$${Number(k.total_revenue).toLocaleString()}`, icon: <DollarSign className="h-5 w-5" />, color: 'text-cyan-300 bg-cyan-400/10' },
    { label: 'Clients', value: k.clients, icon: <Users className="h-5 w-5" />, color: 'text-violet-300 bg-violet-400/10' },
    { label: 'Unread Chats', value: k.unread_messages, icon: <MessageSquare className="h-5 w-5" />, color: 'text-rose-300 bg-rose-400/10' },
    { label: 'Active Subs', value: k.active_subscriptions, icon: <CreditCard className="h-5 w-5" />, color: 'text-emerald-300 bg-emerald-400/10' },
    { label: 'New Messages', value: k.unread_contact, icon: <Mail className="h-5 w-5" />, color: 'text-indigo-300 bg-indigo-400/10' },
  ];

  const ordersData = stats.orders_by_month.map((o) => ({ month: monthLabel(o.month), Orders: o.count }));
  const revenueData = stats.revenue_by_month.map((r) => ({ month: monthLabel(r.month), Revenue: r.total }));
  const statusData = stats.status_breakdown.map((s) => ({ name: s.status, value: s.count }));

  return (
    <div className="space-y-6">
      <h1 className="hidden font-display text-2xl font-bold text-white lg:block">Business Dashboard</h1>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpiCards.map((c) => (
          <div key={c.label} className="card p-5">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.color}`}>{c.icon}</div>
            <p className="mt-3 font-display text-2xl font-bold text-white">{c.value}</p>
            <p className="text-xs text-slate-400">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Orders over time */}
        <div className="card p-6">
          <h3 className="mb-4 font-display font-semibold text-white">Orders (last 12 months)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={ordersData}>
              <defs>
                <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="Orders" stroke="#818cf8" strokeWidth={2} fill="url(#ordersGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue */}
        <div className="card p-6">
          <h3 className="mb-4 font-display font-semibold text-white">Revenue (last 12 months)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="Revenue" fill="#22d3ee" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status breakdown */}
        <div className="card p-6">
          <h3 className="mb-4 font-display font-semibold text-white">Orders by Status</h3>
          {statusData.length > 0 ? (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="55%" height={200}>
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={3}>
                    {statusData.map((s) => <Cell key={s.name} fill={STATUS_COLORS[s.name] || '#64748b'} />)}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {statusData.map((s) => (
                  <div key={s.name} className="flex items-center gap-2 text-sm">
                    <span className="h-3 w-3 rounded" style={{ background: STATUS_COLORS[s.name] }} />
                    <span className="capitalize text-slate-300">{(s.name as string).replace('_', ' ')}</span>
                    <span className="text-slate-500">({s.value})</span>
                  </div>
                ))}
              </div>
            </div>
          ) : <p className="text-sm text-slate-500">No orders yet.</p>}
        </div>

        {/* Top services */}
        <div className="card p-6">
          <h3 className="mb-4 font-display font-semibold text-white">Most Requested Services</h3>
          {stats.top_services.length > 0 ? (
            <div className="space-y-3">
              {stats.top_services.map((s, i) => {
                const max = stats.top_services[0].count;
                return (
                  <div key={i}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-slate-300">{s.service__title}</span>
                      <span className="text-slate-500">{s.count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5">
                      <div className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400" style={{ width: `${(s.count / max) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : <p className="text-sm text-slate-500">No service data yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
