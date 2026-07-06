import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchSkills } from '../api';
import { mediaUrl } from '../api/axios';
import { Skill, SkillCategory } from '../types';
import { useSiteConfig } from '../context/SiteConfigContext';
import { DownloadIcon, MailIcon, MapPinIcon } from '../components/icons';
import { Reveal, ProgressBar } from '../components/ui';

const CATEGORY_KEYS: SkillCategory[] = ['languages', 'web', 'mobile', 'automation', 'embedded', 'tools'];

const About: React.FC = () => {
  const { t } = useTranslation();
  const { config } = useSiteConfig();
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    fetchSkills().then((r) => setSkills(r.data)).catch(() => {});
  }, []);

  if (!config) return <div className="py-32 text-center text-slate-400">{t('common.loading')}</div>;

  const paragraphs = config.about_text.split('\n').filter((p) => p.trim());
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    (acc[skill.category] = acc[skill.category] || []).push(skill);
    return acc;
  }, {});

  return (
    <div className="container-page py-16 md:py-24">
      <div className="grid gap-12 lg:grid-cols-5">
        <Reveal className="lg:col-span-2">
          <div className="card sticky top-24 p-8 text-center">
            {config.profile_image ? (
              <img
                src={mediaUrl(config.profile_image) || ''}
                alt={config.site_name}
                className="mx-auto h-40 w-40 rounded-full border-2 border-indigo-400/40 object-cover"
              />
            ) : (
              <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600/40 to-cyan-500/30 font-display text-5xl text-white">
                {config.site_name.charAt(0)}
              </div>
            )}
            <h2 className="mt-6 font-display text-2xl font-bold text-white">{config.site_name}</h2>
            <p className="mt-1 text-sm text-cyan-300">{config.tagline}</p>
            <div className="mt-6 space-y-3 text-start text-sm text-slate-300">
              {config.email && (
                <p className="flex items-center gap-3"><MailIcon className="h-4 w-4 text-indigo-300" /> {config.email}</p>
              )}
              {config.location && (
                <p className="flex items-center gap-3"><MapPinIcon className="h-4 w-4 text-indigo-300" /> {config.location}</p>
              )}
              {config.availability && (
                <p className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-emerald-400" /> {config.availability}</p>
              )}
            </div>
            {config.cv_file && (
              <a href={mediaUrl(config.cv_file) || ''} target="_blank" rel="noopener noreferrer" className="btn-primary btn-small mt-6 w-full">
                <DownloadIcon className="h-4 w-4" /> {t('about.download_cv')}
              </a>
            )}
          </div>
        </Reveal>

        <div className="lg:col-span-3">
          <Reveal>
            <h1 className="font-display text-4xl font-bold text-white">
              {config.about_title}
            </h1>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-slate-300">
              {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </Reveal>

          {skills.length > 0 && (
            <Reveal className="mt-14">
              <h2 className="section-title text-2xl md:text-3xl">{t('about.skills_title')}</h2>
              <div className="mt-8 grid gap-8 sm:grid-cols-2">
                {CATEGORY_KEYS.filter((cat) => grouped[cat]?.length).map((cat) => (
                  <div key={cat} className="card p-6">
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-cyan-300">
                      {t(`about.cat_${cat}`)}
                    </h3>
                    <div className="space-y-3">
                      {grouped[cat].map((skill) => (
                        <div key={skill.id}>
                          <div className="mb-1 flex justify-between text-sm">
                            <span className="text-slate-200">{skill.name}</span>
                            <span className="text-slate-500">{skill.level}%</span>
                          </div>
                          <ProgressBar value={skill.level} className="h-1.5" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </div>
  );
};

export default About;
