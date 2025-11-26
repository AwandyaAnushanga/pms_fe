import React from 'react';
import { Home, Users, Building2, DoorOpen, UserCheck, FileText, DollarSign, Wrench } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'owners', label: 'Owners', icon: Users },
  { id: 'properties', label: 'Properties', icon: Building2 },
  { id: 'units', label: 'Units', icon: DoorOpen },
  { id: 'tenants', label: 'Tenants', icon: UserCheck },
  { id: 'leases', label: 'Leases', icon: FileText },
  { id: 'payments', label: 'Payments', icon: DollarSign },
  { id: 'maintenance', label: 'Maintenance', icon: Wrench }
];

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  return (
    <div className="w-64 glass-card border-r border-white/20 dark:border-slate-700/50 h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b border-white/20 dark:border-slate-700/50">
        <div className="flex items-center gap-3 group">
          <div className="relative">
            <Building2 className="w-9 h-9 text-primary-600 dark:text-primary-400 animate-float" />
            <div className="absolute inset-0 blur-xl bg-primary-500/30 dark:bg-primary-400/20 animate-pulse-slow" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 dark:from-primary-400 dark:to-accent-400 bg-clip-text text-transparent">
              PropManager
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-400">Property Management</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`group relative w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 overflow-hidden ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/30 dark:shadow-primary-400/20 scale-105'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:scale-105'
                  }`}
                >
                  {/* Background shimmer effect on hover */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-400/0 via-primary-400/10 to-primary-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  )}

                  <Icon className={`w-5 h-5 relative z-10 ${isActive ? 'drop-shadow-lg' : ''}`} />
                  <span className={`relative z-10 ${isActive ? 'font-semibold' : 'font-medium'}`}>
                    {item.label}
                  </span>

                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};
