import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Upload } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../components/ui/Toast';
import { api } from '../lib/api';
import { Unit, Property } from '../types';

interface UnitsProps {
  onNavigate: (page: string) => void;
}

export const Units: React.FC<UnitsProps> = ({ onNavigate }) => {
  const [units, setUnits] = useState<Unit[]>([]);
  // const [filteredUnits, setFilteredUnits] = useState<Unit[]>([]);
  const [filteredUnits, setFilteredUnits] = useState<Record<string, Unit>>({});
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    unitNumber: '',
    propertyId: '',
    size: '',
    floor: '',
    status: 'Available',
    rent: ''
  });

  useEffect(() => {
    fetchUnits();
    fetchProperties();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = units.filter(
        (unit) =>
          unit.unit_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          unit.property?.propertyName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const filteredObject = Object.fromEntries(filtered.map(unit => [unit.id, unit]));
      setFilteredUnits(filteredObject);
    } else {
      const unitsObject = Object.fromEntries(units.map(unit => [unit.id, unit]));
      setFilteredUnits(unitsObject);
    }
  }, [searchTerm, units]);

  const fetchUnits = async () => {
    try {
      const { data, error } = await api.units.getAll();

      if (error) throw new Error(error);
      setUnits(data || []);
      setFilteredUnits(data || []);
    } catch (error) {
      showToast('Failed to fetch units', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchProperties = async () => {
    try {
      const { data, error } = await api.properties.getAll();
      if (error) throw new Error(error);
      setProperties(data || []);
    } catch (error) {
      showToast('Failed to fetch properties', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      size: parseFloat(formData.size),
      floor: parseInt(formData.floor),
      rent: parseFloat(formData.rent)
    };

    try {
      if (editingUnit) {
        const { error } = await api.units.update(editingUnit.id, payload);

        if (error) throw new Error(error);
        showToast('Unit updated successfully', 'success');
      } else {
        const { error } = await api.units.create(payload);

        if (error) throw new Error(error);
        showToast('Unit created successfully', 'success');
      }

      setIsModalOpen(false);
      resetForm();
      fetchUnits();
    } catch (error) {
      showToast('Failed to save unit', 'error');
    }
  };

  const handleEdit = (unit: Unit) => {
    setEditingUnit(unit);
    setFormData({
      unitNumber: unit.unit_number,
      propertyId: unit.property_id,
      size: unit.size.toString(),
      floor: unit.floor.toString(),
      status: unit.status,
      rent: unit.rent.toString()
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this unit?')) return;

    try {
      const { error } = await api.units.delete(id);

      if (error) throw new Error(error);
      showToast('Unit deleted successfully', 'success');
      fetchUnits();
    } catch (error) {
      showToast('Failed to delete unit', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      unitNumber: '',
      propertyId: '',
      size: '',
      floor: '',
      status: 'Available',
      rent: ''
    });
    setEditingUnit(null);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
      Available: 'success',
      Occupied: 'info',
      'Under Maintenance': 'warning'
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  return (
    <DashboardLayout
      currentPage="units"
      onNavigate={onNavigate}
      title="Units"
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
            Add Unit
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p className="col-span-3 text-center py-8 text-gray-500">Loading...</p>
          ) : Object.keys(filteredUnits).length === 0 ? (
            <p className="col-span-3 text-center py-8 text-gray-500">No units available</p>
          ) : (
           Object.values(filteredUnits).map((unit) => (
              <div
                key={unit.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-48 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                  <Upload className="w-16 h-16 text-blue-300" />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">
                        Unit {unit.unit_number}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {unit.property?.propertyName || 'N/A'}
                      </p>
                    </div>
                    {getStatusBadge(unit.status)}
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Floor:</span>
                      <span className="font-medium">{unit.floor}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Size:</span>
                      <span className="font-medium">{unit.size} sqft</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Rent:</span>
                      <span className="font-medium text-blue-600">${unit.rent}/mo</span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-3 border-t">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(unit)} className="flex-1">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(unit.id)}
                      className="flex-1"
                    >
                      <Trash2 className="w-4 h-4 mr-1 text-red-600" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            resetForm();
          }}
          title={editingUnit ? 'Edit Unit' : 'Add Unit'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Unit Number"
              value={formData.unitNumber}
              onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
              required
            />
            <Select
              label="Property"
              value={formData.propertyId}
              onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
              options={Array.isArray(properties)
                ? properties.map((property) => ({
                    value: property.id,
                    label: property.propertyName
                  }))
                : []}
              required
            />

            <Input
              label="Size (sqft)"
              type="number"
              value={formData.size}
              onChange={(e) => setFormData({ ...formData, size: e.target.value })}
              required
            />
            <Input
              label="Floor"
              type="number"
              value={formData.floor}
              onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
              required
            />
            <Input
              label="Rent (per month)"
              type="number"
              step="0.01"
              value={formData.rent}
              onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
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
              <Button type="submit">{editingUnit ? 'Update' : 'Create'}</Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};
