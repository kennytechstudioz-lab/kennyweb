export interface Service {
  _id?: string;
  image: string;
  icon: string;
  title: string;
  subtitle: string;
  content: string;
  videoUrl?: string;
}

class ServiceStore {
  private static instance: ServiceStore;
  private apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/services`;

  private constructor() {}

  public static getInstance(): ServiceStore {
    if (!ServiceStore.instance) {
      ServiceStore.instance = new ServiceStore();
    }
    return ServiceStore.instance;
  }

  async getServices(): Promise<Service[]> {
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) throw new Error('Failed to fetch services');
      return await response.json();
    } catch (error) {
      console.error('Error fetching services:', error);
      return [];
    }
  }

  async createService(service: Service): Promise<Service | null> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(service),
      });
      if (!response.ok) throw new Error('Failed to create service');
      return await response.json();
    } catch (error) {
      console.error('Error creating service:', error);
      return null;
    }
  }

  async updateService(id: string, service: Partial<Service>): Promise<Service | null> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(service),
      });
      if (!response.ok) throw new Error('Failed to update service');
      return await response.json();
    } catch (error) {
      console.error('Error updating service:', error);
      return null;
    }
  }

  async deleteService(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete service');
      return true;
    } catch (error) {
      console.error('Error deleting service:', error);
      return false;
    }
  }
}

export const serviceStore = ServiceStore.getInstance();
