import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { JobOffer } from '../../../core/models/job-offer.model';
import { FavoriteOffer, JobApplication } from '../../../core/models/interactions.model';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';
import * as FavoritesActions from '../../../state/favorites/favorites.actions';
import { selectFavoriteByOfferId } from '../../../state/favorites/favorites.selectors';
import { ApplicationService } from '../../../core/services/application.service';

@Component({
  selector: 'app-job-card',
  standalone: true,
  imports: [CommonModule, TruncatePipe],
  template: `
    <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 flex flex-col h-full group">
      <!-- Header -->
      <div class="flex items-start justify-between gap-3 mb-4">
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
            {{ job.title }}
          </h3>
          <p class="text-sm font-semibold text-indigo-600 mt-1">{{ job.company.display_name }}</p>
        </div>
        <span class="shrink-0 inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider"
              [ngClass]="{
                'bg-emerald-50 text-emerald-700': job.source === 'arbeitnow',
                'bg-violet-50 text-violet-700': job.source === 'themuse',
                'bg-blue-50 text-blue-700': job.source === 'adzuna'
              }">
          {{ job.source === 'arbeitnow' ? 'Arbeitnow' : job.source === 'themuse' ? 'The Muse' : 'Adzuna' }}
        </span>
      </div>

      <!-- Meta -->
      <div class="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
        <span class="flex items-center gap-1">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          {{ job.location.display_name }}
        </span>
        <span class="flex items-center gap-1">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          {{ job.created | date:'dd/MM/yyyy' }}
        </span>
        <span *ngIf="job.contract_type" class="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-xs font-medium">
          {{ job.contract_type }}
        </span>
      </div>

      <!-- Salary -->
      <div *ngIf="job.salary_min || job.salary_max" class="mb-3">
        <span class="inline-flex items-center gap-1 text-sm font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-lg">
          💰
          <span *ngIf="job.salary_min">{{ job.salary_min | number:'1.0-0' }}€</span>
          <span *ngIf="job.salary_min && job.salary_max"> - </span>
          <span *ngIf="job.salary_max">{{ job.salary_max | number:'1.0-0' }}€</span>
        </span>
      </div>

      <!-- Description -->
      <p class="text-sm text-gray-500 leading-relaxed mb-6 flex-1">
        {{ job.description | truncate:180 }}
      </p>

      <!-- Actions -->
      <div class="flex flex-col gap-2 pt-2 border-t border-gray-50">
        <a [href]="job.redirect_url" target="_blank" rel="noopener"
           class="w-full text-center py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-sm">
          Voir l'offre ↗
        </a>
        <div *ngIf="authService.isAuthenticated" class="flex gap-2">
          <button (click)="toggleFavorite()"
                  class="flex-1 py-2 rounded-xl text-sm font-semibold transition-all border"
                  [ngClass]="isFavorited
                    ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'">
            {{ isFavorited ? '★ Favori' : '☆ Favoris' }}
          </button>
          <button (click)="trackApplication()"
                  [disabled]="isTracked"
                  class="flex-1 py-2 rounded-xl text-sm font-semibold transition-all border"
                  [ngClass]="isTracked
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 cursor-default'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'">
            {{ isTracked ? '✓ Suivi' : '+ Suivre' }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class JobCardComponent {
  @Input({ required: true }) job!: JobOffer;

  authService = inject(AuthService);
  private store = inject(Store);
  private appService = inject(ApplicationService);

  isFavorited = false;
  isTracked = false;

  ngOnInit() {
    if (this.authService.isAuthenticated) {
      // Check favorite status via NgRx selector
      this.store.select(selectFavoriteByOfferId(this.job.id)).subscribe(
        (fav) => this.isFavorited = fav
      );
      // Check if already tracked
      const user = this.authService.currentUser();
      if (user?.id) {
        this.appService.getByUser(user.id).subscribe(apps => {
          this.isTracked = apps.some(a => a.offerId === String(this.job.id));
        });
      }
    }
  }

  toggleFavorite() {
    const user = this.authService.currentUser();
    if (!user?.id) return;

    if (this.isFavorited) {
      // Read the store synchronously to find the favorite's id
      this.store.select('favorites').pipe(take(1)).subscribe((state: any) => {
        const fav = state.favorites.find((f: FavoriteOffer) =>
          String(f.offerId) === String(this.job.id)
        );
        if (fav?.id) {
          this.store.dispatch(FavoritesActions.removeFavorite({ id: fav.id }));
        }
      });
    } else {
      const favorite: FavoriteOffer = {
        userId: user.id,
        offerId: this.job.id,
        title: this.job.title,
        company: this.job.company.display_name,
        location: this.job.location.display_name
      };
      this.store.dispatch(FavoritesActions.addFavorite({ favorite }));
    }
  }

  trackApplication() {
    const user = this.authService.currentUser();
    if (!user?.id || this.isTracked) return;

    const application: JobApplication = {
      userId: user.id,
      offerId: String(this.job.id),
      apiSource: this.job.source || 'unknown',
      title: this.job.title,
      company: this.job.company.display_name,
      location: this.job.location.display_name,
      url: this.job.redirect_url,
      status: 'en_attente',
      notes: '',
      dateAdded: new Date().toISOString()
    };

    this.appService.add(application).subscribe({
      next: () => this.isTracked = true
    });
  }
}
