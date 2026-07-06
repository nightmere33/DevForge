import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchProjects } from '../api';
import { mediaUrl } from '../api/axios';
import { Project } from '../types';
import { GitHubIcon, ExternalLinkIcon } from '../components/icons';
import { Reveal, RevealGroup, RevealItem, CardSkeleton } from '../components/ui';
import { Star } from 'lucide-react';

const Projects: React.FC = () => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects().then((r) => setProjects(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="container-page py-16 md:py-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-4xl font-bold text-white md:text-5xl">
          {t('projects.title_a')} <span className="gradient-text">{t('projects.title_b')}</span>
        </h1>
        <p className="mt-4 text-lg text-slate-400">{t('projects.subtitle')}</p>
      </Reveal>

      {loading ? (
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <RevealGroup className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <RevealItem key={project.id} className="card card-hover group h-full overflow-hidden">
              <div className="relative">
                {project.image ? (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={mediaUrl(project.image) || ''}
                      alt={project.title}
                      className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="flex h-48 items-center justify-center bg-gradient-to-br from-indigo-600/30 to-cyan-500/20 font-display text-4xl text-white/50">
                    {'</>'}
                  </div>
                )}
                {project.featured && (
                  <span className="badge absolute end-3 top-3 border border-amber-300/40 bg-amber-400/20 text-amber-200">
                    <Star className="h-3 w-3 fill-amber-200" /> {t('projects.featured')}
                  </span>
                )}
              </div>
              <div className="p-6">
                <h3 className="font-display text-lg font-semibold text-white">{project.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {project.description.length > 140 ? `${project.description.slice(0, 140)}...` : project.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.technologies.split(',').map((tech) => (
                    <span key={tech} className="chip">{tech.trim()}</span>
                  ))}
                </div>
                {(project.github_link || project.demo_link) && (
                  <div className="mt-5 flex gap-4 text-sm font-medium">
                    {project.github_link && (
                      <a href={project.github_link} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white">
                        <GitHubIcon className="h-4 w-4" /> {t('projects.code')}
                      </a>
                    )}
                    {project.demo_link && (
                      <a href={project.demo_link} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-cyan-300 hover:text-cyan-200">
                        <ExternalLinkIcon /> {t('projects.demo')}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      )}

      {!loading && projects.length === 0 && (
        <p className="mt-16 text-center text-slate-400">{t('projects.empty')}</p>
      )}
    </div>
  );
};

export default Projects;
