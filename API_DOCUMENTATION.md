# Property Management System - API Documentation

This document describes the REST API endpoints required for the Spring Boot backend.

## Base URL
```
http://localhost:8080/api
```

Configure this in `.env` file:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## Database Schema

### Tables

1. **owners**
   - id (UUID, Primary Key)
   - first_name (String)
   - last_name (String)
   - email (String, Unique)
   - phone_number (String)
   - address (String)
   - created_at (Timestamp)
   - updated_at (Timestamp)

2. **properties**
   - id (UUID, Primary Key)
   - property_name (String)
   - address (String)
   - owner_id (UUID, Foreign Key → owners.id)
   - type (Enum: "Apartment", "Villa", "Office")
   - status (Enum: "Available", "Occupied", "Under Maintenance")
   - created_at (Timestamp)
   - updated_at (Timestamp)

3. **units**
   - id (UUID, Primary Key)
   - unit_number (String)
   - property_id (UUID, Foreign Key → properties.id)
   - size (Decimal)
   - floor (Integer)
   - status (Enum: "Available", "Occupied", "Under Maintenance")
   - rent (Decimal)
   - created_at (Timestamp)
   - updated_at (Timestamp)

4. **tenants**
   - id (UUID, Primary Key)
   - first_name (String)
   - last_name (String)
   - email (String, Unique)
   - phone_number (String)
   - unit_id (UUID, Foreign Key → units.id, Nullable)
   - created_at (Timestamp)
   - updated_at (Timestamp)

5. **leases**
   - id (UUID, Primary Key)
   - tenant_id (UUID, Foreign Key → tenants.id)
   - unit_id (UUID, Foreign Key → units.id)
   - rent_amount (Decimal)
   - deposit_amount (Decimal)
   - start_date (Date)
   - end_date (Date)
   - status (Enum: "Active", "Expired", "Terminated")
   - created_at (Timestamp)
   - updated_at (Timestamp)

6. **payments**
   - id (UUID, Primary Key)
   - lease_id (UUID, Foreign Key → leases.id)
   - amount (Decimal)
   - payment_date (Date)
   - payment_status (Enum: "Pending", "Paid", "Overdue")
   - created_at (Timestamp)
   - updated_at (Timestamp)

7. **maintenance_requests**
   - id (UUID, Primary Key)
   - unit_id (UUID, Foreign Key → units.id)
   - issue_type (Enum: "Plumbing", "Electrical", "HVAC", "Cleaning", "Other")
   - description (Text)
   - priority (Enum: "Low", "Medium", "High")
   - assigned_to (String)
   - status (Enum: "Pending", "In Progress", "Completed")
   - created_at (Timestamp)
   - updated_at (Timestamp)

---

## API Endpoints

### Owners

#### Get All Owners
```
GET /api/owners
```
**Response:** Array of owner objects
```json
[
  {
    "id": "uuid",
    "first_name": "string",
    "last_name": "string",
    "email": "string",
    "phone_number": "string",
    "address": "string",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
]
```

#### Create Owner
```
POST /api/owners
```
**Request Body:**
```json
{
  "first_name": "string",
  "last_name": "string",
  "email": "string",
  "phone_number": "string",
  "address": "string"
}
```
**Response:** Created owner object

#### Update Owner
```
PUT /api/owners/{id}
```
**Request Body:** Same as Create Owner
**Response:** Updated owner object

#### Delete Owner
```
DELETE /api/owners/{id}
```
**Response:** 204 No Content

---

### Properties

#### Get All Properties
```
GET /api/properties
```
**Response:** Array of property objects with nested owner data
```json
[
  {
    "id": "uuid",
    "property_name": "string",
    "address": "string",
    "owner_id": "uuid",
    "type": "Apartment|Villa|Office",
    "status": "Available|Occupied|Under Maintenance",
    "created_at": "timestamp",
    "updated_at": "timestamp",
    "owner": {
      "id": "uuid",
      "first_name": "string",
      "last_name": "string",
      ...
    }
  }
]
```

