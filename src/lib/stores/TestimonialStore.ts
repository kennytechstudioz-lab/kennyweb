export interface Testimonial {
  _id?: string;
  clientName: string;
  clientRole?: string;
  picture?: string;
  content: string;
  rating: number;
  clientProjectLink?: string;
  createdAt?: string;
  updatedAt?: string;
}

class TestimonialStore {
  private static instance: TestimonialStore;
  private apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003'}/api/testimonials`;

  public testimonials: Testimonial[] = [];
  public isInitialized: boolean = false;
  public isLoading: boolean = false;

  private listeners: Set<() => void> = new Set();

  private constructor() {}

  public static getInstance(): TestimonialStore {
    if (!TestimonialStore.instance) {
      TestimonialStore.instance = new TestimonialStore();
    }
    return TestimonialStore.instance;
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
        console.error('Error in TestimonialStore listener:', e);
      }
    });
  }

  async getTestimonials(force = false): Promise<Testimonial[]> {
    if (this.isInitialized && this.testimonials.length > 0 && !force) {
      this.fetchFromApi(false).catch(() => {});
      return this.testimonials;
    }
    return await this.fetchFromApi(true);
  }

  private async fetchFromApi(notifyLoading: boolean): Promise<Testimonial[]> {
    if (notifyLoading && this.testimonials.length === 0) {
      this.isLoading = true;
      this.notify();
    }

    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) throw new Error('Failed to fetch testimonials');
      const data = await response.json();
      this.testimonials = Array.isArray(data) ? data : [];
      this.isInitialized = true;
      return this.testimonials;
    } catch (error) {
      console.error('TestimonialStore fetch error:', error);
      return this.testimonials;
    } finally {
      this.isLoading = false;
      this.notify();
    }
  }

  async createTestimonial(data: Partial<Testimonial>): Promise<Testimonial | null> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create testimonial');
      const created = await response.json();
      this.testimonials.unshift(created);
      this.notify();
      return created;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async updateTestimonial(id: string, data: Partial<Testimonial>): Promise<Testimonial | null> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update testimonial');
      const updated = await response.json();
      this.testimonials = this.testimonials.map(item => (item._id === id ? updated : item));
      this.notify();
      return updated;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async deleteTestimonial(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete testimonial');
      this.testimonials = this.testimonials.filter(item => item._id !== id);
      this.notify();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}

export const testimonialStore = TestimonialStore.getInstance();
