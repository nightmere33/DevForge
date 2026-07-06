import React, { useEffect, useState } from 'react';
import { updateConfig } from '../../api';
import { mediaUrl } from '../../api/axios';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { SiteConfig } from '../../types';

type TextField = {
  name: keyof SiteConfig;
  label: string;
  type?: 'text' | 'textarea' | 'number' | 'email';
  hint?: string;
};

const SECTIONS: { title: string; fields: TextField[] }[] = [
  {
    title: 'Branding & Hero',
    fields: [
      { name: 'site_name', label: 'Site name' },
      { name: 'tagline', label: 'Tagline' },
      { name: 'hero_title', label: 'Hero title' },
      { name: 'hero_subtitle', label: 'Hero subtitle', type: 'textarea' },
      { name: 'hero_cta_text', label: 'Hero button text' },
      { name: 'availability', label: 'Availability badge', hint: 'e.g. "Available for freelance work" — leave empty to hide' },
    ],
  },
  {
    title: 'Home Page Stats',
    fields: [
      { name: 'years_experience', label: 'Years of experience', type: 'number' },
      { name: 'projects_completed', label: 'Projects completed', type: 'number' },
      { name: 'happy_clients', label: 'Happy clients', type: 'number' },
    ],
  },
  {
    title: 'About Section',
    fields: [
      { name: 'about_title', label: 'About title' },
      { name: 'about_text', label: 'About text', type: 'textarea', hint: 'Each line becomes a paragraph' },
    ],
  },
  {
    title: 'Contact Information',
    fields: [
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'phone', label: 'Phone' },
      { name: 'location', label: 'Location' },
      { name: 'whatsapp', label: 'WhatsApp number', hint: 'With country code, e.g. +213...' },
    ],
  },
  {
    title: 'Social Links',
    fields: [
      { name: 'github_url', label: 'GitHub URL' },
      { name: 'linkedin_url', label: 'LinkedIn URL' },
      { name: 'twitter_url', label: 'Twitter / X URL' },
      { name: 'fiverr_url', label: 'Fiverr URL' },
      { name: 'upwork_url', label: 'Upwork URL' },
    ],
  },
  {
    title: 'Footer',
    fields: [{ name: 'footer_text', label: 'Footer text' }],
  },
];

const SiteSettingsTab: React.FC = () => {
  const { config, refresh } = useSiteConfig();
  const [form, setForm] = useState<Partial<SiteConfig>>({});
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (config) setForm(config);
  }, [config]);

  if (!config) return <p className="text-slate-400">Loading...</p>;

  const handleChange = (name: keyof SiteConfig, value: string) =>
    setForm((f) => ({ ...f, [name]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const data = new FormData();
      SECTIONS.forEach((section) =>
        section.fields.forEach((field) => {
          const value = form[field.name];
          data.append(field.name, value === null || value === undefined ? '' : String(value));
        })
      );
      if (profileImage) data.append('profile_image', profileImage);
      if (cvFile) data.append('cv_file', cvFile);
      await updateConfig(data);
      await refresh();
      setProfileImage(null);
      setCvFile(null);
      setMessage('✅ Saved! The whole website is updated.');
    } catch {
      setMessage('❌ Could not save — check the values and try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {SECTIONS.map((section) => (
        <div key={section.title} className="card p-6 md:p-8">
          <h2 className="mb-5 font-display text-lg font-semibold text-white">{section.title}</h2>
          <div className="space-y-4">
            {section.fields.map((field) => (
              <div key={field.name}>
                <label htmlFor={field.name} className="label">{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea
                    id={field.name}
                    rows={5}
                    className="input"
                    value={String(form[field.name] ?? '')}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                  />
                ) : (
                  <input
                    id={field.name}
                    type={field.type || 'text'}
                    className="input"
                    value={String(form[field.name] ?? '')}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                  />
                )}
                {field.hint && <p className="mt-1 text-xs text-slate-500">{field.hint}</p>}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="card p-6 md:p-8">
        <h2 className="mb-5 font-display text-lg font-semibold text-white">Files</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="label">Profile photo</label>
            {config.profile_image && !profileImage && (
              <img
                src={mediaUrl(config.profile_image) || ''}
                alt="Current profile"
                className="mb-3 h-24 w-24 rounded-full object-cover"
              />
            )}
            <input
              type="file"
              accept="image/*"
              className="block w-full text-sm text-slate-400 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-500/20 file:px-4 file:py-2 file:text-sm file:font-medium file:text-indigo-200"
              onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
            />
          </div>
          <div>
            <label className="label">CV / Resume (PDF)</label>
            {config.cv_file && !cvFile && (
              <p className="mb-3 text-sm text-slate-400">
                Current: <a className="text-cyan-300 underline" href={mediaUrl(config.cv_file) || ''} target="_blank" rel="noopener noreferrer">view file</a>
              </p>
            )}
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="block w-full text-sm text-slate-400 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-500/20 file:px-4 file:py-2 file:text-sm file:font-medium file:text-indigo-200"
              onChange={(e) => setCvFile(e.target.files?.[0] || null)}
            />
          </div>
        </div>
      </div>

      <div className="sticky bottom-4 flex items-center gap-4">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
        {message && <span className="text-sm text-slate-300">{message}</span>}
      </div>
    </form>
  );
};

export default SiteSettingsTab;
