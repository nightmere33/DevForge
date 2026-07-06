import API from './axios';
import {
  Project, Service, Skill, SiteConfig, Ticket, TicketMessage, TicketUpdate,
  ContactMessage, Testimonial, FAQ, SupportPlan, Subscription, AdminStats,
} from '../types';

// ---- Public content ----
export const fetchConfig = () => API.get<SiteConfig>('/core/config/');
export const fetchSkills = () => API.get<Skill[]>('/core/skills/');
export const fetchServices = () => API.get<Service[]>('/services/');
export const fetchProjects = () => API.get<Project[]>('/projects/');
export const fetchTestimonials = () => API.get<Testimonial[]>('/core/testimonials/');
export const fetchFaqs = () => API.get<FAQ[]>('/core/faqs/');
export const fetchPlans = () => API.get<SupportPlan[]>('/subscriptions/plans/');
export const sendContactMessage = (data: { name: string; email: string; subject: string; message: string }) =>
  API.post('/core/contact/', data);

// ---- Site administration (developer role) ----
export const updateConfig = (data: FormData | Partial<SiteConfig>) =>
  API.patch<SiteConfig>('/core/config/', data);
export const fetchAdminStats = () => API.get<AdminStats>('/core/stats/');

export const createService = (data: Partial<Service>) => API.post<Service>('/services/', data);
export const updateService = (id: number, data: Partial<Service>) => API.patch<Service>(`/services/${id}/`, data);
export const deleteService = (id: number) => API.delete(`/services/${id}/`);

export const createProject = (data: FormData) => API.post<Project>('/projects/', data);
export const updateProject = (id: number, data: FormData) => API.patch<Project>(`/projects/${id}/`, data);
export const deleteProject = (id: number) => API.delete(`/projects/${id}/`);

export const createSkill = (data: Partial<Skill>) => API.post<Skill>('/core/skills/', data);
export const updateSkill = (id: number, data: Partial<Skill>) => API.patch<Skill>(`/core/skills/${id}/`, data);
export const deleteSkill = (id: number) => API.delete(`/core/skills/${id}/`);

export const createTestimonial = (data: Partial<Testimonial>) => API.post<Testimonial>('/core/testimonials/', data);
export const updateTestimonial = (id: number, data: Partial<Testimonial>) =>
  API.patch<Testimonial>(`/core/testimonials/${id}/`, data);
export const deleteTestimonial = (id: number) => API.delete(`/core/testimonials/${id}/`);

export const createFaq = (data: Partial<FAQ>) => API.post<FAQ>('/core/faqs/', data);
export const updateFaq = (id: number, data: Partial<FAQ>) => API.patch<FAQ>(`/core/faqs/${id}/`, data);
export const deleteFaq = (id: number) => API.delete(`/core/faqs/${id}/`);

export const createPlan = (data: Partial<SupportPlan>) => API.post<SupportPlan>('/subscriptions/plans/', data);
export const updatePlan = (id: number, data: Partial<SupportPlan>) =>
  API.patch<SupportPlan>(`/subscriptions/plans/${id}/`, data);
export const deletePlan = (id: number) => API.delete(`/subscriptions/plans/${id}/`);

export const fetchContactMessages = () => API.get<ContactMessage[]>('/core/contact/');
export const updateContactMessage = (id: number, data: Partial<ContactMessage>) =>
  API.patch<ContactMessage>(`/core/contact/${id}/`, data);
export const deleteContactMessage = (id: number) => API.delete(`/core/contact/${id}/`);

// ---- Orders (tickets) ----
export const fetchTickets = () => API.get<Ticket[]>('/tickets/');
export const fetchTicket = (id: number) => API.get<Ticket>(`/tickets/${id}/`);
export const createTicket = (data: Partial<Ticket>) => API.post<Ticket>('/tickets/', data);
export const updateTicket = (id: number, data: Partial<Ticket>) => API.patch<Ticket>(`/tickets/${id}/`, data);
export const deleteTicket = (id: number) => API.delete(`/tickets/${id}/`);
export const fetchUnreadCount = () => API.get<{ unread: number }>('/tickets/unread-count/');
export const postTicketMessage = (ticketId: number, body: string, attachment?: File | null) => {
  const data = new FormData();
  data.append('body', body);
  if (attachment) data.append('attachment', attachment);
  return API.post<TicketMessage>(`/tickets/${ticketId}/messages/`, data);
};
export const postTicketUpdate = (ticketId: number, data: FormData) =>
  API.post<TicketUpdate>(`/tickets/${ticketId}/updates/`, data);

// ---- Subscriptions ----
export const fetchSubscriptions = () => API.get<Subscription[]>('/subscriptions/');
export const createSubscription = (plan: number, note: string) =>
  API.post<Subscription>('/subscriptions/', { plan, note });
export const updateSubscription = (id: number, data: Partial<Subscription>) =>
  API.patch<Subscription>(`/subscriptions/${id}/`, data);
