import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Building2, Users, FileText, Wrench, DollarSign, TrendingUp } from 'lucide-react';
import { api } from '../lib/api';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

interface Stats {
  totalProperties: number;
  totalUnits: number;
  occupiedUnits: number;
  activeLeases: number;
  pendingMaintenance: number;
  outstandingPayments: number;
  totalRevenue: number;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<Stats>({
    totalProperties: 0,
    totalUnits: 0,
    occupiedUnits: 0,
    activeLeases: 0,
    pendingMaintenance: 0,
    outstandingPayments: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data, error } = await api.dashboard.getStats();

      if (error) throw new Error(error);

      setStats(data || {
        totalProperties: 0,
        totalUnits: 0,
        occupiedUnits: 0,
        activeLeases: 0,
        pendingMaintenance: 0,
        outstandingPayments: 0,
        totalRevenue: 0
      });
    } catch (error) {
      console.error('Failed to fetch stats', error);
    } finally {
      setLoading(false);
    }
  };

  const occupancyRate =
    stats.totalUnits > 0 ? ((stats.occupiedUnits / stats.totalUnits) * 100).toFixed(1) : '0';

  const StatCard = ({
    title,
    value,
    icon: Icon,
    subtitle,
    color
  }: {
    title: string;
    value: string | number;
    icon: any;
    subtitle?: string;
    color: string;
  }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm text-gray-600">{title}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );

  return (
    <DashboardLayout currentPage="dashboard" onNavigate={onNavigate} title="Dashboard">
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading dashboard...</div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Properties"
              value={stats.totalProperties}
              icon={Building2}
              color="bg-blue-500"
            />
            <StatCard
              title="Occupancy Rate"
              value={`${occupancyRate}%`}
              icon={TrendingUp}
              subtitle={`${stats.occupiedUnits} of ${stats.totalUnits} units occupied`}
              color="bg-green-500"
            />
            <StatCard
              title="Active Leases"
              value={stats.activeLeases}
              icon={FileText}
              color="bg-purple-500"
            />
            <StatCard
              title="Total Revenue"
              value={`$${stats.totalRevenue.toLocaleString()}`}
              icon={DollarSign}
              subtitle="Paid payments"
              color="bg-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onNavigate('maintenance')}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Pending Maintenance</h3>
                <Wrench className="w-6 h-6 text-orange-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stats.pendingMaintenance}</p>
              <p className="text-sm text-gray-600">Requests awaiting action</p>
            </div>

            <div
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onNavigate('payments')}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Outstanding Payments</h3>
                <DollarSign className="w-6 h-6 text-red-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stats.outstandingPayments}</p>
              <p className="text-sm text-gray-600">Pending or overdue payments</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => onNavigate('owners')}
                className="flex flex-col items-center justify-center p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
              >
                <Users className="w-8 h-8 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">Manage Owners</span>
              </button>
              <button
                onClick={() => onNavigate('properties')}
                className="flex flex-col items-center justify-center p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
              >
                <Building2 className="w-8 h-8 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">View Properties</span>
              </button>
              <button
                onClick={() => onNavigate('tenants')}
                className="flex flex-col items-center justify-center p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
              >
                <Users className="w-8 h-8 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">Manage Tenants</span>
              </button>
              <button
                onClick={() => onNavigate('leases')}
                className="flex flex-col items-center justify-center p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
              >
                <FileText className="w-8 h-8 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">View Leases</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
