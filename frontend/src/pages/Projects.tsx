import React, { useEffect, useState } from 'react';
import { fetchProjects } from '../api';
import { Project } from '../types';

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects()
      .then(res => setProjects(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-center mb-4">My Portfolio</h1>
      <p className="text-xl text-gray-600 text-center mb-12">Some of my recent work</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map(project => (
          <div key={project.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
            {project.image && (
              <img src={`http://127.0.0.1:8000${project.image}`} alt={project.title} className="w-full h-48 object-cover" />
            )}
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{project.title}</h3>
              <p className="text-gray-600 mb-4">{project.description.substring(0, 100)}...</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.split(',').map(tech => (
                  <span key={tech} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm">
                    {tech.trim()}
                  </span>
                ))}
              </div>
              <div className="flex space-x-4">
                {project.github_link && (
                  <a href={project.github_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    GitHub
                  </a>
                )}
                {project.demo_link && (
                  <a href={project.demo_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;