export interface Faq {
  _id?: string;
  category: string;
  question: string;
  answer: string;
}

class FaqStore {
  private static instance: FaqStore;
  private apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003'}/api/faq`;

  public faqs: Faq[] = [];
  public isInitialized: boolean = false;
  public isLoading: boolean = false;

  private listeners: Set<() => void> = new Set();

  private constructor() {}

  public static getInstance(): FaqStore {
    if (!FaqStore.instance) {
      FaqStore.instance = new FaqStore();
    }
    return FaqStore.instance;
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
        console.error('Error in FaqStore listener:', e);
      }
    });
  }

  /**
   * Returns cached FAQs immediately from memory if available,
   * while revalidating silently in background.
   */
  async getFaqs(force = false): Promise<Faq[]> {
    if (this.isInitialized && this.faqs.length > 0 && !force) {
      this.fetchFromApi(false).catch(() => {});
      return this.faqs;
    }

    return await this.fetchFromApi(true);
  }

  private async fetchFromApi(notifyLoading: boolean): Promise<Faq[]> {
    if (notifyLoading && this.faqs.length === 0) {
      this.isLoading = true;
      this.notify();
    }

    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) throw new Error('Failed to fetch FAQs');
      const data: Faq[] = await response.json();

      this.faqs = Array.isArray(data) ? data : [];
      this.isInitialized = true;
      this.isLoading = false;
      this.notify();

      return this.faqs;
    } catch (error) {
      console.error('Error fetching FAQs in FaqStore:', error);
      this.isLoading = false;
      this.notify();
      return this.faqs;
    }
  }

  async createFaq(faq: Faq): Promise<Faq | null> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(faq),
      });
      if (!response.ok) throw new Error('Failed to create FAQ');
      const created: Faq = await response.json();

      // Optimistically prepend to store
      this.faqs = [created, ...this.faqs];
      this.notify();

      return created;
    } catch (error) {
      console.error('Error creating FAQ:', error);
      return null;
    }
  }

  async updateFaq(id: string, faq: Partial<Faq>): Promise<Faq | null> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(faq),
      });
      if (!response.ok) throw new Error('Failed to update FAQ');
      const updated: Faq = await response.json();

      // Update in store
      this.faqs = this.faqs.map(f => (f._id === id ? { ...f, ...updated } : f));
      this.notify();

      return updated;
    } catch (error) {
      console.error('Error updating FAQ:', error);
      return null;
    }
  }

  async deleteFaq(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete FAQ');

      // Remove from store
      this.faqs = this.faqs.filter(f => f._id !== id);
      this.notify();

      return true;
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      return false;
    }
  }
}

export const faqStore = FaqStore.getInstance();