#### Create Property
```
POST /api/properties
```
**Request Body:**
```json
{
  "property_name": "string",
  "address": "string",
  "owner_id": "uuid",
  "type": "Apartment|Villa|Office",
  "status": "Available|Occupied|Under Maintenance"
}
```

#### Update Property
```
PUT /api/properties/{id}
```
**Request Body:** Same as Create Property

#### Delete Property
```
DELETE /api/properties/{id}
```

---

### Units

#### Get All Units
```
GET /api/units
```
**Response:** Array of unit objects with nested property data
```json
[
  {
    "id": "uuid",
    "unit_number": "string",
    "property_id": "uuid",
    "size": 1200.50,
    "floor": 3,
    "status": "Available|Occupied|Under Maintenance",
    "rent": 2500.00,
    "created_at": "timestamp",
    "updated_at": "timestamp",
    "property": {
      "id": "uuid",
      "property_name": "string",
      ...
    }
  }
]
```

#### Create Unit
```
POST /api/units
```
**Request Body:**
```json
{
  "unit_number": "string",
  "property_id": "uuid",
  "size": 1200.50,
  "floor": 3,
  "status": "Available|Occupied|Under Maintenance",
  "rent": 2500.00
}
```

#### Update Unit
```
PUT /api/units/{id}
```

#### Delete Unit
```
DELETE /api/units/{id}
```

---

### Tenants

#### Get All Tenants
```
GET /api/tenants
```
**Response:** Array with nested unit and property data
```json
[
  {
    "id": "uuid",
    "first_name": "string",
    "last_name": "string",
    "email": "string",
    "phone_number": "string",
    "unit_id": "uuid|null",
    "created_at": "timestamp",
    "updated_at": "timestamp",
    "unit": {
      "id": "uuid",
      "unit_number": "string",
      "property": {
        "id": "uuid",
        "property_name": "string",
        ...
      },
      ...
    }
  }
]
```

#### Create Tenant
```
POST /api/tenants
```
**Request Body:**
```json
{
  "first_name": "string",
  "last_name": "string",
  "email": "string",
  "phone_number": "string",
  "unit_id": "uuid|null"
}
```

#### Update Tenant
```
PUT /api/tenants/{id}
```

#### Delete Tenant
```
DELETE /api/tenants/{id}
```

---

### Leases

#### Get All Leases
```
GET /api/leases
```
**Response:** Array with nested tenant and unit data
```json
[
  {
    "id": "uuid",
    "tenant_id": "uuid",
    "unit_id": "uuid",
    "rent_amount": 2500.00,
    "deposit_amount": 5000.00,
    "start_date": "2024-01-01",
    "end_date": "2025-01-01",
    "status": "Active|Expired|Terminated",
    "created_at": "timestamp",
    "updated_at": "timestamp",
    "tenant": {
      "id": "uuid",
      "first_name": "string",
      "last_name": "string",
      ...
    },
    "unit": {
      "id": "uuid",
      "unit_number": "string",
      "property": {...},
      ...
    }
  }
]
```

#### Create Lease
```
POST /api/leases
```
**Request Body:**
```json
{
  "tenant_id": "uuid",
  "unit_id": "uuid",
  "rent_amount": 2500.00,
  "deposit_amount": 5000.00,
  "start_date": "2024-01-01",
  "end_date": "2025-01-01",
  "status": "Active"
}
```

#### Update Lease
```
PUT /api/leases/{id}
```

#### Delete Lease
```
DELETE /api/leases/{id}
```

---

### Payments

