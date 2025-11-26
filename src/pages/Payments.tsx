import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Filter } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../components/ui/Toast';
import { api } from '../lib/api';
import { Payment, Lease } from '../types';

interface PaymentsProps {
  onNavigate: (page: string) => void;
}

export const Payments: React.FC<PaymentsProps> = ({ onNavigate }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [leases, setLeases] = useState<Lease[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
  leaseId: '',
  amount: '',
  paymentDate: '',
  paymentStatus: 'Pending'
});

  const [filters, setFilters] = useState({
    status: '',
    dateFrom: '',
    dateTo: ''
  });

  useEffect(() => {
    fetchPayments();
    fetchLeases();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, payments, filters]);

  const applyFilters = () => {
  let filtered = Array.isArray(payments) ? [...payments] : [];

  if (searchTerm) {
    filtered = filtered.filter(
      (payment) =>
        payment.lease?.tenant?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.lease?.tenant?.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (filters.status) {
    filtered = filtered.filter((payment) => 
      (payment.paymentStatus || payment.payment_status) === filters.status
    );
  }

  if (filters.dateFrom) {
    filtered = filtered.filter((payment) => {
      const paymentDate = payment.paymentDate || payment.payment_date;
      return paymentDate && new Date(paymentDate) >= new Date(filters.dateFrom);
    });
  }

  if (filters.dateTo) {
    filtered = filtered.filter((payment) => {
      const paymentDate = payment.paymentDate || payment.payment_date;
      return paymentDate && new Date(paymentDate) <= new Date(filters.dateTo);
    });
  }

  setFilteredPayments(filtered);
};


  const fetchPayments = async () => {
  try {
    const { data, error } = await api.payments.getAll();
    console.log('Payments API response:', data); // Debug log
    
    if (error) throw new Error(error);
    
    // Extract content array from paginated response
    const paymentsData = data?.content && Array.isArray(data.content) ? data.content : [];
    setPayments(paymentsData);
    setFilteredPayments(paymentsData);
  } catch (error) {
    console.error('Fetch payments error:', error);
    showToast('Failed to fetch payments', 'error');
    setPayments([]);
    setFilteredPayments([]);
  } finally {
    setLoading(false);
  }
};

const fetchLeases = async () => {
  try {
    const { data, error } = await api.leases.getAll();
    console.log('Leases API response:', data); // Debug log
    
    if (error) throw new Error(error);
    
    // Extract content array from paginated response
    const leasesData = data?.content && Array.isArray(data.content) ? data.content : [];
    const activeLeases = leasesData.filter((lease: any) => lease.status === 'Active');
    setLeases(activeLeases);
  } catch (error) {
    console.error('Fetch leases error:', error);
    showToast('Failed to fetch leases', 'error');
    setLeases([]);
  }
};


  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const payload = {
    leaseId: formData.leaseId,
    amount: parseFloat(formData.amount),
    paymentDate: formData.paymentDate,
    paymentStatus: formData.paymentStatus
  };

  console.log('Payment payload:', payload); // Debug log

  try {
    if (editingPayment) {
      const { error } = await api.payments.update(editingPayment.id, payload);

      if (error) throw new Error(error);
      showToast('Payment updated successfully', 'success');
    } else {
      const { error } = await api.payments.create(payload);

      if (error) throw new Error(error);
      showToast('Payment created successfully', 'success');
    }

    setIsModalOpen(false);
    resetForm();
    fetchPayments();
  } catch (error) {
    showToast('Failed to save payment', 'error');
  }
};


 const handleEdit = (payment: Payment) => {
  setEditingPayment(payment);
  setFormData({
    leaseId: payment.lease_id || (payment as any).leaseId || '',
    amount: payment.amount.toString(),
    paymentDate: payment.payment_date || (payment as any).paymentDate || '',
    paymentStatus: payment.payment_status || (payment as any).paymentStatus || 'Pending'
  });
  setIsModalOpen(true);
};

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this payment?')) return;

    try {
      const { error } = await api.payments.delete(id);

      if (error) throw new Error(error);
      showToast('Payment deleted successfully', 'success');
      fetchPayments();
    } catch (error) {
      showToast('Failed to delete payment', 'error');
    }
  };

  const resetForm = () => {
  setFormData({
    leaseId: '',
    amount: '',
    paymentDate: '',
    paymentStatus: 'Pending'
  });
  setEditingPayment(null);
};

  const clearFilters = () => {
    setFilters({
      status: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'danger'> = {
      Paid: 'success',
      Pending: 'warning',
      Overdue: 'danger'
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  const columns = [
  {
    key: 'lease',
    label: 'Tenant',
    render: (payment: Payment) =>
      payment.lease?.tenant
        ? `${payment.lease.tenant.firstName} ${payment.lease.tenant.lastName}`
        : 'N/A'
  },
  {
    key: 'unit',
    label: 'Unit',
    render: (payment: Payment) =>
      payment.lease?.unit ? `Unit ${payment.lease.unit.unitNumber}` : 'N/A'
  },
  {
    key: 'amount',
    label: 'Amount',
    render: (payment: Payment) => `$${payment.amount}`
  },
  {
    key: 'payment_date',
    label: 'Payment Date',
    render: (payment: Payment) => {
      const date = payment.paymentDate || payment.payment_date;
      return date ? new Date(date).toLocaleDateString() : 'N/A';
    }
  },
  {
    key: 'payment_status',
    label: 'Status',
    render: (payment: Payment) => {
      const status = payment.paymentStatus || payment.payment_status || 'Pending';
      return getStatusBadge(status);
    }
  },
  {
    key: 'actions',
    label: 'Actions',
    render: (payment: Payment) => (
      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" size="sm" onClick={() => handleEdit(payment)}>
          <Edit className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => handleDelete(payment.id)}>
          <Trash2 className="w-4 h-4 text-red-600" />
        </Button>
      </div>
    )
  }
];


  return (
    <DashboardLayout
      currentPage="payments"
      onNavigate={onNavigate}
      title="Payments"
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      showSearch
    >
      <div className="space-y-6">
        <div className="flex justify-between">
          <Button variant="secondary" onClick={() => setIsFilterOpen(true)}>
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Payment
          </Button>
        </div>

        {(filters.status || filters.dateFrom || filters.dateTo) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-900">Filters applied</span>
            </div>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear
            </Button>
          </div>
        )}

        <Table columns={columns} data={filteredPayments} loading={loading} />

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            resetForm();
          }}
          title={editingPayment ? 'Edit Payment' : 'Add Payment'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select
              label="Lease"
              value={formData.leaseId}
              onChange={(e) => setFormData({ ...formData, leaseId: e.target.value })}
              options={leases.map((lease) => ({
                value: lease.id,
                label: `${lease.tenant?.firstName} ${lease.tenant?.lastName} - Unit ${lease.unit?.unitNumber}`
              }))}
              required
            />
            <Input
              label="Amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
            <Input
              label="Payment Date"
              type="date"
              value={formData.paymentDate}
              onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
              required
            />
            <Select
              label="Payment Status"
              value={formData.paymentStatus}
              onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
              options={[
                { value: 'Pending', label: 'Pending' },
                { value: 'Paid', label: 'Paid' },
                { value: 'Overdue', label: 'Overdue' }
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
              <Button type="submit">{editingPayment ? 'Update' : 'Create'}</Button>
            </div>
          </form>
        </Modal>

        <Modal
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          title="Filter Payments"
        >
          <div className="space-y-4">
            <Select
              label="Payment Status"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              options={[
                { value: 'Pending', label: 'Pending' },
                { value: 'Paid', label: 'Paid' },
                { value: 'Overdue', label: 'Overdue' }
              ]}
            />
            <Input
              label="Date From"
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
            />
            <Input
              label="Date To"
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
            />
            <div className="flex gap-3 justify-end pt-4">
              <Button variant="secondary" onClick={() => setIsFilterOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
};
