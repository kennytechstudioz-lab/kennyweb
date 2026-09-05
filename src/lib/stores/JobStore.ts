export interface Job {
  _id?: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  name: string;
  domain?: string;
  price: number;
  duration: string;
  type: 'Web App' | 'Mobile App' | 'Video Editing' | 'Digital Marketing' | 'Animation' | 'Other';
  description?: string;
}

class JobStore {
  private static instance: JobStore;
  private apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/jobs`;

  private constructor() {}

  public static getInstance(): JobStore {
    if (!JobStore.instance) {
      JobStore.instance = new JobStore();
    }
    return JobStore.instance;
  }

  async getJobs(): Promise<Job[]> {
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) throw new Error('Failed to fetch jobs');
      return await response.json();
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return [];
    }
  }

  async createJob(job: Job): Promise<Job | null> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job),
      });
      if (!response.ok) throw new Error('Failed to create job');
      return await response.json();
    } catch (error) {
      console.error('Error creating job:', error);
      return null;
    }
  }

  async updateJob(id: string, job: Partial<Job>): Promise<Job | null> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job),
      });
      if (!response.ok) throw new Error('Failed to update job');
      return await response.json();
    } catch (error) {
      console.error('Error updating job:', error);
      return null;
    }
  }

  async deleteJob(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete job');
      return true;
    } catch (error) {
      console.error('Error deleting job:', error);
      return false;
    }
  }
}

export const jobStore = JobStore.getInstance();
