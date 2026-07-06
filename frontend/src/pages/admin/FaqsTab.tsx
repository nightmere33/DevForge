import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import { fetchFaqs, createFaq, updateFaq, deleteFaq } from '../../api';
import { FAQ } from '../../types';
import { TrashIcon, PencilIcon } from '../../components/icons';

const EMPTY: Partial<FAQ> = { question: '', answer: '', order: 0 };

const FaqsTab: React.FC = () => {
  const [items, setItems] = useState<FAQ[]>([]);
  const [editing, setEditing] = useState<Partial<FAQ> | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => fetchFaqs().then((r) => setItems(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      if (editing.id) await updateFaq(editing.id, editing);
      else await createFaq(editing);
      setEditing(null);
      load();
      toast.success('Saved');
    } catch { toast.error('Could not save'); }
    finally { setSaving(false); }
  };

  const remove = async (item: FAQ) => {
    if (!window.confirm('Delete this FAQ?')) return;
    try { await deleteFaq(item.id); load(); } catch { toast.error('Could not delete'); }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="hidden font-display text-2xl font-bold text-white lg:block">FAQs</h1>
        <button className="btn-primary btn-small" onClick={() => setEditing({ ...EMPTY, order: items.length })}>
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>

      {editing && (
        <form onSubmit={save} className="card mb-6 space-y-4 border-indigo-400/30 p-6">
          <div>
            <label className="label">Question</label>
            <input required className="input" value={editing.question || ''} onChange={(e) => setEditing({ ...editing, question: e.target.value })} />
          </div>
          <div>
            <label className="label">Answer</label>
            <textarea required rows={4} className="input" value={editing.answer || ''} onChange={(e) => setEditing({ ...editing, answer: e.target.value })} />
          </div>
          <div>
            <label className="label">Order</label>
            <input type="number" className="input !w-32" value={editing.order ?? 0} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary btn-small">{saving ? 'Saving...' : 'Save'}</button>
            <button type="button" className="btn-outline btn-small" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="card p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-white">{item.question}</h4>
                <p className="mt-1.5 text-sm text-slate-400">{item.answer}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button className="btn-outline btn-small" onClick={() => setEditing(item)}><PencilIcon /></button>
                <button className="btn-danger btn-small" onClick={() => remove(item)}><TrashIcon /></button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-slate-400">No FAQs yet.</p>}
      </div>
    </div>
  );
};

export default FaqsTab;
