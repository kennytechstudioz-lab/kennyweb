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
}

class CompanyStore {
  private static instance: CompanyStore;
  private apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001'}/api/company`;

  private constructor() {}

  public static getInstance(): CompanyStore {
    if (!CompanyStore.instance) {
      CompanyStore.instance = new CompanyStore();
    }
    return CompanyStore.instance;
  }

  async getCompany(): Promise<Company | null> {
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) throw new Error('Failed to fetch company');
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
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
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

export const companyStore = CompanyStore.getInstance();
