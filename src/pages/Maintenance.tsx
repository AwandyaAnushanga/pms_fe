import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../components/ui/Toast';
import { api } from '../lib/api';
import { MaintenanceRequest, Unit } from '../types';

interface MaintenanceProps {
  onNavigate: (page: string) => void;
}

export const Maintenance: React.FC<MaintenanceProps> = ({ onNavigate }) => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<MaintenanceRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    unit_id: '',
    issue_type: '',
    description: '',
    priority: 'Medium',
    assigned_to: '',
    status: 1 as 1 | 2 | 3, // 1 - Not Completed, 2 - Started, 3 - Completed
    maintenance_date: '',
    cost: 0
  });

  useEffect(() => {
    fetchRequests();
    fetchUnits();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await api.maintenance.getAll();

      if (error) throw new Error(error);
      // Ensure data is always an array
      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      showToast('Failed to fetch maintenance requests', 'error');
      setRequests([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const fetchUnits = async () => {
    try {
      const { data, error } = await api.units.getAll();
      if (error) throw new Error(error);
      // Ensure data is always an array
      setUnits(Array.isArray(data) ? data : []);
    } catch (error) {
      showToast('Failed to fetch units', 'error');
      setUnits([]); // Set empty array on error
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingRequest) {
        const { error } = await api.maintenance.update(editingRequest.id, formData);

        if (error) throw new Error(error);
        showToast('Maintenance request updated successfully', 'success');
      } else {
        const { error } = await api.maintenance.create(formData);

        if (error) throw new Error(error);
        showToast('Maintenance request created successfully', 'success');
      }

      setIsModalOpen(false);
      resetForm();
      fetchRequests();
    } catch (error) {
      showToast('Failed to save maintenance request', 'error');
    }
  };

  const handleEdit = (request: MaintenanceRequest) => {
    setEditingRequest(request);
    setFormData({
      unit_id: request.unit_id,
      issue_type: request.issue_type,
      description: request.description,
      priority: request.priority,
      assigned_to: request.assigned_to,
      status: request.status,
      maintenance_date: request.maintenance_date || '',
      cost: request.cost || 0
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this maintenance request?')) return;

    try {
      const { error } = await api.maintenance.delete(id);

      if (error) throw new Error(error);
      showToast('Maintenance request deleted successfully', 'success');
      fetchRequests();
    } catch (error) {
      showToast('Failed to delete maintenance request', 'error');
    }
  };

  const handleStatusChange = async (id: string, newStatus: 1 | 2 | 3) => {
    try {
      const { error } = await api.maintenance.update(id, { status: newStatus });

      if (error) throw new Error(error);
      showToast('Status updated successfully', 'success');
      fetchRequests();
    } catch (error) {
      showToast('Failed to update status', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      unit_id: '',
      issue_type: '',
      description: '',
      priority: 'Medium',
      assigned_to: '',
      status: 1,
      maintenance_date: '',
      cost: 0
    });
    setEditingRequest(null);
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, 'success' | 'warning' | 'danger'> = {
      Low: 'success',
      Medium: 'warning',
      High: 'danger'
    };
    return <Badge variant={variants[priority] || 'default'}>{priority}</Badge>;
  };


  const filterByStatus = (status: 1 | 2 | 3) => {
    // Ensure requests is always an array
    if (!Array.isArray(requests)) return [];
    return requests.filter((req) => req.status === status);
  };

  const filteredBySearch = (statusRequests: MaintenanceRequest[]) => {
    if (!searchTerm) return statusRequests;
    return statusRequests.filter(
      (req) =>
        req.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.issue_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.unit?.unit_number.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const notCompletedRequests = filteredBySearch(filterByStatus(1));
  const startedRequests = filteredBySearch(filterByStatus(2));
  const completedRequests = filteredBySearch(filterByStatus(3));

  const KanbanColumn = ({
    title,
    requests,
    status
  }: {
    title: string;
    requests: MaintenanceRequest[];
    status: 1 | 2 | 3;
  }) => (
    <div className="flex-1 bg-gray-100 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
          {requests.length}
        </span>
      </div>
      <div className="space-y-3">
        {requests.map((request) => (
          <div
            key={request.id}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="default">{request.issue_type}</Badge>
                  {getPriorityBadge(request.priority)}
                </div>
                <p className="text-sm text-gray-900 font-medium mb-1">{request.description}</p>
                <p className="text-xs text-gray-600">
                  Unit {request.unit?.unit_number} - {request.unit?.property?.propertyName}
                </p>
              </div>
            </div>

            {request.assigned_to && (
              <div className="text-xs text-gray-600">
                Assigned to: {request.assigned_to}
              </div>
            )}

            <div className="text-xs text-gray-600 mt-2">
              <div>Date: {request.maintenance_date ? new Date(request.maintenance_date).toLocaleDateString() : 'Not set'}</div>
              <div className="font-semibold text-gray-900 mt-1">
                Cost: ${request.cost ? request.cost.toFixed(2) : '0.00'}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t mt-3">
              {status !== 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    handleStatusChange(
                      request.id,
                      status === 2 ? 1 : 2
                    )
                  }
                  className="text-xs"
                >
                  {status === 2 ? '← Not Completed' : '← Started'}
                </Button>
              )}
              {status !== 3 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    handleStatusChange(
                      request.id,
                      status === 1 ? 2 : 3
                    )
                  }
                  className="text-xs"
                >
                  {status === 1 ? 'Start →' : 'Complete →'}
                </Button>
              )}
              <div className="flex-1"></div>
              <Button variant="ghost" size="sm" onClick={() => handleEdit(request)}>
                <Edit className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(request.id)}>
                <Trash2 className="w-3 h-3 text-red-600" />
              </Button>
            </div>
          </div>
        ))}
        {requests.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">No requests</div>
        )}
      </div>
    </div>
  );

  return (
    <DashboardLayout
      currentPage="maintenance"
      onNavigate={onNavigate}
      title="Maintenance"
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
            Add Request
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4">
            <KanbanColumn title="Not Completed" requests={notCompletedRequests} status={1} />
            <KanbanColumn
              title="Started"
              requests={startedRequests}
              status={2}
            />
            <KanbanColumn title="Completed" requests={completedRequests} status={3} />
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            resetForm();
          }}
          title={editingRequest ? 'Edit Maintenance Request' : 'Add Maintenance Request'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select
              label="Unit"
              value={formData.unit_id}
              onChange={(e) => setFormData({ ...formData, unit_id: e.target.value })}
              options={Array.isArray(units) ? units.map((unit) => ({
                value: unit.id,
                label: `Unit ${unit.unit_number} - ${unit.property?.propertyName || 'N/A'}`
              })) : []}
              required
            />
            <Select
              label="Issue Type"
              value={formData.issue_type}
              onChange={(e) => setFormData({ ...formData, issue_type: e.target.value })}
              options={[
                { value: 'Plumbing', label: 'Plumbing' },
                { value: 'Electrical', label: 'Electrical' },
                { value: 'HVAC', label: 'HVAC' },
                { value: 'Cleaning', label: 'Cleaning' },
                { value: 'Other', label: 'Other' }
              ]}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required
              />
            </div>
            <Select
              label="Priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              options={[
                { value: 'Low', label: 'Low' },
                { value: 'Medium', label: 'Medium' },
                { value: 'High', label: 'High' }
              ]}
              required
            />
            <Input
              label="Assigned To"
              value={formData.assigned_to}
              onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
            />
            <Input
              label="Maintenance Date"
              type="date"
              value={formData.maintenance_date}
              onChange={(e) => setFormData({ ...formData, maintenance_date: e.target.value })}
              required
            />
            <Input
              label="Cost"
              type="number"
              step="0.01"
              min="0"
              value={formData.cost || 0}
              onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
              required
            />
            <Select
              label="Status"
              value={formData.status.toString()}
              onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) as 1 | 2 | 3 })}
              options={[
                { value: '1', label: 'Not Completed' },
                { value: '2', label: 'Started' },
                { value: '3', label: 'Completed' }
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
              <Button type="submit">{editingRequest ? 'Update' : 'Create'}</Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};
