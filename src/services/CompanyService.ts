export interface Company {
    id: string;
    name: string;
}

const API = 'http://localhost:3000/companies';

class CompanyService {
    async fetchCompanies(): Promise<Company[]> {
        const res = await fetch(API);
        return res.json();
    }
}

export default new CompanyService();