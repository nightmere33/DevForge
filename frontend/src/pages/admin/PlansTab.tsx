import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Check } from 'lucide-react';
import { fetchPlans, createPlan, updatePlan, deletePlan } from '../../api';
import { SupportPlan } from '../../types';
import { TrashIcon, PencilIcon } from '../../components/icons';

const EMPTY: Partial<SupportPlan> = {
  name: '', description: '', price: '0', currency: 'USD', period_months: 1, features: '', popular: false, active: true, order: 0,
};

const PlansTab: React.FC = () => {
  const [items, setItems] = useState<SupportPlan[]>([]);
  const [editing, setEditing] = useState<Partial<SupportPlan> | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => fetchPlans().then((r) => setItems(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      if (editing.id) await updatePlan(editing.id, editing);
      else await createPlan(editing);
      setEditing(null);
      load();
      toast.success('Saved');
    } catch { toast.error('Could not save'); }
    finally { setSaving(false); }
  };

  const remove = async (item: SupportPlan) => {
    if (!window.confirm(`Delete plan "${item.name}"?`)) return;
    try { await deletePlan(item.id); load(); } catch { toast.error('Could not delete (it may have active subscriptions)'); }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="hidden font-display text-2xl font-bold text-white lg:block">Support Plans</h1>
        <button className="btn-primary btn-small" onClick={() => setEditing({ ...EMPTY, order: items.length })}>
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>

      {editing && (
        <form onSubmit={save} className="card mb-6 space-y-4 border-indigo-400/30 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Plan name</label>
              <input required className="input" value={editing.name || ''} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            </div>
            <div>
              <label className="label">Description</label>
              <input className="input" value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
            </div>
            <div>
              <label className="label">Price</label>
              <input required type="number" step="0.01" className="input" value={editing.price ?? '0'} onChange={(e) => setEditing({ ...editing, price: e.target.value })} />
            </div>
            <div>
              <label className="label">Currency</label>
              <input className="input" value={editing.currency || 'USD'} onChange={(e) => setEditing({ ...editing, currency: e.target.value })} />
            </div>
            <div>
              <label className="label">Billing period (months)</label>
              <input type="number" className="input" value={editing.period_months ?? 1} onChange={(e) => setEditing({ ...editing, period_months: Number(e.target.value) })} />
            </div>
            <div>
              <label className="label">Order</label>
              <input type="number" className="input" value={editing.order ?? 0} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} />
            </div>
          </div>
          <div>
            <label className="label">Features (one per line)</label>
            <textarea rows={5} className="input" value={editing.features || ''} onChange={(e) => setEditing({ ...editing, features: e.target.value })} />
          </div>
          <div className="flex gap-6">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" className="h-4 w-4 accent-indigo-500" checked={editing.popular ?? false} onChange={(e) => setEditing({ ...editing, popular: e.target.checked })} />
              Highlight as popular
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" className="h-4 w-4 accent-indigo-500" checked={editing.active ?? true} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} />
              Active (visible)
            </label>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary btn-small">{saving ? 'Saving...' : 'Save'}</button>
            <button type="button" className="btn-outline btn-small" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} className={`card p-6 ${item.popular ? 'border-indigo-400/40' : ''} ${!item.active ? 'opacity-50' : ''}`}>
            <div className="flex items-center justify-between">
              <h4 className="font-display text-lg font-semibold text-white">{item.name}</h4>
              <div className="flex gap-1.5">
                <button className="text-slate-400 hover:text-white" onClick={() => setEditing(item)}><PencilIcon /></button>
                <button className="text-slate-400 hover:text-rose-400" onClick={() => remove(item)}><TrashIcon /></button>
              </div>
            </div>
            <p className="mt-2 font-display text-2xl font-bold text-white">{item.price} {item.currency}<span className="text-sm font-normal text-slate-500">/{item.period_months}mo</span></p>
            <ul className="mt-4 space-y-1.5">
              {item.features.split('\n').filter(Boolean).map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs text-slate-400">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" /> {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
        {items.length === 0 && <p className="text-slate-400">No support plans yet.</p>}
      </div>
    </div>
  );
};

export default PlansTab;
