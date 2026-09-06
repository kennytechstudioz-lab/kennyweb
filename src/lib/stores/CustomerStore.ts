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

  public customers: Customer[] = [];
  public totalDocs: number = 0;
  public totalPages: number = 1;
  public currentPage: number = 1;
  public isLoading: boolean = false;
  public isInitialized: boolean = false;

  private listeners: Set<() => void> = new Set();

  private constructor() {}

  public static getInstance(): CustomerStore {
    if (!CustomerStore.instance) {
      CustomerStore.instance = new CustomerStore();
    }
    return CustomerStore.instance;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public notify(): void {
    this.listeners.forEach(listener => {
      try {
        listener();
      } catch (e) {
        console.error('Error in CustomerStore listener:', e);
      }
    });
  }

  /**
   * Fetches and caches customers in the store.
   * If data already exists for the requested page and force is false,
   * it returns immediately from memory and updates in the background.
   */
  async getCustomers(page = 1, limit = 20, force = false): Promise<PaginatedResult<Customer> | null> {
    const hasCachedData = this.isInitialized && this.currentPage === page && this.customers.length > 0;

    if (hasCachedData && !force) {
      // Revalidate in background without blocking or flipping isLoading
      this.fetchFromApi(page, limit, false).catch(() => {});
      return {
        docs: this.customers,
        totalDocs: this.totalDocs,
        limit,
        page: this.currentPage,
        totalPages: this.totalPages,
        hasNextPage: this.currentPage < this.totalPages,
        hasPrevPage: this.currentPage > 1,
      };
    }

    return await this.fetchFromApi(page, limit, true);
  }

  private async fetchFromApi(page: number, limit: number, notifyLoading: boolean): Promise<PaginatedResult<Customer> | null> {
    if (notifyLoading && this.customers.length === 0) {
      this.isLoading = true;
      this.notify();
    }

    try {
      const response = await fetch(`${this.apiUrl}?page=${page}&limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch customers');
      const data: PaginatedResult<Customer> = await response.json();

      this.customers = data.docs || [];
      this.totalDocs = data.totalDocs || 0;
      this.totalPages = data.totalPages || 1;
      this.currentPage = data.page || page;
      this.isInitialized = true;
      this.isLoading = false;
      this.notify();

      return data;
    } catch (error) {
      console.error('Error fetching customers in CustomerStore:', error);
      this.isLoading = false;
      this.notify();
      return null;
    }
  }

  async deleteCustomer(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete customer');

      // Optimistically update store
      this.customers = this.customers.filter(c => c._id !== id);
      this.totalDocs = Math.max(0, this.totalDocs - 1);
      this.notify();
      return true;
    } catch (error) {
      console.error('Error deleting customer:', error);
      return false;
    }
  }

  updateCustomerInStore(id: string, updates: Partial<Customer>): void {
    let updated = false;
    this.customers = this.customers.map(c => {
      if (c._id === id) {
        updated = true;
        return { ...c, ...updates };
      }
      return c;
    });
    if (updated) {
      this.notify();
    }
  }

  removeCustomersFromStore(ids: string[]): void {
    const idSet = new Set(ids);
    const initialCount = this.customers.length;
    this.customers = this.customers.filter(c => !idSet.has(c._id));
    const removedCount = initialCount - this.customers.length;
    this.totalDocs = Math.max(0, this.totalDocs - removedCount);
    this.notify();
  }
}

export const customerStore = CustomerStore.getInstance();
