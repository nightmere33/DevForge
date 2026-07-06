import React, { useEffect, useState } from 'react';
import { fetchSkills, createSkill, updateSkill, deleteSkill } from '../../api';
import { Skill, SkillCategory } from '../../types';
import { PlusIcon, TrashIcon, PencilIcon } from '../../components/icons';

const CATEGORIES: { value: SkillCategory; label: string }[] = [
  { value: 'languages', label: 'Languages' },
  { value: 'web', label: 'Web & Frameworks' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'automation', label: 'Automation & Testing' },
  { value: 'embedded', label: 'Networks & Embedded' },
  { value: 'tools', label: 'Tools & Other' },
];

const EMPTY: Partial<Skill> = { name: '', category: 'tools', level: 80, order: 0 };

const SkillsTab: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [editing, setEditing] = useState<Partial<Skill> | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => fetchSkills().then((res) => setSkills(res.data)).catch(console.error);

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      if (editing.id) {
        await updateSkill(editing.id, editing);
      } else {
        await createSkill(editing);
      }
      setEditing(null);
      load();
    } catch {
      alert('Could not save the skill.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (skill: Skill) => {
    if (!window.confirm(`Delete skill "${skill.name}"?`)) return;
    try {
      await deleteSkill(skill.id);
      load();
    } catch {
      alert('Could not delete the skill.');
    }
  };

  const grouped = CATEGORIES.map((cat) => ({
    ...cat,
    skills: skills.filter((s) => s.category === cat.value),
  })).filter((g) => g.skills.length > 0);

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-slate-400">{skills.length} skills displayed on the site</p>
        <button className="btn-primary btn-small" onClick={() => setEditing({ ...EMPTY, order: skills.length })}>
          <PlusIcon className="h-4 w-4" /> Add Skill
        </button>
      </div>

      {editing && (
        <form onSubmit={handleSave} className="card mb-6 space-y-4 border-indigo-400/30 p-6">
          <h3 className="font-display text-lg font-semibold text-white">
            {editing.id ? `Edit: ${editing.name}` : 'New skill'}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Name</label>
              <input required className="input" value={editing.name || ''}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            </div>
            <div>
              <label className="label">Category</label>
              <select className="input" value={editing.category}
                onChange={(e) => setEditing({ ...editing, category: e.target.value as SkillCategory })}>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Level: {editing.level ?? 80}%</label>
              <input type="range" min={0} max={100} className="w-full accent-indigo-500"
                value={editing.level ?? 80}
                onChange={(e) => setEditing({ ...editing, level: Number(e.target.value) })} />
            </div>
            <div>
              <label className="label">Display order</label>
              <input type="number" className="input" value={editing.order ?? 0}
                onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary btn-small">
              {saving ? 'Saving...' : 'Save Skill'}
            </button>
            <button type="button" className="btn-outline btn-small" onClick={() => setEditing(null)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-6">
        {grouped.map((group) => (
          <div key={group.value} className="card p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-cyan-300">{group.label}</h3>
            <div className="space-y-2">
              {group.skills.map((skill) => (
                <div key={skill.id} className="flex items-center gap-4">
                  <span className="w-44 truncate text-sm text-slate-200">{skill.name}</span>
                  <div className="h-1.5 flex-1 rounded-full bg-white/10">
                    <div className="h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                      style={{ width: `${Math.min(skill.level, 100)}%` }} />
                  </div>
                  <span className="w-10 text-right text-xs text-slate-500">{skill.level}%</span>
                  <button className="text-slate-400 hover:text-white" onClick={() => setEditing(skill)} aria-label="Edit">
                    <PencilIcon />
                  </button>
                  <button className="text-slate-400 hover:text-rose-400" onClick={() => handleDelete(skill)} aria-label="Delete">
                    <TrashIcon />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsTab;
