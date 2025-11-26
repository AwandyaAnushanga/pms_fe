import React from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';

interface DashboardLayoutProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  title: string;
  children: React.ReactNode;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  showSearch?: boolean;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentPage,
  onNavigate,
  title,
  children,
  searchValue,
  onSearchChange,
  showSearch
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
      <div className="ml-64">
        <TopNav
          title={title}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          showSearch={showSearch}
        />
        <main className="pt-20 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
