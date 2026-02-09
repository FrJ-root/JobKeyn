export interface JobOffer {
    id: string | number;
    title: string;
    company: {
        display_name: string;
    };
    location: {
        display_name: string;
    };
    created: string;
    description: string;
    redirect_url: string;
    salary_min?: number;
    salary_max?: number;
    contract_type?: string;
}

export interface JobSearchResponse {
    results: JobOffer[];
    count: number;
}
