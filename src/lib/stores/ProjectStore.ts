export interface Project {
  _id?: string;
  name: string;
  image: string;
  videoUrl?: string;
  description: string;
  category: string;
  staff: string;
  price: number;
  features?: string[];
}

class ProjectStore {
  private static instance: ProjectStore;
  private apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003'}/api/projects`;

  public projects: Project[] = [];
  public isInitialized: boolean = false;

  private constructor() {}

  public static getInstance(): ProjectStore {
    if (!ProjectStore.instance) {
      ProjectStore.instance = new ProjectStore();
    }
    return ProjectStore.instance;
  }

  async getProjects(force = false): Promise<Project[]> {
    if (this.isInitialized && this.projects.length > 0 && !force) {
      return this.projects;
    }
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data: Project[] = await response.json();
      this.projects = Array.isArray(data) ? data : [];
      this.isInitialized = true;
      return this.projects;
    } catch (error) {
      console.error('Error fetching projects:', error);
      return this.projects;
    }
  }

  async createProject(project: Project): Promise<Project | null> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });
      if (!response.ok) throw new Error('Failed to create project');
      return await response.json();
    } catch (error) {
      console.error('Error creating project:', error);
      return null;
    }
  }

  async updateProject(id: string, project: Partial<Project>): Promise<Project | null> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });
      if (!response.ok) throw new Error('Failed to update project');
      return await response.json();
    } catch (error) {
      console.error('Error updating project:', error);
      return null;
    }
  }

  async deleteProject(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete project');
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      return false;
    }
  }
}

export const projectStore = ProjectStore.getInstance();
