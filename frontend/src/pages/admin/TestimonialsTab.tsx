import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import { fetchTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../../api';
import { Testimonial } from '../../types';
import { TrashIcon, PencilIcon } from '../../components/icons';
import { Stars } from '../../components/ui';

const EMPTY: Partial<Testimonial> = { name: '', role: '', content: '', rating: 5, approved: true, order: 0 };

const TestimonialsTab: React.FC = () => {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => fetchTestimonials().then((r) => setItems(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      if (editing.id) await updateTestimonial(editing.id, editing);
      else await createTestimonial(editing);
      setEditing(null);
      load();
      toast.success('Saved');
    } catch { toast.error('Could not save'); }
    finally { setSaving(false); }
  };

  const remove = async (item: Testimonial) => {
    if (!window.confirm(`Delete testimonial from ${item.name}?`)) return;
    try { await deleteTestimonial(item.id); load(); } catch { toast.error('Could not delete'); }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="hidden font-display text-2xl font-bold text-white lg:block">Testimonials</h1>
        <button className="btn-primary btn-small" onClick={() => setEditing({ ...EMPTY })}>
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>

      {editing && (
        <form onSubmit={save} className="card mb-6 space-y-4 border-indigo-400/30 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Client name</label>
              <input required className="input" value={editing.name || ''} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            </div>
            <div>
              <label className="label">Role / company</label>
              <input className="input" placeholder="Founder, TechShop" value={editing.role || ''} onChange={(e) => setEditing({ ...editing, role: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Testimonial</label>
            <textarea required rows={3} className="input" value={editing.content || ''} onChange={(e) => setEditing({ ...editing, content: e.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="label">Rating: {editing.rating}★</label>
              <input type="range" min={1} max={5} className="w-full accent-indigo-500" value={editing.rating ?? 5} onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })} />
            </div>
            <div>
              <label className="label">Order</label>
              <input type="number" className="input" value={editing.order ?? 0} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} />
            </div>
            <label className="mt-7 flex cursor-pointer items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" className="h-4 w-4 accent-indigo-500" checked={editing.approved ?? false} onChange={(e) => setEditing({ ...editing, approved: e.target.checked })} />
              Show on site
            </label>
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
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-white">{item.name}</span>
                  {item.role && <span className="text-xs text-slate-500">{item.role}</span>}
                  {!item.approved && <span className="badge border border-amber-400/30 bg-amber-400/10 text-amber-300">Hidden</span>}
                </div>
                <Stars rating={item.rating} className="mt-1.5 h-3.5 w-3.5" />
                <p className="mt-2 text-sm text-slate-400">{item.content}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button className="btn-outline btn-small" onClick={() => setEditing(item)}><PencilIcon /></button>
                <button className="btn-danger btn-small" onClick={() => remove(item)}><TrashIcon /></button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-slate-400">No testimonials yet. Add your first client review to build trust.</p>}
      </div>
    </div>
  );
};

export default TestimonialsTab;
