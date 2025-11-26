export interface Owner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  created_at?: string;
  updated_at?: string;
}

export interface Property {
  id: string;
  propertyName: string;
  address: string;
  ownerId: string;
  type: 'Apartment' | 'Villa' | 'Office';
  status: 'Available' | 'Occupied' | 'Under Maintenance';
  created_at?: string;
  updated_at?: string;
  owner?: Owner;
}

export interface Unit {
  id: string;
  unitNumber: string;
  size: number;
  floor: number;
  status: 'Available' | 'Occupied' | 'Under Maintenance';
  rent: number;
  property: Property;       // backend sends full object
  photos?: UnitPhoto[];     // optional
  tenants?: Tenant[];
  maintenanceRequests?: MaintenanceRequest[];
  created_at?: string;
  updated_at?: string;
}

export interface Tenant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  unit_id?: string | null;
  created_at?: string;
  updated_at?: string;
  unit?: Unit;
}

export interface Lease {
  id: string;
  tenant_id: string;
  unit_id: string;
  rent_amount: number;
  deposit_amount: number;
  start_date: string;
  end_date: string;
  status: 'Active' | 'Expired' | 'Terminated';
  created_at?: string;
  updated_at?: string;
  tenant?: Tenant;
  unit?: Unit;
}

export interface Payment {
  id: string;
  lease_id: string;
  amount: number;
  payment_date: string;
  payment_status: 'Pending' | 'Paid' | 'Overdue';
  created_at?: string;
  updated_at?: string;
  lease?: Lease;
}

export interface MaintenanceRequest {
  id: string;
  unit_id: string;
  issue_type: 'Plumbing' | 'Electrical' | 'HVAC' | 'Cleaning' | 'Other';
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  assigned_to: string;
  status: 1 | 2 | 3; // 1 - Not Completed, 2 - Started, 3 - Completed
  maintenance_date?: string;
  cost?: number;
  created_at?: string;
  updated_at?: string;
  unit?: Unit;
}

export interface PropertyDocument {
  id: string;
  property_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  created_at?: string;
}

export interface UnitPhoto {
  id: string;
  unit_id: string;
  file_name: string;
  file_url: string;
  is_floor_plan: boolean;
  created_at?: string;
}
