const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
//   if (!response.ok) {
//     const error = await response.text();
//     return { error: error || 'An error occurred' };
//   }

//   const data = await response.json();
//   return { data };
// }

const handleResponse = async (res: Response) => {
  if (res.status === 204) {
    return { data: null, error: null };
  }

  let text = await res.text();
  if (!text) {
    return { data: null, error: null };
  }

  try {
    const json = JSON.parse(text);
    return { data: json, error: null };
  } catch (e) {
    return { data: null, error: 'Invalid JSON from server' };
  }
};


export const api = {
  owners: {
    getAll: async <T = any>() => {
      const response = await fetch(`${API_BASE_URL}/owners`);
      return handleResponse(response);
    },
    create: async (data: any) => {
      const response = await fetch(`${API_BASE_URL}/owners`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    },
    update: async (id: string, data: any) => {
      const response = await fetch(`${API_BASE_URL}/owners/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    },
    delete: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/owners/${id}`, {
        method: 'DELETE'
      });
      return handleResponse(response);
    }
  },

  properties: {
    getAll: async <T = any>() => {
      const response = await fetch(`${API_BASE_URL}/properties`);
      return handleResponse(response);
    },
    create: async (data: any) => {
      const response = await fetch(`${API_BASE_URL}/properties`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    },
    update: async (id: string, data: any) => {
      const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    },
    delete: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
        method: 'DELETE'
      });
      return handleResponse(response);
    }
  },

  units: {
    getAll: async <T = any>() => {
      const response = await fetch(`${API_BASE_URL}/units`);
      return handleResponse(response);
    },
    create: async (data: any) => {
      const response = await fetch(`${API_BASE_URL}/units`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    },
    update: async (id: string, data: any) => {
      const response = await fetch(`${API_BASE_URL}/units/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    },
    delete: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/units/${id}`, {
        method: 'DELETE'
      });
      return handleResponse(response);
    }
  },

  tenants: {
    getAll: async <T = any>() => {
      const response = await fetch(`${API_BASE_URL}/tenants`);
      return handleResponse(response);
    },
    create: async (data: any) => {
      const response = await fetch(`${API_BASE_URL}/tenants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    },
    update: async (id: string, data: any) => {
      const response = await fetch(`${API_BASE_URL}/tenants/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    },
    delete: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/tenants/${id}`, {
        method: 'DELETE'
      });
      return handleResponse(response);
    }
  },

  leases: {
    getAll: async <T = any>() => {
      const response = await fetch(`${API_BASE_URL}/leases`);
      return handleResponse(response);
    },
    create: async (data: any) => {
      const response = await fetch(`${API_BASE_URL}/leases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    },
    update: async (id: string, data: any) => {
      const response = await fetch(`${API_BASE_URL}/leases/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    },
    delete: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/leases/${id}`, {
        method: 'DELETE'
      });
      return handleResponse(response);
    }
  },

  payments: {
    getAll: async <T = any>() => {
      const response = await fetch(`${API_BASE_URL}/payments`);
      return handleResponse(response);
    },
    create: async (data: any) => {
      const response = await fetch(`${API_BASE_URL}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    },
    update: async (id: string, data: any) => {
      const response = await fetch(`${API_BASE_URL}/payments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    },
    delete: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/payments/${id}`, {
        method: 'DELETE'
      });
      return handleResponse(response);
    }
  },

  maintenance: {
    getAll: async <T = any>() => {
      const response = await fetch(`${API_BASE_URL}/maintenance-requests`);
      return handleResponse(response);
    },
    create: async (data: any) => {
      const response = await fetch(`${API_BASE_URL}/maintenance-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    },
    update: async (id: string, data: any) => {
      const response = await fetch(`${API_BASE_URL}/maintenance-requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return handleResponse(response);
    },
    delete: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/maintenance-requests/${id}`, {
        method: 'DELETE'
      });
      return handleResponse(response);
    }
  },

  dashboard: {
    getStats: async <T = any>() => {
      const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
      return handleResponse(response);
    }
  }
};
