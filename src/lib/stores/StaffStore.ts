export interface Staff {
  _id: string;
  name: string;
  email: string;
  status: 'user' | 'staff' | 'admin';
  position?: string;
  createdAt: string;
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

class StaffStore {
  private static instance: StaffStore;
  private apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/auth`;

  private constructor() {}

  public static getInstance(): StaffStore {
    if (!StaffStore.instance) {
      StaffStore.instance = new StaffStore();
    }
    return StaffStore.instance;
  }

  async getStaffs(page = 1, limit = 20): Promise<PaginatedResult<Staff> | null> {
    try {
      const response = await fetch(`${this.apiUrl}/staffs?page=${page}&limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch staffs');
      return await response.json();
    } catch (error) {
      console.error('Error fetching staffs:', error);
      return null;
    }
  }

  async updateStaff(id: string, staff: Partial<Staff>): Promise<Staff | null> {
    try {
      const response = await fetch(`${this.apiUrl}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(staff),
      });
      if (!response.ok) throw new Error('Failed to update staff');
      return await response.json();
    } catch (error) {
      console.error('Error updating staff:', error);
      return null;
    }
  }

  async bulkUpdateStatus(ids: string[], status: 'user' | 'staff' | 'admin'): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/users/bulk-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, status }),
      });
      return response.ok;
    } catch (error) {
      console.error('Error performing bulk update:', error);
      return false;
    }
  }
}

export const staffStore = StaffStore.getInstance();
