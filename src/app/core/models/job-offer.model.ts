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
    source?: 'arbeitnow' | 'themuse' | 'adzuna';
}

export interface JobSearchResponse {
    results: JobOffer[];
    count: number;
}

// Arbeitnow API Response Interfaces
export interface ArbeitnowJob {
    slug: string;
    company_name: string;
    title: string;
    description: string;
    remote: boolean;
    url: string;
    tags: string[];
    job_types: string[];
    location: string;
    created_at: number;
}

export interface ArbeitnowResponse {
    data: ArbeitnowJob[];
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number;
        path: string;
        per_page: number;
        to: number;
    };
}

// The Muse API Response Interfaces
export interface MuseJob {
    id: number;
    name: string;
    company: {
        id: number;
        name: string;
    };
    locations: Array<{
        name: string;
    }>;
    publication_date: string;
    contents: string;
    refs: {
        landing_page: string;
    };
    levels?: Array<{
        name: string;
    }>;
    categories?: Array<{
        name: string;
    }>;
}

export interface MuseResponse {
    results: MuseJob[];
    page_count: number;
    page: number;
    total_count: number;
}

// Adzuna API Response Interfaces (already matches our JobOffer format closely)
export interface AdzunaJob {
    id: string;
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

export interface AdzunaResponse {
    results: AdzunaJob[];
    count: number;
}
