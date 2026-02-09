import { Component, inject, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobService } from '../../../core/services/job.service';
import { JobOffer } from '../../../core/models/job-offer.model';
import { JobCardComponent } from './job-card.component';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [CommonModule, FormsModule, JobCardComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="mb-12 text-center">
        <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          Trouvez votre prochain défi
        </h1>
        <p class="mt-5 text-xl text-gray-500">
          Recherchez parmi des milliers d'offres d'emploi internationales.
        </p>
      </div>

      <!-- Search Bar -->
      <div class="bg-white rounded-3xl shadow-xl p-4 mb-10 flex flex-col md:flex-row gap-4 border border-gray-100 ring-4 ring-indigo-50/50">
        <div class="flex-1 relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <input type="text" [(ngModel)]="query" placeholder="Titre du poste (ex: Développeur Angular)" 
                 class="block w-full pl-11 pr-4 py-4 rounded-2xl border-none bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-600 transition-all text-gray-900 placeholder-gray-400">
        </div>
        <div class="flex-1 relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <input type="text" [(ngModel)]="location" placeholder="Localisation (ex: Paris, France)"
                 class="block w-full pl-11 pr-4 py-4 rounded-2xl border-none bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-600 transition-all text-gray-900 placeholder-gray-400">
        </div>
        <button (click)="search()" [disabled]="loading()"
                class="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 disabled:opacity-50">
          <span *ngIf="!loading()">Rechercher</span>
          <span *ngIf="loading()" class="flex gap-1">
            <span class="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></span>
            <span class="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-75"></span>
            <span class="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-150"></span>
          </span>
        </button>
      </div>

      <!-- Results -->
      <div *ngIf="hasSearched && results().length === 0 && !loading()" class="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
        <div class="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <p class="text-gray-500 font-medium">Aucune offre ne correspond à votre recherche.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <app-job-card *ngFor="let job of results()" [job]="job" />
      </div>

      <!-- Pagination -->
      <div *ngIf="results().length > 0" class="mt-12 flex justify-center gap-2">
        <button (click)="previousPage()" [disabled]="page === 1" 
                class="p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 transition-all">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 19l-7-7 7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <span class="p-4 px-6 rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-700 font-bold">
          Page {{ page }}
        </span>
        <button (click)="nextPage()" [disabled]="results().length < 10"
                class="p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 transition-all">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
    </div>
  `
})
export class SearchPageComponent {
  private jobService = inject(JobService);
  private platformId = inject(PLATFORM_ID);

  query = '';
  location = '';
  page = 1;
  loading = signal(false);
  results = signal<JobOffer[]>([]);
  hasSearched = false;

  search() {
    if (!this.query || !this.location) return;

    this.loading.set(true);
    this.hasSearched = true;
    this.jobService.searchJobs(this.query, this.location, this.page).subscribe({
      next: (res) => {
        this.results.set(res.results);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  nextPage() {
    this.page++;
    this.search();
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
      this.search();
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }
}
