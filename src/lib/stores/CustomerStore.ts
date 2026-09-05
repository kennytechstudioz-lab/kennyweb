export interface Customer {
  _id: string;
  name: string;
  email: string;
  status: 'user' | 'staff' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResult<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

class CustomerStore {
  private static instance: CustomerStore;
  private apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/auth/users`;

  private constructor() {}

  public static getInstance(): CustomerStore {
    if (!CustomerStore.instance) {
      CustomerStore.instance = new CustomerStore();
    }
    return CustomerStore.instance;
  }

  async getCustomers(page = 1, limit = 20): Promise<PaginatedResult<Customer> | null> {
    try {
      const response = await fetch(`${this.apiUrl}?page=${page}&limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch customers');
      return await response.json();
    } catch (error) {
      console.error('Error fetching customers:', error);
      return null;
    }
  }

  async deleteCustomer(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete customer');
      return true;
    } catch (error) {
      console.error('Error deleting customer:', error);
      return false;
    }
  }
}

export const customerStore = CustomerStore.getInstance();
