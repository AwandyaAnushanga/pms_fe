import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { useToast } from '../components/ui/Toast';
import { api } from '../lib/api';
import { Tenant, Unit } from '../types';

interface TenantsProps {
  onNavigate: (page: string) => void;
}

export const Tenants: React.FC<TenantsProps> = ({ onNavigate }) => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [filteredTenants, setFilteredTenants] = useState<Tenant[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingTenant, setViewingTenant] = useState<Tenant | null>(null);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    unit_id: ''
  });

  useEffect(() => {
    fetchTenants();
    fetchUnits();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = tenants.filter(
        (tenant) =>
          tenant.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tenant.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tenant.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTenants(filtered);
    } else {
      setFilteredTenants(tenants);
    }
  }, [searchTerm, tenants]);

  const fetchTenants = async () => {
    try {
      const { data, error } = await api.tenants.getAll();

      if (error) throw new Error(error);
      setTenants(data || []);
      setFilteredTenants(data || []);
    } catch (error) {
      showToast('Failed to fetch tenants', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchUnits = async () => {
    try {
      const { data, error } = await api.units.getAll();
      if (error) throw new Error(error);
      setUnits(data || []);
    } catch (error) {
      showToast('Failed to fetch units', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      unit_id: formData.unit_id || null
    };

    try {
      if (editingTenant) {
        const { error } = await api.tenants.update(editingTenant.id, payload);

        if (error) throw new Error(error);
        showToast('Tenant updated successfully', 'success');
      } else {
        const { error } = await api.tenants.create(payload);

        if (error) throw new Error(error);
        showToast('Tenant created successfully', 'success');
      }

      setIsModalOpen(false);
      resetForm();
      fetchTenants();
    } catch (error) {
      showToast('Failed to save tenant', 'error');
    }
  };

  const handleEdit = (tenant: Tenant) => {
    setEditingTenant(tenant);
    setFormData({
      first_name: tenant.first_name,
      last_name: tenant.last_name,
      email: tenant.email,
      phone_number: tenant.phone_number,
      unit_id: tenant.unit_id || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tenant?')) return;

    try {
      const { error } = await api.tenants.delete(id);

      if (error) throw new Error(error);
      showToast('Tenant deleted successfully', 'success');
      fetchTenants();
    } catch (error) {
      showToast('Failed to delete tenant', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      unit_id: ''
    });
    setEditingTenant(null);
  };

  const columns = [
    {
      key: 'first_name',
      label: 'First Name'
    },
    {
      key: 'last_name',
      label: 'Last Name'
    },
    {
      key: 'email',
      label: 'Email'
    },
    {
      key: 'phone_number',
      label: 'Phone'
    },
    {
      key: 'unit',
      label: 'Unit',
      render: (tenant: Tenant) =>
        tenant.unit ? `Unit ${tenant.unit.unit_number}` : 'Not assigned'
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (tenant: Tenant) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="sm" onClick={() => setViewingTenant(tenant)}>
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleEdit(tenant)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(tenant.id)}>
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <DashboardLayout
      currentPage="tenants"
      onNavigate={onNavigate}
      title="Tenants"
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      showSearch
    >
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Tenant
          </Button>
        </div>

        <Table columns={columns} data={filteredTenants} loading={loading} />

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            resetForm();
          }}
          title={editingTenant ? 'Edit Tenant' : 'Add Tenant'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="First Name"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              required
            />
            <Input
              label="Last Name"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              required
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label="Phone Number"
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              required
            />
            <Select
              label="Unit (Optional)"
              value={formData.unit_id}
              onChange={(e) => setFormData({ ...formData, unit_id: e.target.value })}
              options={units.map((unit) => ({
                value: unit.id,
                label: `Unit ${unit.unit_number} - ${unit.property?.propertyName || 'N/A'}`
              }))}
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
              <Button type="submit">{editingTenant ? 'Update' : 'Create'}</Button>
            </div>
          </form>
        </Modal>

        <Modal
          isOpen={!!viewingTenant}
          onClose={() => setViewingTenant(null)}
          title="Tenant Profile"
          size="lg"
        >
          {viewingTenant && (
            <div className="space-y-6">
              <div className="text-center pb-4 border-b">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-blue-600">
                    {viewingTenant.first_name[0]}
                    {viewingTenant.last_name[0]}
                  </span>
                </div>
                <h3 className="text-xl font-semibold">
                  {viewingTenant.first_name} {viewingTenant.last_name}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{viewingTenant.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{viewingTenant.phone_number}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Current Unit</p>
                  <p className="font-medium">
                    {viewingTenant.unit
                      ? `Unit ${viewingTenant.unit.unit_number} - ${viewingTenant.unit.property?.propertyName || 'N/A'}`
                      : 'Not assigned'}
                  </p>
                </div>
              </div>

              {viewingTenant.unit && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Unit Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Size</p>
                      <p className="font-medium">{viewingTenant.unit.size} sqft</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Floor</p>
                      <p className="font-medium">{viewingTenant.unit.floor}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Rent</p>
                      <p className="font-medium">${viewingTenant.unit.rent}/mo</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-medium">{viewingTenant.unit.status}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
};