#### Get All Payments
```
GET /api/payments
```
**Response:** Array with nested lease, tenant, and unit data
```json
[
  {
    "id": "uuid",
    "lease_id": "uuid",
    "amount": 2500.00,
    "payment_date": "2024-01-15",
    "payment_status": "Pending|Paid|Overdue",
    "created_at": "timestamp",
    "updated_at": "timestamp",
    "lease": {
      "id": "uuid",
      "tenant": {
        "id": "uuid",
        "first_name": "string",
        "last_name": "string",
        ...
      },
      "unit": {
        "id": "uuid",
        "unit_number": "string",
        ...
      },
      ...
    }
  }
]
```

#### Create Payment
```
POST /api/payments
```
**Request Body:**
```json
{
  "lease_id": "uuid",
  "amount": 2500.00,
  "payment_date": "2024-01-15",
  "payment_status": "Pending|Paid|Overdue"
}
```

#### Update Payment
```
PUT /api/payments/{id}
```

#### Delete Payment
```
DELETE /api/payments/{id}
```

---

### Maintenance Requests

#### Get All Maintenance Requests
```
GET /api/maintenance-requests
```
**Response:** Array with nested unit and property data
```json
[
  {
    "id": "uuid",
    "unit_id": "uuid",
    "issue_type": "Plumbing|Electrical|HVAC|Cleaning|Other",
    "description": "string",
    "priority": "Low|Medium|High",
    "assigned_to": "string",
    "status": "Pending|In Progress|Completed",
    "created_at": "timestamp",
    "updated_at": "timestamp",
    "unit": {
      "id": "uuid",
      "unit_number": "string",
      "property": {
        "id": "uuid",
        "property_name": "string",
        ...
      },
      ...
    }
  }
]
```

#### Create Maintenance Request
```
POST /api/maintenance-requests
```
**Request Body:**
```json
{
  "unit_id": "uuid",
  "issue_type": "Plumbing|Electrical|HVAC|Cleaning|Other",
  "description": "string",
  "priority": "Low|Medium|High",
  "assigned_to": "string",
  "status": "Pending"
}
```

#### Update Maintenance Request
```
PUT /api/maintenance-requests/{id}
```
**Request Body:** Can include partial updates, commonly just:
```json
{
  "status": "In Progress|Completed"
}
```

#### Delete Maintenance Request
```
DELETE /api/maintenance-requests/{id}
```

---

### Dashboard Stats

#### Get Dashboard Statistics
```
GET /api/dashboard/stats
```
**Response:**
```json
{
  "totalProperties": 50,
  "totalUnits": 200,
  "occupiedUnits": 180,
  "activeLeases": 175,
  "pendingMaintenance": 12,
  "outstandingPayments": 8,
  "totalRevenue": 450000.00
}
```

**Calculation Logic:**
- `totalProperties`: Count of all properties
- `totalUnits`: Count of all units
- `occupiedUnits`: Count of units where status = "Occupied"
- `activeLeases`: Count of leases where status = "Active"
- `pendingMaintenance`: Count of maintenance_requests where status IN ("Pending", "In Progress")
- `outstandingPayments`: Count of payments where payment_status IN ("Pending", "Overdue")
- `totalRevenue`: Sum of payments.amount where payment_status = "Paid"

---

## Error Responses

All endpoints should return consistent error responses:

```json
{
  "error": "Error message description"
}
```

**Status Codes:**
- 200: OK
- 201: Created
- 204: No Content (for DELETE)
- 400: Bad Request
- 404: Not Found
- 500: Internal Server Error

---

## CORS Configuration

Make sure your Spring Boot backend allows CORS from your frontend:

```java
@CrossOrigin(origins = "http://localhost:5173")
```

Or configure globally in Spring Boot.

---

## Notes

1. All responses should include nested/related entities as shown in the examples
2. Use JSON for request/response bodies
3. UUIDs should be in standard UUID format
4. Timestamps should be in ISO 8601 format
5. All decimal fields (rent, amounts) should support up to 2 decimal places
6. Ensure proper validation on the backend for enum fields
7. Implement cascading deletes where appropriate (e.g., deleting a property should delete its units)
