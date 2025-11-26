import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Upload } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../components/ui/Toast';
import { api } from '../lib/api';
import { Property, Owner } from '../types';
import { Owners } from './Owners';

interface PropertiesProps {
  onNavigate: (page: string) => void;
}

export const Properties: React.FC<PropertiesProps> = ({ onNavigate }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingProperty, setViewingProperty] = useState<Property | null>(null);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    propertyName: '',
    address: '',
    ownerId: '',
    type: '',
    status: 'Available'
  });

  useEffect(() => {
    fetchProperties();
    fetchOwners();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = properties.filter(
        (property) =>
          property.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProperties(filtered);
    } else {
      setFilteredProperties(properties);
    }
  }, [searchTerm, properties]);

  const fetchProperties = async () => {
    try {
      const { data, error } = await api.properties.getAll();

      if (error) throw new Error(error);
      const propertiesArray = data?.content || [];
      setProperties(propertiesArray);
      setFilteredProperties(data || []);
    } catch (error) {
      showToast('Failed to fetch properties', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchOwners = async () => {
    try {
      const { data, error } = await api.owners.getAll();
      if (error) throw new Error(error);
      const ownersArray = data?.content || [];
      setOwners(ownersArray);
    } catch (error) {
      showToast('Failed to fetch owners', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingProperty) {
        const { error } = await api.properties.update(editingProperty.id, formData);

        if (error) throw new Error(error);
        showToast('Property updated successfully', 'success');
      } else {
        const { error } = await api.properties.create(formData);

        if (error) throw new Error(error);
        showToast('Property created successfully', 'success');
      }

      setIsModalOpen(false);
      resetForm();
      fetchProperties();
    } catch (error) {
      showToast('Failed to save property', 'error');
    }
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setFormData({
      propertyName: property.propertyName,
      address: property.address,
      ownerId: property.ownerId,
      type: property.type,
      status: property.status
    });
    setIsModalOpen(true);
  };

  // const handleDelete = async (id: string) => {
  //   if (!confirm('Are you sure you want to delete this property?')) return;

  //   try {
  //     const { error } = await api.properties.delete(id);

  //     if (error) throw new Error(error);
  //     showToast('Property deleted successfully', 'success');
  //     fetchProperties();
  //   } catch (error) {
  //     showToast('Failed to delete property', 'error');
  //   }
  // };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    try {
      // Call delete without destructuring
      await api.properties.delete(id);

      // Remove the deleted property from both state arrays immediately
      setProperties((prev) => prev.filter((p) => p.id !== id));
      setFilteredProperties((prev) => prev.filter((p) => p.id !== id));

      showToast('Property deleted successfully', 'success');
    } catch (error: any) {
      // Optional: show backend error message if it exists
      const message = error?.message || 'Failed to delete property';
      showToast(message, 'error');
    }
};



  const resetForm = () => {
    setFormData({
      propertyName: '',
      address: '',
      ownerId: '',
      type: '',
      status: 'Available'
    });
    setEditingProperty(null);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'danger'| 'info'> = {
      Available: 'success',
      Occupied: 'info',
      'Under Maintenance': 'warning'
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  const columns = [
    {
      key: 'propertyName',
      label: 'Property Name'
    },
    {
      key: 'address',
      label: 'Address'
    },
    {
      key: 'owner',
      label: 'Owner',
      render: (property: Property) =>
        property.owner ? `${property.owner.firstName} ${property.owner.lastName}` : 'N/A'
    },
    {
      key: 'type',
      label: 'Type'
    },
    {
      key: 'status',
      label: 'Status',
      render: (property: Property) => getStatusBadge(property.status)
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (property: Property) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="sm" onClick={() => setViewingProperty(property)}>
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleEdit(property)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(property.id)}>
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <DashboardLayout
      currentPage="properties"
      onNavigate={onNavigate}
      title="Properties"
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
            Add Property
          </Button>
        </div>

        {/* <Table columns={columns} data={Object.fromEntries(filteredProperties.map(owners => [owners.id, owners]))} loading={loading} /> */}

<Table
  columns={columns}
  data={Object.fromEntries(Array.isArray(filteredProperties) ? filteredProperties.map(p => [p.id, p]) : [])}
  loading={loading}
/>
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            resetForm();
          }}
          title={editingProperty ? 'Edit Property' : 'Add Property'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Property Name"
              value={formData.propertyName}
              onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })}
              required
            />
            <Input
              label="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
            <Select
              label="Owner"
              value={formData.ownerId}
              onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })}
              options={Array.isArray(owners)
                ? owners.map((owner) => ({
                    value: owner.id,
                    label: `${owner.firstName} ${owner.lastName}`
                  }))
                : []}
              required
            />

            <Select
              label="Type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              options={[
                { value: 'Apartment', label: 'Apartment' },
                { value: 'Villa', label: 'Villa' },
                { value: 'Office', label: 'Office' }
              ]}
              required
            />
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'Available', label: 'Available' },
                { value: 'Occupied', label: 'Occupied' },
                { value: 'Under Maintenance', label: 'Under Maintenance' }
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
              <Button type="submit">{editingProperty ? 'Update' : 'Create'}</Button>
            </div>
          </form>
        </Modal>

        <Modal
          isOpen={!!viewingProperty}
          onClose={() => setViewingProperty(null)}
          title="Property Details"
          size="lg"
        >
          {viewingProperty && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Property Name</p>
                  <p className="font-medium">{viewingProperty.propertyName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium">{viewingProperty.type}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">{viewingProperty.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Owner</p>
                  <p className="font-medium">
                    {viewingProperty.owner
                      ? `${viewingProperty.owner.firstName} ${viewingProperty.owner.lastName}`
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="mt-1">{getStatusBadge(viewingProperty.status)}</div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Documents & Photos</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Upload documents and photos</p>
                  <p className="text-xs text-gray-400 mt-1">Click or drag files here</p>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
};
