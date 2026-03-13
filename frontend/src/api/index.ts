import API from './axios';

export const fetchProjects = () => API.get('/projects/');
export const fetchProject = (id: number) => API.get(`/projects/${id}/`);
export const fetchServices = () => API.get('/services/');