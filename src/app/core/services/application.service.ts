import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JobApplication } from '../models/interactions.model';

@Injectable({
    providedIn: 'root'
})
export class ApplicationService {
    private http = inject(HttpClient);
    private apiUrl = '/api/applications';

    getByUser(userId: number): Observable<JobApplication[]> {
        return this.http.get<JobApplication[]>(`${this.apiUrl}?userId=${userId}`);
    }

    add(application: JobApplication): Observable<JobApplication> {
        return this.http.post<JobApplication>(this.apiUrl, application);
    }

    updateStatus(id: number, status: string): Observable<JobApplication> {
        return this.http.patch<JobApplication>(`${this.apiUrl}/${id}`, { status });
    }

    updateNotes(id: number, notes: string): Observable<JobApplication> {
        return this.http.patch<JobApplication>(`${this.apiUrl}/${id}`, { notes });
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
