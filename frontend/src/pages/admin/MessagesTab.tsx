import React, { useEffect, useState } from 'react';
import { fetchContactMessages, updateContactMessage, deleteContactMessage } from '../../api';
import { ContactMessage } from '../../types';
import { formatDate } from '../../utils/tickets';
import { TrashIcon } from '../../components/icons';

const MessagesTab: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<number | null>(null);

  const load = () =>
    fetchContactMessages()
      .then((res) => setMessages(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const toggleOpen = async (msg: ContactMessage) => {
    setOpenId(openId === msg.id ? null : msg.id);
    if (!msg.is_read) {
      try {
        await updateContactMessage(msg.id, { is_read: true });
        setMessages((all) => all.map((m) => (m.id === msg.id ? { ...m, is_read: true } : m)));
      } catch {
        // Non-critical: leave it unread
      }
    }
  };

  const handleDelete = async (msg: ContactMessage) => {
    if (!window.confirm(`Delete message from ${msg.name}?`)) return;
    try {
      await deleteContactMessage(msg.id);
      load();
    } catch {
      alert('Could not delete the message.');
    }
  };

  if (loading) return <p className="text-slate-400">Loading messages...</p>;

  const unread = messages.filter((m) => !m.is_read).length;

  return (
    <div className="max-w-3xl">
      <p className="mb-6 text-slate-400">
        {messages.length} messages from the contact form{unread > 0 && ` · ${unread} unread`}
      </p>

      {messages.length === 0 && (
        <div className="card p-16 text-center">
          <p className="text-4xl">📭</p>
          <p className="mt-4 text-slate-400">No messages yet — they'll show up here when visitors use the contact form.</p>
        </div>
      )}

      <div className="space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`card overflow-hidden ${!msg.is_read ? 'border-indigo-400/40' : ''}`}>
            <button className="flex w-full items-center gap-4 p-5 text-left" onClick={() => toggleOpen(msg)}>
              {!msg.is_read && <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-indigo-400" />}
              <div className="min-w-0 flex-1">
                <p className={`truncate font-semibold ${msg.is_read ? 'text-slate-300' : 'text-white'}`}>
                  {msg.subject}
                </p>
                <p className="truncate text-sm text-slate-500">
                  {msg.name} · {msg.email} · {formatDate(msg.created_at)}
                </p>
              </div>
              <span className="text-slate-500">{openId === msg.id ? '▲' : '▼'}</span>
            </button>
            {openId === msg.id && (
              <div className="border-t border-white/10 p-5">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">{msg.message}</p>
                <div className="mt-4 flex gap-3">
                  <a href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`} className="btn-primary btn-small">
                    Reply by Email
                  </a>
                  <button className="btn-danger btn-small" onClick={() => handleDelete(msg)}>
                    <TrashIcon /> Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessagesTab;
