import React from 'react';
import { Search, Bell } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';

interface TopNavProps {
  title: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  showSearch?: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({ title, searchValue = '', onSearchChange, showSearch = false }) => {
  return (
    <div className="glass-card px-8 py-4 fixed top-0 left-64 right-0 z-10 border-b border-white/20 dark:border-slate-700/50">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 dark:from-primary-400 dark:to-accent-400 bg-clip-text text-transparent">
          {title}
        </h2>

        <div className="flex items-center gap-3">
          {showSearch && (
            <div className="relative group">
              <Search className="w-5 h-5 text-primary-400 dark:text-primary-300 absolute left-3 top-1/2 -translate-y-1/2 transition-colors" />
              <input
                type="text"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="pl-10 pr-4 py-2.5 glass-card rounded-xl focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent outline-none w-64 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-400/0 to-accent-400/0 group-focus-within:from-primary-400/10 group-focus-within:to-accent-400/10 transition-all duration-300 pointer-events-none" />
            </div>
          )}

          <button className="relative group p-2.5 glass-button rounded-xl transition-all duration-300 hover:scale-105">
            <Bell className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></span>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-400/20 to-accent-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10" />
          </button>

          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};
