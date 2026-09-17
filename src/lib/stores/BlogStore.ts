export interface Blog {
  _id?: string;
  image: string;
  videoUrl?: string;
  title: string;
  subtitle: string;
  category: string;
  author: string;
  content: string;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

class BlogStore {
  private static instance: BlogStore;
  private apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003'}/api/blogs`;

  public blogs: Blog[] = [];
  public isInitialized: boolean = false;
  public isLoading: boolean = false;

  private listeners: Set<() => void> = new Set();

  private constructor() {}

  public static getInstance(): BlogStore {
    if (!BlogStore.instance) {
      BlogStore.instance = new BlogStore();
    }
    return BlogStore.instance;
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
        console.error('Error in BlogStore listener:', e);
      }
    });
  }

  /**
   * Returns cached blogs immediately from memory if available,
   * while revalidating silently in background.
   */
  async getBlogs(force = false): Promise<Blog[]> {
    if (this.isInitialized && this.blogs.length > 0 && !force) {
      this.fetchFromApi(false).catch(() => {});
      return this.blogs;
    }

    return await this.fetchFromApi(true);
  }

  private async fetchFromApi(notifyLoading: boolean): Promise<Blog[]> {
    if (notifyLoading && this.blogs.length === 0) {
      this.isLoading = true;
      this.notify();
    }

    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) throw new Error('Failed to fetch blogs');
      const data: Blog[] = await response.json();

      this.blogs = Array.isArray(data) ? data : [];
      this.isInitialized = true;
      this.isLoading = false;
      this.notify();

      return this.blogs;
    } catch (error) {
      console.error('Error fetching blogs in BlogStore:', error);
      this.isLoading = false;
      this.notify();
      return this.blogs;
    }
  }

  async createBlog(blog: Blog): Promise<Blog | null> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blog),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create blog (${response.statusText || response.status})`);
      }
      const created: Blog = await response.json();

      // Optimistically prepend to store
      this.blogs = [created, ...this.blogs];
      this.notify();

      return created;
    } catch (error) {
      console.error('Error creating blog:', error);
      throw error;
    }
  }

  async updateBlog(id: string, blog: Partial<Blog>): Promise<Blog | null> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blog),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update blog (${response.statusText || response.status})`);
      }
      const updated: Blog = await response.json();

      // Update in store
      this.blogs = this.blogs.map(b => (b._id === id ? { ...b, ...updated } : b));
      this.notify();

      return updated;
    } catch (error) {
      console.error('Error updating blog:', error);
      throw error;
    }
  }

  async deleteBlog(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete blog');

      // Remove from store
      this.blogs = this.blogs.filter(b => b._id !== id);
      this.notify();

      return true;
    } catch (error) {
      console.error('Error deleting blog:', error);
      return false;
    }
  }
}

export const blogStore = BlogStore.getInstance();
