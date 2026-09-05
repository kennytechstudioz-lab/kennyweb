export interface Blog {
  _id?: string;
  image: string;
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
  private apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/blogs`;

  private constructor() {}

  public static getInstance(): BlogStore {
    if (!BlogStore.instance) {
      BlogStore.instance = new BlogStore();
    }
    return BlogStore.instance;
  }

  async getBlogs(): Promise<Blog[]> {
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) throw new Error('Failed to fetch blogs');
      return await response.json();
    } catch (error) {
      console.error('Error fetching blogs:', error);
      return [];
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
      return await response.json();
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
      return await response.json();
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
      return true;
    } catch (error) {
      console.error('Error deleting blog:', error);
      return false;
    }
  }
}

export const blogStore = BlogStore.getInstance();
