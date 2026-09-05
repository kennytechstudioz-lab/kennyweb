export interface Tutorial {
  _id?: string;
  title: string;
  duration: string;
  price: number;
  image: string;
  instructor: string;
  description?: string;
}

class TutorialStore {
  private static instance: TutorialStore;
  private apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/tutorials`;

  private constructor() {}

  public static getInstance(): TutorialStore {
    if (!TutorialStore.instance) {
      TutorialStore.instance = new TutorialStore();
    }
    return TutorialStore.instance;
  }

  async getTutorials(): Promise<Tutorial[]> {
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) throw new Error('Failed to fetch tutorials');
      return await response.json();
    } catch (error) {
      console.error('Error fetching tutorials:', error);
      return [];
    }
  }

  async createTutorial(tutorial: Tutorial): Promise<Tutorial | null> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tutorial),
      });
      if (!response.ok) throw new Error('Failed to create tutorial');
      return await response.json();
    } catch (error) {
      console.error('Error creating tutorial:', error);
      return null;
    }
  }

  async updateTutorial(id: string, tutorial: Partial<Tutorial>): Promise<Tutorial | null> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tutorial),
      });
      if (!response.ok) throw new Error('Failed to update tutorial');
      return await response.json();
    } catch (error) {
      console.error('Error updating tutorial:', error);
      return null;
    }
  }

  async deleteTutorial(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete tutorial');
      return true;
    } catch (error) {
      console.error('Error deleting tutorial:', error);
      return false;
    }
  }
}

export const tutorialStore = TutorialStore.getInstance();
