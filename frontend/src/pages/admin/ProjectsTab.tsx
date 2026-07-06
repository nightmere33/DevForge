import React, { useEffect, useState } from 'react';
import { fetchProjects, createProject, updateProject, deleteProject } from '../../api';
import { mediaUrl } from '../../api/axios';
import { Project } from '../../types';
import { PlusIcon, TrashIcon, PencilIcon } from '../../components/icons';

interface Draft {
  id?: number;
  title: string;
  description: string;
  technologies: string;
  github_link: string;
  demo_link: string;
  featured: boolean;
}

const EMPTY: Draft = { title: '', description: '', technologies: '', github_link: '', demo_link: '', featured: false };

const ProjectsTab: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Draft | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => fetchProjects().then((res) => setProjects(res.data)).catch(console.error);

  useEffect(() => {
    load();
  }, []);

  const startEdit = (p?: Project) => {
    setImage(null);
    setEditing(
      p
        ? {
            id: p.id, title: p.title, description: p.description, technologies: p.technologies,
            github_link: p.github_link, demo_link: p.demo_link, featured: p.featured,
          }
        : { ...EMPTY }
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      const data = new FormData();
      data.append('title', editing.title);
      data.append('description', editing.description);
      data.append('technologies', editing.technologies);
      data.append('github_link', editing.github_link);
      data.append('demo_link', editing.demo_link);
      data.append('featured', String(editing.featured));
      if (image) data.append('image', image);
      if (editing.id) {
        await updateProject(editing.id, data);
      } else {
        await createProject(data);
      }
      setEditing(null);
      setImage(null);
      load();
    } catch {
      alert('Could not save the project.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (project: Project) => {
    if (!window.confirm(`Delete project "${project.title}"?`)) return;
    try {
      await deleteProject(project.id);
      load();
    } catch {
      alert('Could not delete the project.');
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-slate-400">{projects.length} projects in the portfolio</p>
        <button className="btn-primary btn-small" onClick={() => startEdit()}>
          <PlusIcon className="h-4 w-4" /> Add Project
        </button>
      </div>

      {editing && (
        <form onSubmit={handleSave} className="card mb-6 space-y-4 border-indigo-400/30 p-6">
          <h3 className="font-display text-lg font-semibold text-white">
            {editing.id ? `Edit: ${editing.title}` : 'New project'}
          </h3>
          <div>
            <label className="label">Title</label>
            <input required className="input" value={editing.title}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea required rows={4} className="input" value={editing.description}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
          </div>
          <div>
            <label className="label">Technologies (comma separated)</label>
            <input required className="input" placeholder="React, Django, PostgreSQL" value={editing.technologies}
              onChange={(e) => setEditing({ ...editing, technologies: e.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">GitHub link (optional)</label>
              <input className="input" value={editing.github_link}
                onChange={(e) => setEditing({ ...editing, github_link: e.target.value })} />
            </div>
            <div>
              <label className="label">Live demo link (optional)</label>
              <input className="input" value={editing.demo_link}
                onChange={(e) => setEditing({ ...editing, demo_link: e.target.value })} />
            </div>
          </div>
          <div className="grid items-end gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Screenshot / cover image</label>
              <input
                type="file"
                accept="image/*"
                className="block w-full text-sm text-slate-400 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-500/20 file:px-4 file:py-2 file:text-sm file:font-medium file:text-indigo-200"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
              />
            </div>
            <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-300">
              <input
                type="checkbox"
                className="h-4 w-4 accent-indigo-500"
                checked={editing.featured}
                onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
              />
              Featured on home page ★
            </label>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary btn-small">
              {saving ? 'Saving...' : 'Save Project'}
            </button>
            <button type="button" className="btn-outline btn-small" onClick={() => setEditing(null)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {projects.map((project) => (
          <div key={project.id} className="card flex items-center gap-4 p-4">
            {project.image ? (
              <img src={mediaUrl(project.image) || ''} alt={project.title}
                className="h-16 w-24 rounded-lg object-cover" />
            ) : (
              <div className="flex h-16 w-24 items-center justify-center rounded-lg bg-white/5 text-slate-500">
                {'</>'}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-white">
                {project.title} {project.featured && <span className="text-amber-300">★</span>}
              </h4>
              <p className="truncate text-sm text-slate-400">{project.technologies}</p>
            </div>
            <button className="btn-outline btn-small" onClick={() => startEdit(project)} aria-label="Edit">
              <PencilIcon />
            </button>
            <button className="btn-danger btn-small" onClick={() => handleDelete(project)} aria-label="Delete">
              <TrashIcon />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsTab;
