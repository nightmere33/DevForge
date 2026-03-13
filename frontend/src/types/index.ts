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