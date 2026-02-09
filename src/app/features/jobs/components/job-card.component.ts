import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobOffer } from '../../../core/models/job-offer.model';
import { Store } from '@ngrx/store';
import { AuthService } from '../../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import * as FavoritesActions from '../../../state/favorites/favorites.actions';
import { selectAllFavorites, selectFavoriteByOfferId } from '../../../state/favorites/favorites.selectors';
import { map, of, take } from 'rxjs';
import { JobApplication } from '../../../core/models/interactions.model';

@Component({
  selector: 'app-job-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all group">
      <div class="flex justify-between items-start mb-4">
        <div class="flex-1">
          <div class="inline-flex px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-2">
            {{ job.contract_type || 'CDI' }}
          </div>
          <h3 class="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
            {{ job.title }}
          </h3>
          <p class="text-indigo-600 font-semibold mt-1">{{ job.company.display_name }}</p>
        </div>
        
        <div class="flex gap-2" *ngIf="authService.isAuthenticated">
          <button (click)="toggleFavorite()" 
                  [class]="(isFavorite$ | async) ? 'text-rose-500 bg-rose-50' : 'text-gray-400 bg-gray-50 hover:text-rose-500 hover:bg-rose-50'"
                  class="p-2.5 rounded-xl transition-all shadow-sm"
                  [title]="(isFavorite$ | async) ? 'Retirer des favoris' : 'Ajouter aux favoris'">
            <svg class="h-6 w-6" [attr.fill]="(isFavorite$ | async) ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>

      <div class="flex flex-wrap gap-4 mb-6">
        <div class="flex items-center text-sm text-gray-500 gap-1.5">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke-width="2"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2"/></svg>
          {{ job.location.display_name }}
        </div>
        <div class="flex items-center text-sm text-gray-500 gap-1.5" *ngIf="job.salary_min">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2"/></svg>
          {{ job.salary_min / 1000 }}k - {{ job.salary_max ? job.salary_max / 1000 + 'k' : '' }}
        </div>
        <div class="flex items-center text-sm text-gray-500 gap-1.5">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-width="2"/></svg>
          {{ job.created | date:'shortDate' }}
        </div>
      </div>

      <p class="text-gray-600 text-sm line-clamp-3 mb-6 bg-gray-50/50 p-3 rounded-lg border border-gray-50">
        {{ job.description }}
      </p>

      <div class="flex gap-3">
        <a [href]="job.redirect_url" target="_blank" 
           class="flex-1 text-center bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-all">
          Voir l'offre
        </a>
        <button *ngIf="authService.isAuthenticated" 
                (click)="trackApplication()"
                [disabled]="isTracked() || trackingLoading()"
                [class]="isTracked() ? 'bg-green-50 text-green-600 border-green-200 cursor-default' : 'border-indigo-600 text-indigo-600 hover:bg-indigo-50'"
                class="flex-1 text-center border-2 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-70">
          <ng-container *ngIf="trackingLoading()">
            <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </ng-container>
          <ng-container *ngIf="!trackingLoading()">
            <svg *ngIf="isTracked()" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            {{ isTracked() ? 'Suivi' : 'Suivre' }}
          </ng-container>
        </button>
      </div>
    </div>
  `
})
export class JobCardComponent implements OnInit {
  @Input({ required: true }) job!: JobOffer;

  authService = inject(AuthService);
  store = inject(Store);
  http = inject(HttpClient);

  isFavorite$ = of(false);
  isTracked = signal(false);
  trackingLoading = signal(false);

  ngOnInit() {
    this.isFavorite$ = this.store.select(selectFavoriteByOfferId(this.job.id));
    this.checkIfTracked();
  }

  checkIfTracked() {
    const user = this.authService.currentUser();
    if (!user) return;

    this.http.get<JobApplication[]>(`/api/applications?userId=${user.id}&offerId=${this.job.id}`)
      .subscribe(apps => {
        this.isTracked.set(apps.length > 0);
      });
  }

  toggleFavorite() {
    const user = this.authService.currentUser();
    if (!user) return;

    this.isFavorite$.pipe(take(1)).subscribe(isFav => {
      if (isFav) {
        this.store.select(selectAllFavorites).pipe(
          take(1),
          map(favs => favs.find(f => f.offerId === this.job.id))
        ).subscribe(fav => {
          if (fav?.id) this.store.dispatch(FavoritesActions.removeFavorite({ id: fav.id }));
        });
      } else {
        const favorite = {
          userId: user.id!,
          offerId: this.job.id,
          title: this.job.title,
          company: this.job.company.display_name,
          location: this.job.location.display_name
        };
        this.store.dispatch(FavoritesActions.addFavorite({ favorite }));
      }
    });
  }

  trackApplication() {
    const user = this.authService.currentUser();
    if (!user || this.isTracked()) return;

    this.trackingLoading.set(true);

    const application = {
      userId: user.id!,
      offerId: this.job.id,
      apiSource: 'adzuna',
      title: this.job.title,
      company: this.job.company.display_name,
      location: this.job.location.display_name,
      url: this.job.redirect_url,
      status: 'en_attente',
      dateAdded: new Date().toISOString()
    };

    this.http.post('/api/applications', application).subscribe({
      next: () => {
        this.isTracked.set(true);
        this.trackingLoading.set(false);
      },
      error: () => {
        this.trackingLoading.set(false);
      }
    });
  }
}
