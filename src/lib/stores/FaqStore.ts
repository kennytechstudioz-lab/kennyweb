export interface Faq {
  _id?: string;
  category: string;
  question: string;
  answer: string;
}

class FaqStore {
  private static instance: FaqStore;
  private apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/faq`;

  private constructor() {}

  public static getInstance(): FaqStore {
    if (!FaqStore.instance) {
      FaqStore.instance = new FaqStore();
    }
    return FaqStore.instance;
  }

  async getFaqs(): Promise<Faq[]> {
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) throw new Error('Failed to fetch FAQs');
      return await response.json();
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      return [];
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
      return await response.json();
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
      return await response.json();
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
      return true;
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      return false;
    }
  }
}

export const faqStore = FaqStore.getInstance();
