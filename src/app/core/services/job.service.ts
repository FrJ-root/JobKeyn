import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { JobSearchResponse } from '../models/job-offer.model';

@Injectable({
    providedIn: 'root'
})
export class JobService {
    private apiUrl = 'https://job-finder-api-nine.vercel.app/api/jobs';

    constructor(private http: HttpClient) { }

    searchJobs(query: string, location: string, page: number = 1): Observable<JobSearchResponse> {
        let params = new HttpParams()
            .set('what', query)
            .set('where', location)
            .set('page', page.toString())
            .set('results_per_page', '10');

        return this.http.get<JobSearchResponse>(this.apiUrl, { params }).pipe(
            map(response => ({
                ...response,
                results: response.results
                    .filter(job => job.title.toLowerCase().includes(query.toLowerCase()))
                    .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
            }))
        );
    }
}
