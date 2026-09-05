export interface EmailTemplate {
  _id?: string;
  name: string;
  title: string;
  greetings: string;
  bannerImage: string;
  content: string;
}

class EmailTemplateStore {
  private static instance: EmailTemplateStore;
  private apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/email-templates`;

  private constructor() {}

  public static getInstance(): EmailTemplateStore {
    if (!EmailTemplateStore.instance) {
      EmailTemplateStore.instance = new EmailTemplateStore();
    }
    return EmailTemplateStore.instance;
  }

  async getTemplates(): Promise<EmailTemplate[]> {
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) throw new Error('Failed to fetch email templates');
      return await response.json();
    } catch (error) {
      console.error('Error fetching email templates:', error);
      return [];
    }
  }

  async createTemplate(template: EmailTemplate): Promise<EmailTemplate | null> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(template),
      });
      if (!response.ok) throw new Error('Failed to create email template');
      return await response.json();
    } catch (error) {
      console.error('Error creating email template:', error);
      return null;
    }
  }

  async updateTemplate(id: string, template: Partial<EmailTemplate>): Promise<EmailTemplate | null> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(template),
      });
      if (!response.ok) throw new Error('Failed to update email template');
      return await response.json();
    } catch (error) {
      console.error('Error updating email template:', error);
      return null;
    }
  }

  async deleteTemplate(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete email template');
      return true;
    } catch (error) {
      console.error('Error deleting email template:', error);
      return false;
    }
  }
}

export const emailTemplateStore = EmailTemplateStore.getInstance();
