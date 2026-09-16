export interface Staff {
  _id: string;
  name: string;
  email: string;
  status: 'user' | 'staff' | 'admin';
  position?: string;
  role?: string;
  duties?: string;
  picture?: string;
  quote?: string;
  address?: string;
  staffRank?: number;
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

  // Profile Cache
  public currentUserProfile: Staff | null = null;
  public profilesById: Map<string, Staff> = new Map();

  // Staffs List Cache
  public staffs: Staff[] = [];
  public totalDocs: number = 0;
  public totalPages: number = 1;
  public currentPage: number = 1;
  public isStaffsInitialized: boolean = false;
  public isLoadingStaffs: boolean = false;

  private listeners: Set<() => void> = new Set();

  private constructor() {}

  public static getInstance(): StaffStore {
    if (!StaffStore.instance) {
      StaffStore.instance = new StaffStore();
    }
    return StaffStore.instance;
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
        console.error('Error in StaffStore listener:', e);
      }
    });
  }

  /**
   * Returns cached profile immediately if available, while silently revalidating in background.
   */
  async getUserById(id: string, force = false): Promise<Staff | null> {
    const cached = this.profilesById.get(id);
    if (cached && !force) {
      // Revalidate in background
      this.fetchUserFromApi(id).catch(() => {});
      return cached;
    }

    return await this.fetchUserFromApi(id);
  }

  private async fetchUserFromApi(id: string): Promise<Staff | null> {
    try {
      const response = await fetch(`${this.apiUrl}/users/${id}`);
      if (!response.ok) throw new Error('Failed to fetch user');
      const user: Staff = await response.json();

      this.profilesById.set(id, user);
      if (!this.currentUserProfile || this.currentUserProfile._id === id) {
        this.currentUserProfile = user;
      }
      this.notify();
      return user;
    } catch (error) {
      console.error('Error fetching user by id:', error);
      return this.profilesById.get(id) || null;
    }
  }

  async getStaffs(page = 1, limit = 20, force = false): Promise<PaginatedResult<Staff> | null> {
    const hasCached = this.isStaffsInitialized && this.currentPage === page && this.staffs.length > 0;
    if (hasCached && !force) {
      this.fetchStaffsFromApi(page, limit, false).catch(() => {});
      return {
        docs: this.staffs,
        totalDocs: this.totalDocs,
        limit,
        page: this.currentPage,
        totalPages: this.totalPages,
        hasNextPage: this.currentPage < this.totalPages,
        hasPrevPage: this.currentPage > 1,
      };
    }

    return await this.fetchStaffsFromApi(page, limit, true);
  }

  private async fetchStaffsFromApi(page: number, limit: number, notifyLoading: boolean): Promise<PaginatedResult<Staff> | null> {
    if (notifyLoading && this.staffs.length === 0) {
      this.isLoadingStaffs = true;
      this.notify();
    }

    try {
      const response = await fetch(`${this.apiUrl}/staffs?page=${page}&limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch staffs');
      const data: PaginatedResult<Staff> = await response.json();

      this.staffs = data.docs || [];
      this.totalDocs = data.totalDocs || 0;
      this.totalPages = data.totalPages || 1;
      this.currentPage = data.page || page;
      this.isStaffsInitialized = true;
      this.isLoadingStaffs = false;
      this.notify();

      return data;
    } catch (error) {
      console.error('Error fetching staffs:', error);
      this.isLoadingStaffs = false;
      this.notify();
      return null;
    }
  }

  async getPublicTeam(): Promise<Staff[]> {
    try {
      const response = await fetch(`${this.apiUrl}/team`);
      if (!response.ok) throw new Error('Failed to fetch public team');
      const team: Staff[] = await response.json();
      return team;
    } catch (error) {
      console.error('Error fetching public team:', error);
      return [];
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
      const updated: Staff = await response.json();

      // Update in profile cache
      this.profilesById.set(id, updated);
      if (this.currentUserProfile?._id === id) {
        this.currentUserProfile = updated;
      }

      // Update in staffs list cache if present
      this.staffs = this.staffs.map(s => s._id === id ? { ...s, ...updated } : s);
      this.notify();

      return updated;
    } catch (error) {
      console.error('Error updating staff:', error);
      return null;
    }
  }

  async bulkUpdateStatus(ids: string[], status: 'user' | 'staff' | 'admin', position?: string, role?: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/users/bulk-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, status, position, role }),
      });

      if (response.ok) {
        const idSet = new Set(ids);
        // If changing status away from staff, remove from staffs cache
        if (status !== 'staff') {
          this.staffs = this.staffs.filter(s => !idSet.has(s._id));
        } else {
          this.staffs = this.staffs.map(s => {
            if (idSet.has(s._id)) {
              return {
                ...s,
                status,
                position: position || s.position,
                role: role || s.role,
              };
            }
            return s;
          });
        }
        this.notify();
      }

      return response.ok;
    } catch (error) {
      console.error('Error performing bulk update:', error);
      return false;
    }
  }

  async updateCredentials(
    id: string,
    currentPassword: string,
    newPassword?: string,
    newEmail?: string
  ): Promise<{ success: boolean; message: string; user?: any }> {
    try {
      const response = await fetch(`${this.apiUrl}/users/${id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword, newEmail }),
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.message || 'Failed to update credentials' };
      }

      if (data.user) {
        const existing = this.profilesById.get(id) || ({} as Staff);
        const merged: Staff = { ...existing, ...data.user };
        this.profilesById.set(id, merged);
        if (this.currentUserProfile?._id === id) {
          this.currentUserProfile = merged;
        }
      } else if (newEmail) {
        const cached = this.profilesById.get(id);
        if (cached) {
          cached.email = newEmail;
          this.profilesById.set(id, cached);
          if (this.currentUserProfile?._id === id) {
            this.currentUserProfile = cached;
          }
        }
      }
      this.notify();

      return { success: true, message: data.message || 'Credentials updated successfully', user: data.user };
    } catch (error: any) {
      console.error('Error updating credentials:', error);
      return { success: false, message: error.message || 'Network error updating credentials' };
    }
  }

  async updatePassword(id: string, currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    return this.updateCredentials(id, currentPassword, newPassword);
  }
}

export const staffStore = StaffStore.getInstance();
