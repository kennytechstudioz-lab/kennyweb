export interface Position {
  _id?: string;
  position: string;
  role?: string;
  duties?: string;
  rank: string;
  salary: number;
  createdAt?: string;
  updatedAt?: string;
}

class PositionStore {
  private static instance: PositionStore;
  private apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/positions`;

  private constructor() {}

  public static getInstance(): PositionStore {
    if (!PositionStore.instance) {
      PositionStore.instance = new PositionStore();
    }
    return PositionStore.instance;
  }

  async getPositions(): Promise<Position[]> {
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) throw new Error('Failed to fetch positions');
      return await response.json();
    } catch (error) {
      console.error('Error fetching positions:', error);
      return [];
    }
  }

  async getPositionById(id: string): Promise<Position | null> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`);
      if (!response.ok) throw new Error('Failed to fetch position');
      return await response.json();
    } catch (error) {
      console.error(`Error fetching position ${id}:`, error);
      return null;
    }
  }

  async createPosition(position: Omit<Position, '_id'>): Promise<Position | null> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(position),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to create position');
      }
      return await response.json();
    } catch (error: any) {
      console.error('Error creating position:', error);
      throw error;
    }
  }

  async updatePosition(id: string, position: Partial<Position>): Promise<Position | null> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(position),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to update position');
      }
      return await response.json();
    } catch (error: any) {
      console.error('Error updating position:', error);
      throw error;
    }
  }

  async deletePosition(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete position');
      return true;
    } catch (error) {
      console.error('Error deleting position:', error);
      return false;
    }
  }
}

export const positionStore = PositionStore.getInstance();
