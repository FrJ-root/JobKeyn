import { Component, inject, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { JobService } from '../../../core/services/job.service';
import { AuthService } from '../../../core/services/auth.service';
import { JobOffer } from '../../../core/models/job-offer.model';
import { JobCardComponent } from './job-card.component';
import * as FavoritesActions from '../../../state/favorites/favorites.actions';

@Component({
    selector: 'app-search-page',
    standalone: true,
    imports: [CommonModule, FormsModule, JobCardComponent],
    template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- Hero -->
      <div class="mb-12 text-center">
        <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          Trouvez votre prochain défi
        </h1>
        <p class="mt-5 text-xl text-gray-500">
          Recherchez parmi des milliers d'offres d'emploi internationales.
        </p>
      </div>

      <!-- Search Bar -->
      <form (ngSubmit)="search()" class="bg-white rounded-3xl shadow-xl p-4 mb-8 flex flex-col md:flex-row gap-4 border border-gray-100 ring-4 ring-indigo-50/50">
        <div class="flex-1 relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <input type="text" name="query" [(ngModel)]="query"
                 placeholder="Titre du poste (ex: Developer, Engineer, Manager)"
                 class="block w-full pl-11 pr-4 py-4 rounded-2xl border-none bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-600 transition-all text-gray-900 placeholder-gray-400">
        </div>
        <div class="flex-1 relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <input type="text" name="location" [(ngModel)]="location"
                 placeholder="Localisation (ex: Remote, Berlin, London)"
                 class="block w-full pl-11 pr-4 py-4 rounded-2xl border-none bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-600 transition-all text-gray-900 placeholder-gray-400">
        </div>
        <button type="submit" [disabled]="loading()"
                class="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 disabled:opacity-50 min-w-[160px]">
          <span *ngIf="!loading()">Rechercher</span>
          <span *ngIf="loading()" class="flex gap-1 items-center">
            <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            Recherche...
          </span>
        </button>
      </form>

      <!-- Section header -->
      <div class="flex justify-between items-center mb-6 px-2">
        <h2 class="text-2xl font-bold text-gray-900">
          {{ hasSearched ? 'Résultats de recherche' : 'Offres récentes' }}
        </h2>
        <span *ngIf="totalCount() > 0" class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
          {{ totalCount() }} {{ totalCount() === 1 ? 'offre trouvée' : 'offres trouvées' }}
        </span>
      </div>

      <!-- Loading state -->
      <div *ngIf="loading()" class="text-center py-20">
        <div class="inline-flex items-center gap-3 text-indigo-600">
          <svg class="animate-spin h-8 w-8" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <span class="text-lg font-medium">Chargement des offres...</span>
        </div>
      </div>

      <!-- No results -->
      <div *ngIf="hasSearched && results().length === 0 && !loading()" class="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
        <div class="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <p class="text-gray-500 font-medium text-lg">Aucune offre ne correspond à votre recherche.</p>
        <p class="text-gray-400 text-sm mt-2">Essayez un terme plus large comme "Engineer", "Manager" ou "Developer"</p>
      </div>

      <!-- Results grid -->
      <div *ngIf="!loading()" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <app-job-card *ngFor="let job of results()" [job]="job" />
      </div>

      <!-- Pagination -->
      <div *ngIf="totalCount() > 10 && !loading()" class="mt-12 flex justify-center items-center gap-3">
        <button (click)="goToPage(page - 1)" [disabled]="page === 1"
                class="p-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 transition-all">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 19l-7-7 7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <ng-container *ngFor="let p of pageNumbers()">
          <button (click)="goToPage(p)"
                  class="px-4 py-2 rounded-xl font-medium transition-all"
                  [ngClass]="p === page
                    ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-200'
                    : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'">
            {{ p }}
          </button>
        </ng-container>
        <button (click)="goToPage(page + 1)" [disabled]="page >= totalPages()"
                class="p-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 transition-all">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <span class="text-sm text-gray-400 ml-2">
          Page {{ page }} / {{ totalPages() }}
        </span>
      </div>
    </div>
  `
})
export class SearchPageComponent {
    private jobService = inject(JobService);
    private authService = inject(AuthService);
    private store = inject(Store);
    private platformId = inject(PLATFORM_ID);

    query = '';
    location = '';
    page = 1;
    loading = signal(false);
    results = signal<JobOffer[]>([]);
    totalCount = signal(0);
    hasSearched = false;

    ngOnInit() {
        // Load favorites for the current user (needed for favorite indicators on cards)
        if (this.authService.isAuthenticated) {
            const user = this.authService.currentUser();
            if (user?.id) {
                this.store.dispatch(FavoritesActions.loadFavorites({ userId: user.id }));
            }
        }
        this.loadLatestJobs();
    }

    loadLatestJobs() {
        this.loading.set(true);
        this.jobService.getLatestJobs(this.page).subscribe({
            next: (res) => {
                this.results.set(res.results);
                this.totalCount.set(res.count);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    search() {
        if (!this.query.trim()) return;
        this.page = 1;
        this.hasSearched = true;
        this.doSearch();
    }

    private doSearch() {
        this.loading.set(true);
        this.jobService.searchJobs(this.query, this.location, this.page).subscribe({
            next: (res) => {
                this.results.set(res.results);
                this.totalCount.set(res.count);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    goToPage(p: number) {
        if (p < 1 || p > this.totalPages()) return;
        this.page = p;
        if (this.hasSearched) {
            this.doSearch();
        } else {
            this.loadLatestJobs();
        }
        if (isPlatformBrowser(this.platformId)) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    totalPages(): number {
        return Math.max(1, Math.ceil(this.totalCount() / 10));
    }

    pageNumbers(): number[] {
        const total = this.totalPages();
        const current = this.page;
        let start = Math.max(1, current - 2);
        let end = Math.min(total, start + 4);
        start = Math.max(1, end - 4);
        const pages: number[] = [];
        for (let i = start; i <= end; i++) pages.push(i);
        return pages;
    }
}
