export interface Company {
  _id?: string;
  name: string;
  domain: string;
  email: string;
  phoneNumber: string;
  address: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  linkedin?: string;
  facebook?: string;
  x?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  yearsExperience?: string;
  completedJobs?: string;
  clients?: string;
  customerSatisfaction?: string;
}

class CompanyStore {
  private static instance: CompanyStore;
  private apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003'}/api/company`;

  public company: Company | null = null;
  public isInitialized: boolean = false;

  private constructor() {}

  public static getInstance(): CompanyStore {
    if (!CompanyStore.instance) {
      CompanyStore.instance = new CompanyStore();
    }
    return CompanyStore.instance;
  }

  async getCompany(force = false): Promise<Company | null> {
    if (this.isInitialized && this.company && !force) {
      return this.company;
    }
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) throw new Error('Failed to fetch company');
      const data = await response.json();
      this.company = data;
      this.isInitialized = true;
      return data;
    } catch (error) {
      console.error(error);
      return this.company;
    }
  }

  async updateCompany(data: Partial<Company>): Promise<Company | null> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update company');
      const updated = await response.json();
      this.company = updated;
      this.isInitialized = true;
      return updated;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

export const companyStore = CompanyStore.getInstance();
