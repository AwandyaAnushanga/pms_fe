import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { useToast } from '../components/ui/Toast';
import { api } from '../lib/api';
import { Owner } from '../types';

interface OwnersProps {
  onNavigate: (page: string) => void;
}

export const Owners: React.FC<OwnersProps> = ({ onNavigate }) => {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [filteredOwners, setFilteredOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOwner, setEditingOwner] = useState<Owner | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: ''
  });

  useEffect(() => {
    fetchOwners();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = owners.filter(
        (owner) =>
          owner.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          owner.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          owner.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOwners(filtered);
    } else {
      setFilteredOwners(owners);
    }
  }, [searchTerm, owners]);

  const fetchOwners = async () => {
    try {
      const { data, error } = await api.owners.getAll();

      if (error) throw new Error(error);
      const ownersArray = data?.content || [];
      setOwners(ownersArray);
      setFilteredOwners(ownersArray);
    } catch (error) {
      showToast('Failed to fetch owners', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingOwner) {
        const { error } = await api.owners.update(editingOwner.id, formData);

        if (error) throw new Error(error);
        showToast('Owner updated successfully', 'success');
      } else {
        const { error } = await api.owners.create(formData);

        if (error) throw new Error(error);
        showToast('Owner created successfully', 'success');
      }

      setIsModalOpen(false);
      resetForm();
      fetchOwners();
    } catch (error) {
      showToast('Failed to save owner', 'error');
    }
  };

  const handleEdit = (owner: Owner) => {
    setEditingOwner(owner);
    setFormData({
      firstName: owner.firstName,
      lastName: owner.lastName,
      email: owner.email,
      phoneNumber: owner.phoneNumber,
      address: owner.address
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this owner?')) return;

    try {
      const { error } = await api.owners.delete(id);

      if (error) throw new Error(error);
      showToast('Owner deleted successfully', 'success');
      fetchOwners();
    } catch (error) {
      console.log("error_delete", error);
      
      showToast('Failed to delete owner', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      address: ''
    });
    setEditingOwner(null);
  };

  const columns = [
    {
      key: 'firstName',
      label: 'First Name'
    },
    {
      key: 'lastName',
      label: 'Last Name'
    },
    {
      key: 'email',
      label: 'Email'
    },
    {
      key: 'phoneNumber',
      label: 'Phone'
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (owner: Owner) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="sm" onClick={() => handleEdit(owner)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(owner.id)}>
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <DashboardLayout
      currentPage="owners"
      onNavigate={onNavigate}
      title="Owners"
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
            Add Owner
          </Button>
        </div>

        {/* <Table columns={columns} data={filteredOwners} loading={loading} /> */}

        <Table
          columns={columns}
          data={Object.fromEntries(filteredOwners.map(owner => [owner.id, owner]))}
          loading={loading}
        />

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            resetForm();
          }}
          title={editingOwner ? 'Edit Owner' : 'Add Owner'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
            <Input
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
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
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              required
            />
            <Input
              label="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
              <Button type="submit">{editingOwner ? 'Update' : 'Create'}</Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};
