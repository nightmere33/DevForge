import React, { useEffect, useState } from 'react';
import { fetchServices, createService, updateService, deleteService } from '../../api';
import { Service } from '../../types';
import { PlusIcon, TrashIcon, PencilIcon } from '../../components/icons';

const EMPTY: Partial<Service> = { title: '', description: '', icon: '', price_range: '', order: 0 };

const ServicesTab: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [editing, setEditing] = useState<Partial<Service> | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => fetchServices().then((res) => setServices(res.data)).catch(console.error);

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      if (editing.id) {
        await updateService(editing.id, editing);
      } else {
        await createService(editing);
      }
      setEditing(null);
      load();
    } catch {
      alert('Could not save the service.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (service: Service) => {
    if (!window.confirm(`Delete service "${service.title}"?`)) return;
    try {
      await deleteService(service.id);
      load();
    } catch {
      alert('Could not delete the service.');
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-slate-400">{services.length} services on the site</p>
        <button className="btn-primary btn-small" onClick={() => setEditing({ ...EMPTY, order: services.length })}>
          <PlusIcon className="h-4 w-4" /> Add Service
        </button>
      </div>

      {editing && (
        <form onSubmit={handleSave} className="card mb-6 space-y-4 border-indigo-400/30 p-6">
          <h3 className="font-display text-lg font-semibold text-white">
            {editing.id ? `Edit: ${editing.title}` : 'New service'}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Title</label>
              <input required className="input" value={editing.title || ''}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </div>
            <div>
              <label className="label">Icon (emoji)</label>
              <input className="input" placeholder="🌐" value={editing.icon || ''}
                onChange={(e) => setEditing({ ...editing, icon: e.target.value })} />
            </div>
            <div>
              <label className="label">Price range</label>
              <input className="input" placeholder="$300 - $3000" value={editing.price_range || ''}
                onChange={(e) => setEditing({ ...editing, price_range: e.target.value })} />
            </div>
            <div>
              <label className="label">Display order</label>
              <input type="number" className="input" value={editing.order ?? 0}
                onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} />
            </div>
          </div>
          <div>
            <label className="label">Description</label>
            <textarea required rows={4} className="input" value={editing.description || ''}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary btn-small">
              {saving ? 'Saving...' : 'Save Service'}
            </button>
            <button type="button" className="btn-outline btn-small" onClick={() => setEditing(null)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {services.map((service) => (
          <div key={service.id} className="card flex items-center gap-4 p-5">
            <span className="text-3xl">{service.icon || '⚡'}</span>
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-white">{service.title}</h4>
              <p className="truncate text-sm text-slate-400">{service.description}</p>
              {service.price_range && <p className="text-xs text-cyan-300">{service.price_range}</p>}
            </div>
            <button className="btn-outline btn-small" onClick={() => setEditing(service)} aria-label="Edit">
              <PencilIcon />
            </button>
            <button className="btn-danger btn-small" onClick={() => handleDelete(service)} aria-label="Delete">
              <TrashIcon />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesTab;
