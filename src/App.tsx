import { useState } from 'react';
import { ToastProvider } from './components/ui/Toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { Dashboard } from './pages/Dashboard';
import { Owners } from './pages/Owners';
import { Properties } from './pages/Properties';
import { Units } from './pages/Units';
import { Tenants } from './pages/Tenants';
import { Leases } from './pages/Leases';
import { Payments } from './pages/Payments';
import { Maintenance } from './pages/Maintenance';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'owners':
        return <Owners onNavigate={setCurrentPage} />;
      case 'properties':
        return <Properties onNavigate={setCurrentPage} />;
      case 'units':
        return <Units onNavigate={setCurrentPage} />;
      case 'tenants':
        return <Tenants onNavigate={setCurrentPage} />;
      case 'leases':
        return <Leases onNavigate={setCurrentPage} />;
      case 'payments':
        return <Payments onNavigate={setCurrentPage} />;
      case 'maintenance':
        return <Maintenance onNavigate={setCurrentPage} />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <ThemeProvider>
      <ToastProvider>
        {renderPage()}
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
