import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  ArrowLeft, Paperclip, Send, ImageIcon, CheckCircle2, Clock, Sparkles, X,
} from 'lucide-react';
import { fetchTicket, postTicketMessage, updateTicket, postTicketUpdate } from '../../api';
import { mediaUrl } from '../../api/axios';
import { Ticket, TicketPriority, TicketStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';
import {
  STATUS_CLASSES, PRIORITY_CLASSES, STATUS_ORDER, formatDate, formatDay, isVideo, isImage,
} from '../../utils/tickets';
import { Avatar, ProgressBar } from '../../components/ui';

const OrderDetail: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const ticketId = Number(id);
  const { user } = useAuth();
  const navigate = useNavigate();
  const lang = i18n.language;
  const isDeveloper = user?.role === 'developer';

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'progress' | 'chat'>('progress');
  const [reply, setReply] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const threadEndRef = useRef<HTMLDivElement>(null);

  const load = useCallback((silent = false) => {
    fetchTicket(ticketId)
      .then((r) => setTicket(r.data))
      .catch(() => { if (!silent) navigate('/dashboard'); })
      .finally(() => setLoading(false));
  }, [ticketId, navigate]);

  useEffect(() => { load(); }, [load]);

  // Poll for new messages while viewing the chat
  useEffect(() => {
    if (tab !== 'chat') return;
    const iv = setInterval(() => load(true), 8000);
    return () => clearInterval(iv);
  }, [tab, load]);

  useEffect(() => {
    if (tab === 'chat') threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ticket?.messages?.length, tab]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() && !attachment) return;
    setSending(true);
    try {
      await postTicketMessage(ticketId, reply.trim(), attachment);
      setReply('');
      setAttachment(null);
      load(true);
    } catch {
      toast.error(t('common.error'));
    } finally {
      setSending(false);
    }
  };

  const patchTicket = async (data: Partial<Ticket>) => {
    try {
      const res = await updateTicket(ticketId, data);
      setTicket((tk) => (tk ? { ...tk, ...res.data } : tk));
      toast.success(t('common.saved'));
    } catch {
      toast.error(t('common.error'));
    }
  };

  if (loading || !ticket) {
    return <div className="py-32 text-center text-slate-400">{t('common.loading')}</div>;
  }

  const currentStepIndex = STATUS_ORDER.indexOf(ticket.status);
  const isClosed = ticket.status === 'closed' || ticket.status === 'cancelled';

  return (
    <div className="container-page py-10 md:py-14">
      <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white">
        <ArrowLeft className={`h-4 w-4 ${i18n.dir() === 'rtl' ? 'rotate-180' : ''}`} /> {t('orderDetail.back')}
      </Link>

      {/* Header */}
      <div className="card mt-5 p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">{t('orderDetail.order')} #{ticket.id}</p>
            <h1 className="mt-1 font-display text-2xl font-bold text-white md:text-3xl">{ticket.subject}</h1>
          </div>
          <div className="flex gap-2">
            <span className={`badge border ${STATUS_CLASSES[ticket.status]}`}>{t(`status.${ticket.status}`)}</span>
            <span className={`badge border ${PRIORITY_CLASSES[ticket.priority]}`}>{t(`priority.${ticket.priority}`)}</span>
          </div>
        </div>

        {/* Status pipeline */}
        {!isClosed && (
          <div className="mt-8">
            <div className="flex items-center justify-between">
              {STATUS_ORDER.map((st, i) => (
                <React.Fragment key={st}>
                  <div className="flex flex-col items-center gap-2">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${
                      i <= currentStepIndex ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white' : 'bg-white/5 text-slate-500'
                    }`}>
                      {i < currentStepIndex ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                    </div>
                    <span className={`hidden text-[11px] font-medium sm:block ${i <= currentStepIndex ? 'text-slate-200' : 'text-slate-600'}`}>
                      {t(`status.${st}`)}
                    </span>
                  </div>
                  {i < STATUS_ORDER.length - 1 && (
                    <div className={`mx-1 h-0.5 flex-1 rounded ${i < currentStepIndex ? 'bg-gradient-to-r from-indigo-500 to-cyan-500' : 'bg-white/10'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="mt-6">
              <div className="mb-1 flex justify-between text-xs text-slate-500">
                <span>{t('dash.progress')}</span>
                <span>{ticket.progress}%</span>
              </div>
              <ProgressBar value={ticket.progress} />
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="mb-4 flex gap-2">
            {(['progress', 'chat'] as const).map((tb) => (
              <button
                key={tb}
                onClick={() => setTab(tb)}
                className={`rounded-xl px-5 py-2.5 text-sm font-medium transition ${
                  tab === tb ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {tb === 'progress' ? t('orderDetail.tab_progress') : t('orderDetail.tab_chat')}
                {tb === 'chat' && ticket.unread_count > 0 && (
                  <span className="ms-2 rounded-full bg-rose-500 px-1.5 text-[11px] font-bold text-white">{ticket.unread_count}</span>
                )}
              </button>
            ))}
          </div>

          {tab === 'progress' ? (
            <ProgressTab ticket={ticket} lang={lang} />
          ) : (
            <div className="card flex h-[32rem] flex-col p-4 md:p-6">
              <div className="flex-1 space-y-4 overflow-y-auto pe-2">
                <div className="rounded-xl bg-white/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t('orderDetail.original_request')}</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-slate-300">{ticket.description}</p>
                </div>
                {(ticket.messages || []).map((msg) => {
                  const mine = msg.sender === user?.id;
                  return (
                    <div key={msg.id} className={`flex gap-2.5 ${mine ? 'flex-row-reverse' : ''}`}>
                      <Avatar name={msg.sender_username} className="h-8 w-8 text-xs" />
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                        mine ? 'bg-gradient-to-r from-indigo-600/70 to-indigo-500/60 text-white' : 'bg-white/5 text-slate-200'
                      }`}>
                        <p className="text-xs font-semibold opacity-70">
                          {msg.sender_username}{msg.sender_role === 'developer' && ` · ${t('orderDetail.developer')}`}
                        </p>
                        {msg.body && <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">{msg.body}</p>}
                        {msg.attachment && <AttachmentPreview url={mediaUrl(msg.attachment) || ''} />}
                        <p className="mt-1 text-end text-[11px] opacity-50">{formatDate(msg.created_at, lang)}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={threadEndRef} />
              </div>

              {!isClosed ? (
                <form onSubmit={handleReply} className="mt-4 border-t border-white/10 pt-4">
                  {attachment && (
                    <div className="mb-2 flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-xs text-slate-300">
                      <Paperclip className="h-3.5 w-3.5" /> {attachment.name}
                      <button type="button" onClick={() => setAttachment(null)} className="ms-auto text-slate-500 hover:text-white">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                  <div className="flex items-end gap-2">
                    <label className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:text-white" title={t('orderDetail.attach')}>
                      <Paperclip className="h-5 w-5" />
                      <input type="file" className="hidden" onChange={(e) => setAttachment(e.target.files?.[0] || null)} />
                    </label>
                    <textarea
                      rows={1}
                      className="input max-h-32 min-h-[44px] flex-1 resize-none py-2.5"
                      placeholder={t('orderDetail.chat_ph')}
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleReply(e); } }}
                    />
                    <button type="submit" disabled={sending || (!reply.trim() && !attachment)} className="btn-primary h-11 !px-4">
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </form>
              ) : (
                <p className="mt-4 border-t border-white/10 pt-4 text-center text-sm text-slate-500">{t('orderDetail.chat_closed')}</p>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="card p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">{t('orderDetail.details')}</h3>
            <dl className="space-y-3 text-sm">
              <Row label={t('orderDetail.client')} value={ticket.client_username} />
              {ticket.service_title && <Row label={t('orderDetail.service')} value={ticket.service_title} />}
              {ticket.budget && <Row label={t('orderDetail.budget')} value={ticket.budget} />}
              {ticket.price_agreed && <Row label={t('orderDetail.price')} value={`${ticket.price_agreed}`} />}
              {ticket.deadline && <Row label={t('orderDetail.deadline')} value={formatDay(ticket.deadline, lang)} />}
              {isDeveloper && ticket.phone && <Row label={t('orderDetail.phone')} value={ticket.phone} />}
              <Row label={t('orderDetail.created')} value={formatDay(ticket.created_at, lang)} />
            </dl>
          </div>

          {isDeveloper ? (
            <DeveloperPanel ticket={ticket} onPatch={patchTicket} onReload={() => load(true)} />
          ) : (
            <>
              {ticket.status === 'delivered' && (
                <div className="card border-indigo-400/30 p-6 text-center">
                  <Sparkles className="mx-auto h-8 w-8 text-cyan-300" />
                  <h4 className="mt-3 font-display font-semibold text-white">{t('orderDetail.support_title')}</h4>
                  <p className="mt-2 text-sm text-slate-400">{t('orderDetail.support_text')}</p>
                  <Link to="/support" className="btn-primary btn-small mt-4 w-full">{t('orderDetail.support_button')}</Link>
                </div>
              )}
              {!isClosed && ticket.status === 'new' && (
                <button
                  className="btn-outline w-full"
                  onClick={() => { if (window.confirm(t('orderDetail.cancel_confirm'))) patchTicket({ status: 'cancelled' }); }}
                >
                  {t('orderDetail.cancel_order')}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const Row: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between gap-4">
    <dt className="text-slate-500">{label}</dt>
    <dd className="text-end text-slate-200">{value}</dd>
  </div>
);

const AttachmentPreview: React.FC<{ url: string }> = ({ url }) => {
  if (isImage(url)) {
    return <a href={url} target="_blank" rel="noopener noreferrer"><img src={url} alt="attachment" className="mt-2 max-h-52 rounded-lg" /></a>;
  }
  if (isVideo(url)) {
    return <video src={url} controls className="mt-2 max-h-52 rounded-lg" />;
  }
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-xs underline opacity-80">
      <Paperclip className="h-3.5 w-3.5" /> Download file
    </a>
  );
};

const ProgressTab: React.FC<{ ticket: Ticket; lang: string }> = ({ ticket, lang }) => {
  const { t } = useTranslation();
  const updates = ticket.updates || [];
  if (updates.length === 0) {
    return (
      <div className="card flex flex-col items-center p-14 text-center">
        <Clock className="h-10 w-10 text-slate-600" />
        <p className="mt-4 max-w-sm text-sm text-slate-400">{t('orderDetail.timeline_empty')}</p>
      </div>
    );
  }
  return (
    <div className="card p-6 md:p-8">
      <div className="relative space-y-8 before:absolute before:start-[7px] before:top-2 before:h-full before:w-0.5 before:bg-white/10">
        {updates.map((up) => (
          <motion.div
            key={up.id}
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative ps-8"
          >
            <div className="absolute start-0 top-1.5 h-4 w-4 rounded-full border-2 border-cyan-400 bg-night-900" />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="font-display font-semibold text-white">{up.title}</h4>
              <span className="text-xs text-slate-500">{formatDate(up.created_at, lang)}</span>
            </div>
            {up.body && <p className="mt-1.5 whitespace-pre-wrap text-sm text-slate-400">{up.body}</p>}
            {up.attachment && (
              <div className="mt-3">
                {isVideo(up.attachment) ? (
                  <video src={mediaUrl(up.attachment) || ''} controls className="max-h-72 rounded-xl" />
                ) : (
                  <a href={mediaUrl(up.attachment) || ''} target="_blank" rel="noopener noreferrer">
                    <img src={mediaUrl(up.attachment) || ''} alt={up.title} className="max-h-72 rounded-xl" />
                  </a>
                )}
              </div>
            )}
            {up.progress > 0 && (
              <span className="mt-3 inline-flex badge border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">{up.progress}%</span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const DeveloperPanel: React.FC<{ ticket: Ticket; onPatch: (d: Partial<Ticket>) => void; onReload: () => void }> = ({
  ticket, onPatch, onReload,
}) => {
  const { t } = useTranslation();
  const [price, setPrice] = useState(ticket.price_agreed || '');
  const [progress, setProgress] = useState(ticket.progress);
  const [up, setUp] = useState({ title: '', body: '', progress: ticket.progress });
  const [file, setFile] = useState<File | null>(null);
  const [posting, setPosting] = useState(false);

  const postUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!up.title.trim()) return;
    setPosting(true);
    try {
      const data = new FormData();
      data.append('title', up.title);
      data.append('body', up.body);
      data.append('progress', String(up.progress));
      if (file) data.append('attachment', file);
      await postTicketUpdate(ticket.id, data);
      setUp({ title: '', body: '', progress: up.progress });
      setFile(null);
      toast.success(t('common.saved'));
      onReload();
    } catch {
      toast.error(t('common.error'));
    } finally {
      setPosting(false);
    }
  };

  return (
    <>
      <div className="card p-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Manage Order</h3>
        <label className="label">Status</label>
        <select className="input" value={ticket.status} onChange={(e) => onPatch({ status: e.target.value as TicketStatus })}>
          {(['new', 'contacted', 'in_progress', 'review', 'delivered', 'closed', 'cancelled'] as TicketStatus[]).map((s) => (
            <option key={s} value={s}>{t(`status.${s}`)}</option>
          ))}
        </select>
        <label className="label mt-4">Priority</label>
        <select className="input" value={ticket.priority} onChange={(e) => onPatch({ priority: e.target.value as TicketPriority })}>
          {(['low', 'medium', 'high', 'urgent'] as TicketPriority[]).map((p) => (
            <option key={p} value={p}>{t(`priority.${p}`)}</option>
          ))}
        </select>
        <label className="label mt-4">Progress: {progress}%</label>
        <input type="range" min={0} max={100} value={progress} className="w-full accent-indigo-500"
          onChange={(e) => setProgress(Number(e.target.value))}
          onMouseUp={() => onPatch({ progress })} onTouchEnd={() => onPatch({ progress })} />
        <label className="label mt-4">Agreed price</label>
        <div className="flex gap-2">
          <input className="input" placeholder="e.g. 800" value={price} onChange={(e) => setPrice(e.target.value)} />
          <button className="btn-outline btn-small" onClick={() => onPatch({ price_agreed: price })}>{t('common.save')}</button>
        </div>
      </div>

      <form onSubmit={postUpdate} className="card p-6">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
          <ImageIcon className="h-4 w-4" /> Post Progress Update
        </h3>
        <input className="input" placeholder="Update title (e.g. Homepage done)" value={up.title} onChange={(e) => setUp({ ...up, title: e.target.value })} />
        <textarea className="input mt-3" rows={2} placeholder="Details (optional)" value={up.body} onChange={(e) => setUp({ ...up, body: e.target.value })} />
        <label className="label mt-3">Progress: {up.progress}%</label>
        <input type="range" min={0} max={100} value={up.progress} className="w-full accent-indigo-500" onChange={(e) => setUp({ ...up, progress: Number(e.target.value) })} />
        <label className="mt-3 flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-400 transition hover:text-white">
          <Paperclip className="h-4 w-4" /> {file ? file.name : 'Screenshot / video'}
          <input type="file" accept="image/*,video/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </label>
        <button type="submit" disabled={posting || !up.title.trim()} className="btn-primary btn-small mt-4 w-full">
          {posting ? t('common.sending') : 'Post Update'}
        </button>
      </form>
    </>
  );
};

export default OrderDetail;
