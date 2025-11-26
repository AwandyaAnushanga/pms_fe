import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../components/ui/Toast';
import { api } from '../lib/api';
import { Lease, Tenant, Unit } from '../types';

interface LeasesProps {
  onNavigate: (page: string) => void;
}

export const Leases: React.FC<LeasesProps> = ({ onNavigate }) => {
  const [leases, setLeases] = useState<Lease[]>([]);
  const [filteredLeases, setFilteredLeases] = useState<Lease[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLease, setEditingLease] = useState<Lease | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    tenant_id: '',
    unit_id: '',
    rentAmount: '',
    depositAmount: '',
    startDate: '',
    endDate: '',
    status: 'Active'
  });

  useEffect(() => {
    fetchLeases();
    fetchTenants();
    fetchUnits();
  }, []);

  useEffect(() => {
  if (searchTerm) {
    const filtered = leases.filter(
      (lease) =>
        lease.tenant?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lease.tenant?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lease.unit?.unitNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLeases(filtered);
  } else {
    setFilteredLeases(leases);
  }
}, [searchTerm, leases]);




  const fetchLeases = async () => {
  try {
    const { data, error } = await api.leases.getAll<any>();

    if (error) throw new Error(error);
    
    // Extract content array from paginated response
    const leasesData = data?.content && Array.isArray(data.content) ? data.content : [];
    setLeases(leasesData);
    setFilteredLeases(leasesData);
  } catch (error) {
    showToast('Failed to fetch leases', 'error');
    setLeases([]);
    setFilteredLeases([]);
  } finally {
    setLoading(false);
  }
};



 const fetchTenants = async () => {
  try {
    const { data, error } = await api.tenants.getAll<any>();
    console.log('Tenants API response:', data);
    if (error) throw new Error(error);
    
    // Extract content array from paginated response
    const tenantsData = data?.content && Array.isArray(data.content) ? data.content : [];
    console.log('Tenants after processing:', tenantsData);
    setTenants(tenantsData);
  } catch (error) {
    console.error('Fetch tenants error:', error);
    showToast('Failed to fetch tenants', 'error');
    setTenants([]);
  }
};

const fetchUnits = async () => {
  try {
    const { data, error } = await api.units.getAll<any>();
    console.log('Units API response:', data);
    if (error) throw new Error(error);
    
    // Extract content array from paginated response
    const unitsData = data?.content && Array.isArray(data.content) ? data.content : [];
    console.log('Units after processing:', unitsData);
    setUnits(unitsData);
  } catch (error) {
    console.error('Fetch units error:', error);
    showToast('Failed to fetch units', 'error');
    setUnits([]);
  }
};




  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const payload = {
    tenantId: formData.tenant_id,  // Backend expects camelCase
    unitId: formData.unit_id,      // Backend expects camelCase
    rentAmount: parseFloat(formData.rentAmount),
    depositAmount: parseFloat(formData.depositAmount),
    startDate: formData.startDate,
    endDate: formData.endDate,
    status: formData.status
  };

  console.log('Payload being sent:', payload); // Debug log

  try {
    if (editingLease) {
      const { error } = await api.leases.update(editingLease.id, payload);

      if (error) throw new Error(error);
      showToast('Lease updated successfully', 'success');
    } else {
      const { error } = await api.leases.create(payload);

      if (error) throw new Error(error);
      showToast('Lease created successfully', 'success');
    }

    setIsModalOpen(false);
    resetForm();
    fetchLeases();
  } catch (error) {
    showToast('Failed to save lease', 'error');
  }
};


  const handleEdit = (lease: Lease) => {
  setEditingLease(lease);
  setFormData({
    tenant_id: lease.tenantId || '',
    unit_id: lease.unitId || '',
    rentAmount: lease.rentAmount?.toString() || '',
    depositAmount: lease.depositAmount?.toString() || '',
    startDate: lease.startDate || '',
    endDate: lease.endDate || '',
    status: lease.status
  });
  setIsModalOpen(true);
};


  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lease?')) return;

    try {
      const { error } = await api.leases.delete(id);

      if (error) throw new Error(error);
      showToast('Lease deleted successfully', 'success');
      fetchLeases();
    } catch (error) {
      showToast('Failed to delete lease', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      tenant_id: '',
      unit_id: '',
      rentAmount: '',
      depositAmount: '',
      startDate: '',
      endDate: '',
      status: 'Active'
    });
    setEditingLease(null);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'danger'> = {
      Active: 'success',
      Expired: 'warning',
      Terminated: 'danger'
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  const isLeaseExpiringSoon = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const daysUntilExpiry = Math.floor((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

 const columns = [
  {
    key: 'tenant',
    label: 'Tenant',
    render: (lease: Lease) =>
      lease.tenant ? `${lease.tenant.firstName} ${lease.tenant.lastName}` : 'N/A'
  },
  {
    key: 'unit',
    label: 'Unit',
    render: (lease: Lease) => (lease.unit ? `Unit ${lease.unit.unitNumber}` : 'N/A')
  },
  {
    key: 'rentAmount',
    label: 'Rent',
    render: (lease: Lease) => `$${lease.rentAmount}`
  },
  {
    key: 'startDate',
    label: 'Start Date',
    render: (lease: Lease) => new Date(lease.startDate).toLocaleDateString()
  },
  {
    key: 'endDate',
    label: 'End Date',
    render: (lease: Lease) => (
      <div className="flex items-center gap-2">
        <span>{new Date(lease.endDate).toLocaleDateString()}</span>
        {isLeaseExpiringSoon(lease.endDate) && lease.status === 'Active' && (
          <AlertCircle className="w-4 h-4 text-yellow-600" />
        )}
      </div>
    )
  },
  {
    key: 'status',
    label: 'Status',
    render: (lease: Lease) => getStatusBadge(lease.status)
  },
  {
    key: 'actions',
    label: 'Actions',
    render: (lease: Lease) => (
      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" size="sm" onClick={() => handleEdit(lease)}>
          <Edit className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => handleDelete(lease.id)}>
          <Trash2 className="w-4 h-4 text-red-600" />
        </Button>
      </div>
    )
  }
];


 const expiringLeases = Array.isArray(leases) 
  ? leases.filter(
      (lease) => isLeaseExpiringSoon(lease.endDate) && lease.status === 'Active'
    )
  : [];




  return (
    <DashboardLayout
      currentPage="leases"
      onNavigate={onNavigate}
      title="Leases"
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      showSearch
    >
      <div className="space-y-6">
        {expiringLeases.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <h3 className="font-semibold text-yellow-900">Leases Expiring Soon</h3>
            </div>
            <p className="text-sm text-yellow-800">
              {expiringLeases.length} lease(s) expiring within the next 30 days
            </p>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Lease
          </Button>
        </div>

        {/* <Table columns={columns} data={filteredLeases} loading={loading} /> */}

        <Table
          columns={columns}
          data={Object.fromEntries(filteredLeases.map(lease => [lease.id, lease]))}
          loading={loading}
        />


        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            resetForm();
          }}
          title={editingLease ? 'Edit Lease' : 'Add Lease'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select
              label="Tenant"
              value={formData.tenant_id}
              onChange={(e) => setFormData({ ...formData, tenant_id: e.target.value })}
              options={Array.isArray(tenants) ? tenants.map((tenant) => ({
                value: tenant.id,
                label: `${tenant.firstName || (tenant as any).first_name} ${tenant.lastName || (tenant as any).last_name}`
              })) : []}
              required
            />
            <Select
              label="Unit"
              value={formData.unit_id}
              onChange={(e) => setFormData({ ...formData, unit_id: e.target.value })}
              options={Array.isArray(units) ? units.map((unit) => ({
                value: unit.id,
                label: `Unit ${unit.unitNumber || (unit as any).unit_number} - ${unit.property?.propertyName || (unit as any).property?.property_name || 'N/A'}`
              })) : []}
              required
            />
            <Input
              label="Rent Amount"
              type="number"
              step="0.01"
              value={formData.rentAmount}
              onChange={(e) => setFormData({ ...formData, rentAmount: e.target.value })}
              required
            />
            <Input
              label="Deposit Amount"
              type="number"
              step="0.01"
              value={formData.depositAmount}
              onChange={(e) => setFormData({ ...formData, depositAmount: e.target.value })}
              required
            />
            <Input
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
            />
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'Expired', label: 'Expired' },
                { value: 'Terminated', label: 'Terminated' }
              ]}
              required
            />
            <div className="flex gap-3 justify-end pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">{editingLease ? 'Update' : 'Create'}</Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};
