export interface FavoriteOffer {
    id?: number;
    userId: number;
    offerId: string | number;
    title: string;
    company: string;
    location: string;
}

export interface JobApplication {
    id?: number;
    userId: number;
    offerId: string | number;
    apiSource: string;
    title: string;
    company: string;
    location: string;
    url: string;
    status: 'en_attente' | 'accepte' | 'refuse';
    notes?: string;
    dateAdded: string;
}
