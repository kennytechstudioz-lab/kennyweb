export interface NotificationTemplate {
  _id?: string;
  name: string;
  title: string;
  greetings: string;
  content: string;
}

class NotificationTemplateStore {
  private static instance: NotificationTemplateStore;
  private apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/notification-templates`;

  private constructor() {}

  public static getInstance(): NotificationTemplateStore {
    if (!NotificationTemplateStore.instance) {
      NotificationTemplateStore.instance = new NotificationTemplateStore();
    }
    return NotificationTemplateStore.instance;
  }

  async getTemplates(): Promise<NotificationTemplate[]> {
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) throw new Error('Failed to fetch notification templates');
      return await response.json();
    } catch (error) {
      console.error('Error fetching notification templates:', error);
      return [];
    }
  }

  async createTemplate(template: NotificationTemplate): Promise<NotificationTemplate | null> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(template),
      });
      if (!response.ok) throw new Error('Failed to create notification template');
      return await response.json();
    } catch (error) {
      console.error('Error creating notification template:', error);
      return null;
    }
  }

  async updateTemplate(id: string, template: Partial<NotificationTemplate>): Promise<NotificationTemplate | null> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(template),
      });
      if (!response.ok) throw new Error('Failed to update notification template');
      return await response.json();
    } catch (error) {
      console.error('Error updating notification template:', error);
      return null;
    }
  }

  async deleteTemplate(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete notification template');
      return true;
    } catch (error) {
      console.error('Error deleting notification template:', error);
      return false;
    }
  }
}

export const notificationTemplateStore = NotificationTemplateStore.getInstance();
