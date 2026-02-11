import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs';
import {
    JobSearchResponse,
    JobOffer,
    ArbeitnowResponse,
    ArbeitnowJob,
    MuseResponse,
    MuseJob,
    AdzunaResponse,
    AdzunaJob
} from '../models/job-offer.model';

@Injectable({
    providedIn: 'root'
})
export class JobService {
    // API Endpoints
    private arbeitnowUrl = 'https://www.arbeitnow.com/api/job-board-api';
    private museUrl = 'https://www.themuse.com/api/public/jobs';

    constructor(private http: HttpClient) { }

    /**
     * Search jobs across all APIs.
     * Fetches multiple pages from each API to build a large pool,
     * then filters locally by title keyword, sorts by date, and paginates.
     */
    searchJobs(query: string, location: string, page: number = 1): Observable<JobSearchResponse> {
        console.log(`[JobService] Searching for "${query}" in "${location}" (page ${page})`);

        // Fetch 5 pages from Arbeitnow + 3 pages from The Muse to get diverse companies
        const apiCalls: Observable<JobOffer[]>[] = [
            this.fetchArbeitnow(1),
            this.fetchArbeitnow(2),
            this.fetchArbeitnow(3),
            this.fetchArbeitnow(4),
            this.fetchArbeitnow(5),
            this.fetchMuse(0),
            this.fetchMuse(1),
            this.fetchMuse(2),
        ];

        return forkJoin(apiCalls).pipe(
            map(results => {
                // Merge and deduplicate
                const allJobs = results.flat();
                const seen = new Map<string | number, JobOffer>();
                allJobs.forEach(job => seen.set(job.id, job));
                const uniqueJobs = Array.from(seen.values());

                console.log(`[JobService] Fetched ${uniqueJobs.length} unique jobs total`);

                // Filter by title keyword (strict requirement from cahier de charge)
                let filtered = uniqueJobs.filter(job =>
                    job.title.toLowerCase().includes(query.toLowerCase())
                );
                console.log(`[JobService] ${filtered.length} jobs match title "${query}"`);

                // Filter by location if provided
                if (location && location.trim()) {
                    filtered = filtered.filter(job =>
                        job.location.display_name.toLowerCase().includes(location.toLowerCase())
                    );
                    console.log(`[JobService] ${filtered.length} jobs match location "${location}"`);
                }

                // Sort by date descending
                filtered.sort((a, b) =>
                    new Date(b.created).getTime() - new Date(a.created).getTime()
                );

                // Paginate: 10 results per page
                const perPage = 10;
                const start = (page - 1) * perPage;
                const paginated = filtered.slice(start, start + perPage);

                return {
                    results: paginated,
                    count: filtered.length
                };
            }),
            catchError(error => {
                console.error('[JobService] Fatal error:', error);
                return of({ results: [], count: 0 });
            })
        );
    }

    /**
     * Fetch ALL jobs from all APIs at once and return as a flat array.
     * Used by the search page to cache locally for real-time filtering.
     */
    getAllJobs(): Observable<JobOffer[]> {
        console.log('[JobService] Fetching all jobs for local cache...');

        const apiCalls: Observable<JobOffer[]>[] = [
            this.fetchArbeitnow(1),
            this.fetchArbeitnow(2),
            this.fetchArbeitnow(3),
            this.fetchMuse(0),
            this.fetchMuse(1),
            this.fetchMuse(2),
        ];

        return forkJoin(apiCalls).pipe(
            map(results => {
                const allJobs = results.flat();
                const seen = new Map<string | number, JobOffer>();
                allJobs.forEach(job => seen.set(job.id, job));
                const uniqueJobs = Array.from(seen.values());
                console.log(`[JobService] Cached ${uniqueJobs.length} unique jobs`);
                return uniqueJobs;
            }),
            catchError(error => {
                console.error('[JobService] Failed to load jobs:', error);
                return of([]);
            })
        );
    }

    // ──────────────────────────────────────────────
    // API Fetchers
    // ──────────────────────────────────────────────

    /**
     * Fetch one page from Arbeitnow (100 jobs per page).
     * Public API, no auth needed. European + remote jobs.
     */
    private fetchArbeitnow(page: number): Observable<JobOffer[]> {
        const params = new HttpParams().set('page', page.toString());

        return this.http.get<ArbeitnowResponse>(this.arbeitnowUrl, { params }).pipe(
            map(response => {
                const jobs = response.data || [];
                console.log(`[Arbeitnow] Page ${page}: ${jobs.length} jobs`);
                return this.normalizeArbeitnowJobs(jobs);
            }),
            catchError(error => {
                console.warn(`[Arbeitnow] Page ${page} failed:`, error.message || error.status);
                return of([]);
            })
        );
    }

    /**
     * Fetch one page from The Muse (20 jobs per page, 0-indexed).
     * Public API, US-focused jobs.
     */
    private fetchMuse(page: number): Observable<JobOffer[]> {
        const params = new HttpParams().set('page', page.toString());

        return this.http.get<MuseResponse>(this.museUrl, { params }).pipe(
            map(response => {
                const jobs = response.results || [];
                console.log(`[TheMuse] Page ${page}: ${jobs.length} jobs`);
                return this.normalizeMuseJobs(jobs);
            }),
            catchError(error => {
                console.warn(`[TheMuse] Page ${page} failed:`, error.message || error.status);
                return of([]);
            })
        );
    }

    // ──────────────────────────────────────────────
    // Normalizers
    // ──────────────────────────────────────────────

    private normalizeArbeitnowJobs(jobs: ArbeitnowJob[]): JobOffer[] {
        return jobs.map(job => ({
            id: job.slug,
            title: job.title,
            company: { display_name: job.company_name },
            location: { display_name: job.location },
            created: new Date(job.created_at * 1000).toISOString(),
            description: job.description,
            redirect_url: job.url,
            contract_type: job.job_types?.join(', '),
            source: 'arbeitnow' as const
        }));
    }

    private normalizeMuseJobs(jobs: MuseJob[]): JobOffer[] {
        return jobs.map(job => ({
            id: job.id,
            title: job.name,
            company: { display_name: job.company.name },
            location: { display_name: job.locations[0]?.name || 'Non spécifié' },
            created: job.publication_date,
            description: job.contents,
            redirect_url: job.refs.landing_page,
            contract_type: job.levels?.[0]?.name,
            source: 'themuse' as const
        }));
    }
}
