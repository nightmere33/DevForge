import { TicketStatus, TicketPriority, SubscriptionStatus } from '../types';

export const STATUS_ORDER: TicketStatus[] = ['new', 'contacted', 'in_progress', 'review', 'delivered'];

export const STATUS_CLASSES: Record<TicketStatus, string> = {
  new: 'border-sky-400/30 bg-sky-400/10 text-sky-300',
  contacted: 'border-violet-400/30 bg-violet-400/10 text-violet-300',
  in_progress: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
  review: 'border-fuchsia-400/30 bg-fuchsia-400/10 text-fuchsia-300',
  delivered: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  closed: 'border-slate-400/30 bg-slate-400/10 text-slate-400',
  cancelled: 'border-rose-400/30 bg-rose-400/10 text-rose-300',
};

export const PRIORITY_CLASSES: Record<TicketPriority, string> = {
  low: 'border-slate-400/30 bg-slate-400/10 text-slate-300',
  medium: 'border-sky-400/30 bg-sky-400/10 text-sky-300',
  high: 'border-orange-400/30 bg-orange-400/10 text-orange-300',
  urgent: 'border-rose-400/30 bg-rose-400/10 text-rose-300',
};

export const SUB_STATUS_CLASSES: Record<SubscriptionStatus, string> = {
  requested: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
  active: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  expired: 'border-slate-400/30 bg-slate-400/10 text-slate-400',
  cancelled: 'border-rose-400/30 bg-rose-400/10 text-rose-300',
};

export const ACTIVE_STATUSES: TicketStatus[] = ['new', 'contacted', 'in_progress', 'review'];

export const formatDate = (iso: string | null, locale = 'en') => {
  if (!iso) return '—';
  return new Date(iso).toLocaleString(locale, {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
};

export const formatDay = (iso: string | null, locale = 'en') => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
};

export const isVideo = (url: string) => /\.(mp4|webm|mov|m4v|ogg)(\?|$)/i.test(url);
export const isImage = (url: string) => /\.(png|jpe?g|gif|webp|avif|svg)(\?|$)/i.test(url);
