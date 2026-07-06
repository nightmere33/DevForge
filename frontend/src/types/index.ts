export interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string;
  github_link: string;
  demo_link: string;
  image: string | null;
  featured: boolean;
  created_at: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  price_range: string;
  order: number;
}

export type SkillCategory = 'languages' | 'web' | 'mobile' | 'automation' | 'embedded' | 'tools';

export interface Skill {
  id: number;
  name: string;
  category: SkillCategory;
  level: number;
  order: number;
}

export interface SiteConfig {
  site_name: string;
  tagline: string;
  hero_title: string;
  hero_subtitle: string;
  hero_cta_text: string;
  years_experience: number;
  projects_completed: number;
  happy_clients: number;
  about_title: string;
  about_text: string;
  profile_image: string | null;
  cv_file: string | null;
  email: string;
  phone: string;
  location: string;
  availability: string;
  github_url: string;
  linkedin_url: string;
  twitter_url: string;
  whatsapp: string;
  fiverr_url: string;
  upwork_url: string;
  footer_text: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  approved: boolean;
  order: number;
  created_at: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  order: number;
}

export type TicketStatus =
  | 'new' | 'contacted' | 'in_progress' | 'review' | 'delivered' | 'closed' | 'cancelled';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TicketMessage {
  id: number;
  ticket: number;
  sender: number;
  sender_username: string;
  sender_role: 'client' | 'developer';
  body: string;
  attachment: string | null;
  read: boolean;
  created_at: string;
}

export interface TicketUpdate {
  id: number;
  ticket: number;
  title: string;
  body: string;
  progress: number;
  attachment: string | null;
  created_at: string;
}

export interface Ticket {
  id: number;
  client: number;
  client_username: string;
  client_email: string;
  subject: string;
  description: string;
  service: number | null;
  service_title: string | null;
  budget: string;
  phone: string;
  whatsapp: string;
  deadline: string | null;
  status: TicketStatus;
  priority: TicketPriority;
  progress: number;
  price_agreed: string | null;
  message_count: number;
  unread_count: number;
  created_at: string;
  updated_at: string;
  messages?: TicketMessage[];
  updates?: TicketUpdate[];
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export interface SupportPlan {
  id: number;
  name: string;
  description: string;
  price: string;
  currency: string;
  period_months: number;
  features: string;
  popular: boolean;
  active: boolean;
  order: number;
}

export type SubscriptionStatus = 'requested' | 'active' | 'expired' | 'cancelled';

export interface Subscription {
  id: number;
  client: number;
  client_username: string;
  client_email: string;
  plan: number;
  plan_name: string;
  plan_price: string;
  plan_currency: string;
  plan_period_months: number;
  status: SubscriptionStatus;
  note: string;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminStats {
  kpis: {
    total_orders: number;
    active_orders: number;
    completed_orders: number;
    total_revenue: number;
    clients: number;
    unread_messages: number;
    unread_contact: number;
    active_subscriptions: number;
    pending_subscriptions: number;
  };
  orders_by_month: { month: string; count: number }[];
  revenue_by_month: { month: string; total: number }[];
  status_breakdown: { status: TicketStatus; count: number }[];
  top_services: { service__title: string; count: number }[];
}
