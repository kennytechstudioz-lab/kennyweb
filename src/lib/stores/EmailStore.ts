export interface EmailMessage {
  _id: string;
  messageId?: string;
  uid?: number;
  from: string;
  fromName?: string;
  to: string[];
  subject: string;
  bodyText?: string;
  bodyHtml?: string;
  date: string;
  isRead: boolean;
  isStarred: boolean;
  folder: 'inbox' | 'sent' | 'trash' | 'archive';
  inReplyTo?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedEmailsResult {
  docs: EmailMessage[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  unreadCount: number;
}

class EmailStore {
  private static instance: EmailStore;
  private apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/emails`;

  public emails: EmailMessage[] = [];
  public selectedEmail: EmailMessage | null = null;
  public unreadCount: number = 0;
  public totalDocs: number = 0;
  public totalPages: number = 1;
  public currentPage: number = 1;
  public folder: 'inbox' | 'sent' | 'trash' = 'inbox';
  public searchQuery: string = '';

  public isLoading: boolean = false;
  public isSyncing: boolean = false;
  public isInitialized: boolean = false;
  public syncStatus: 'idle' | 'connected' | 'unconfigured' | 'error' = 'idle';
  public syncMessage: string = '';

  private listeners: Set<() => void> = new Set();
  private hasSyncedOnce: boolean = false;

  private constructor() {}

  public static getInstance(): EmailStore {
    if (!EmailStore.instance) {
      EmailStore.instance = new EmailStore();
    }
    return EmailStore.instance;
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
        console.error('Error in EmailStore listener:', e);
      }
    });
  }

  /**
   * Syncs incoming emails from IMAP webmail server.
   * Can be triggered on app refresh or manually via "Sync" button.
   */
  async syncIncomingEmails(silent = false): Promise<{ success: boolean; message: string }> {
    if (this.isSyncing) {
      return { success: false, message: 'Sync already in progress' };
    }

    this.isSyncing = true;
    if (!silent) {
      this.notify();
    }

    try {
      const response = await fetch(`${this.apiUrl}/sync`, { method: 'POST' });
      const data = await response.json();

      this.syncStatus = data.status || (data.success ? 'connected' : 'error');
      this.syncMessage = data.message || '';
      if (typeof data.unreadCount === 'number') {
        this.unreadCount = data.unreadCount;
      }
      this.hasSyncedOnce = true;

      // Refresh current folder listing quietly
      await this.fetchEmailsFromApi(this.folder, this.currentPage, false);

      this.isSyncing = false;
      this.notify();

      return { success: data.success, message: data.message };
    } catch (error: any) {
      console.error('Error in syncIncomingEmails:', error);
      this.isSyncing = false;
      this.syncStatus = 'error';
      this.syncMessage = error.message || 'Network error syncing with mail server';
      this.notify();
      return { success: false, message: this.syncMessage };
    }
  }

  /**
   * Get emails with caching and background revalidation.
   */
  async getEmails(folder: 'inbox' | 'sent' | 'trash' = 'inbox', page = 1, force = false): Promise<EmailMessage[]> {
    this.folder = folder;
    this.currentPage = page;

    const hasCachedData = this.isInitialized && this.emails.length > 0 && !force;
    if (hasCachedData) {
      // Revalidate in background without flipping loading spinner
      this.fetchEmailsFromApi(folder, page, false).catch(() => {});
      return this.emails;
    }

    return await this.fetchEmailsFromApi(folder, page, true);
  }

  private async fetchEmailsFromApi(folder: string, page: number, notifyLoading: boolean): Promise<EmailMessage[]> {
    if (notifyLoading && this.emails.length === 0) {
      this.isLoading = true;
      this.notify();
    }

    try {
      const searchParam = this.searchQuery ? `&search=${encodeURIComponent(this.searchQuery)}` : '';
      const response = await fetch(`${this.apiUrl}?folder=${folder}&page=${page}&limit=30${searchParam}`);
      if (!response.ok) throw new Error('Failed to fetch emails');
      const data: PaginatedEmailsResult = await response.json();

      this.emails = data.docs || [];
      this.totalDocs = data.totalDocs || 0;
      this.totalPages = data.totalPages || 1;
      this.unreadCount = data.unreadCount || 0;
      this.isInitialized = true;
      this.isLoading = false;

      // Keep selected email updated if it exists in current list
      if (this.selectedEmail) {
        const matching = this.emails.find(e => e._id === this.selectedEmail?._id);
        if (matching) {
          this.selectedEmail = matching;
        }
      }

      this.notify();
      return this.emails;
    } catch (error) {
      console.error('Error fetching emails from API:', error);
      this.isLoading = false;
      this.notify();
      return this.emails;
    }
  }

  /**
   * Selects an email to view full content and marks it as read.
   */
  async selectEmail(email: EmailMessage | null): Promise<void> {
    this.selectedEmail = email;

    if (email && !email.isRead) {
      email.isRead = true;
      this.unreadCount = Math.max(0, this.unreadCount - 1);
      // Update in list
      this.emails = this.emails.map(e => e._id === email._id ? { ...e, isRead: true } : e);
      this.notify();

      // Call API in background
      fetch(`${this.apiUrl}/${email._id}/read`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true }),
      }).catch(err => console.error('Error marking email as read:', err));
    } else {
      this.notify();
    }
  }

  /**
   * Send a reply to an email via SMTP.
   */
  async sendReply(payload: {
    to: string;
    subject: string;
    body: string;
    emailId?: string;
    inReplyTo?: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.apiUrl}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.message || 'Failed to send reply' };
      }

      // If viewing Sent folder, add new message
      if (this.folder === 'sent' && data.sentEmail) {
        this.emails = [data.sentEmail, ...this.emails];
        this.totalDocs++;
      }

      this.notify();
      return { success: true, message: data.message || 'Reply sent successfully!' };
    } catch (error: any) {
      console.error('Error sending reply:', error);
      return { success: false, message: error.message || 'Network error sending reply' };
    }
  }

  /**
   * Compose and send a new email via SMTP.
   */
  async sendNewEmail(payload: {
    to: string;
    subject: string;
    body: string;
    bcc?: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.apiUrl}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.message || 'Failed to send email' };
      }

      if (this.folder === 'sent' && data.sentEmail) {
        this.emails = [data.sentEmail, ...this.emails];
        this.totalDocs++;
      }

      this.notify();
      return { success: true, message: data.message || 'Email sent successfully!' };
    } catch (error: any) {
      console.error('Error sending email:', error);
      return { success: false, message: error.message || 'Network error sending email' };
    }
  }

  /**
   * Toggle read/unread status of an email.
   */
  async toggleRead(id: string): Promise<boolean> {
    const target = this.emails.find(e => e._id === id);
    if (!target) return false;

    const nextIsRead = !target.isRead;
    target.isRead = nextIsRead;
    if (this.selectedEmail?._id === id) {
      this.selectedEmail.isRead = nextIsRead;
    }
    this.unreadCount = nextIsRead ? Math.max(0, this.unreadCount - 1) : this.unreadCount + 1;
    this.notify();

    try {
      await fetch(`${this.apiUrl}/${id}/read`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: nextIsRead }),
      });
      return true;
    } catch (e) {
      console.error('Error toggling read status:', e);
      return false;
    }
  }

  /**
   * Delete email.
   */
  async deleteEmail(id: string): Promise<boolean> {
    this.emails = this.emails.filter(e => e._id !== id);
    if (this.selectedEmail?._id === id) {
      this.selectedEmail = null;
    }
    this.totalDocs = Math.max(0, this.totalDocs - 1);
    this.notify();

    try {
      const response = await fetch(`${this.apiUrl}/${id}`, { method: 'DELETE' });
      return response.ok;
    } catch (e) {
      console.error('Error deleting email:', e);
      return false;
    }
  }

  /**
   * Set search query and fetch.
   */
  setSearch(query: string): void {
    this.searchQuery = query;
    this.fetchEmailsFromApi(this.folder, 1, false);
  }
}

export const emailStore = EmailStore.getInstance();
