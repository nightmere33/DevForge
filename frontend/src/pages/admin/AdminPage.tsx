import React, { useState } from 'react';
import {
  LayoutDashboard, ClipboardList, CreditCard, Inbox, Settings2,
  Wrench, FolderGit2, Zap, Quote, HelpCircle, Menu, X,
} from 'lucide-react';
import AdminDashboard from './AdminDashboard';
import OrdersTab from './OrdersTab';
import SubscriptionsTab from './SubscriptionsTab';
import MessagesTab from './MessagesTab';
import SiteSettingsTab from './SiteSettingsTab';
import ServicesTab from './ServicesTab';
import ProjectsTab from './ProjectsTab';
import SkillsTab from './SkillsTab';
import TestimonialsTab from './TestimonialsTab';
import FaqsTab from './FaqsTab';
import PlansTab from './PlansTab';

type Section = { key: string; label: string; icon: React.ReactNode; group: string };

const SECTIONS: Section[] = [
  { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, group: 'Business' },
  { key: 'orders', label: 'Orders', icon: <ClipboardList className="h-5 w-5" />, group: 'Business' },
  { key: 'subscriptions', label: 'Subscriptions', icon: <CreditCard className="h-5 w-5" />, group: 'Business' },
  { key: 'messages', label: 'Inbox', icon: <Inbox className="h-5 w-5" />, group: 'Business' },
  { key: 'settings', label: 'Site Settings', icon: <Settings2 className="h-5 w-5" />, group: 'Content' },
  { key: 'services', label: 'Services', icon: <Wrench className="h-5 w-5" />, group: 'Content' },
  { key: 'projects', label: 'Projects', icon: <FolderGit2 className="h-5 w-5" />, group: 'Content' },
  { key: 'skills', label: 'Skills', icon: <Zap className="h-5 w-5" />, group: 'Content' },
  { key: 'testimonials', label: 'Testimonials', icon: <Quote className="h-5 w-5" />, group: 'Content' },
  { key: 'faqs', label: 'FAQs', icon: <HelpCircle className="h-5 w-5" />, group: 'Content' },
  { key: 'plans', label: 'Support Plans', icon: <CreditCard className="h-5 w-5" />, group: 'Content' },
];

const AdminPage: React.FC = () => {
  const [active, setActive] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  const groups = Array.from(new Set(SECTIONS.map((s) => s.group)));
  const activeLabel = SECTIONS.find((s) => s.key === active)?.label;

  const nav = (
    <nav className="space-y-6">
      {groups.map((group) => (
        <div key={group}>
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-600">{group}</p>
          <div className="space-y-1">
            {SECTIONS.filter((s) => s.group === group).map((s) => (
              <button
                key={s.key}
                onClick={() => { setActive(s.key); setMobileOpen(false); }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active === s.key
                    ? 'bg-gradient-to-r from-indigo-500/20 to-cyan-500/10 text-white'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {s.icon}
                {s.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="container-page py-8 md:py-12">
      <div className="flex items-center justify-between lg:hidden">
        <h1 className="font-display text-2xl font-bold text-white">{activeLabel}</h1>
        <button className="rounded-lg border border-white/10 p-2 text-slate-300" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div className="mt-4 grid gap-8 lg:mt-0 lg:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <aside className={`${mobileOpen ? 'block' : 'hidden'} lg:block`}>
          <div className="card sticky top-24 p-4">{nav}</div>
        </aside>

        {/* Content */}
        <div>
          {active === 'dashboard' && <AdminDashboard />}
          {active === 'orders' && <OrdersTab />}
          {active === 'subscriptions' && <SubscriptionsTab />}
          {active === 'messages' && <MessagesTab />}
          {active === 'settings' && <SiteSettingsTab />}
          {active === 'services' && <ServicesTab />}
          {active === 'projects' && <ProjectsTab />}
          {active === 'skills' && <SkillsTab />}
          {active === 'testimonials' && <TestimonialsTab />}
          {active === 'faqs' && <FaqsTab />}
          {active === 'plans' && <PlansTab />}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
