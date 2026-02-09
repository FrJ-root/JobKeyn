import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectAllFavorites, selectFavoritesLoading } from '../../../state/favorites/favorites.selectors';
import { AuthService } from '../../../core/services/auth.service';
import * as FavoritesActions from '../../../state/favorites/favorites.actions';

@Component({
    selector: 'app-favorites-page',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="mb-10">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Mes Offres Favorites</h1>
        <p class="text-gray-500">Retrouvez toutes les opportunités que vous avez sauvegardées.</p>
      </div>

      <div *ngIf="loading$ | async" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>

      <div *ngIf="(favorites$ | async)?.length === 0 && !(loading$ | async)" 
           class="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
        <div class="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <p class="text-gray-500 font-medium">Vous n'avez pas encore de favoris.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let fav of favorites$ | async" 
             class="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all relative group">
          <button (click)="removeFavorite(fav.id!)" 
                  class="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 transition-colors">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          
          <h3 class="text-lg font-bold text-gray-900 mb-1 pr-8">{{ fav.title }}</h3>
          <p class="text-indigo-600 font-semibold text-sm mb-4">{{ fav.company }}</p>
          
          <div class="flex items-center text-sm text-gray-500 gap-1.5 mb-6">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke-width="2"/></svg>
            {{ fav.location }}
          </div>

          <a [href]="'/job/' + fav.offerId" class="block text-center bg-gray-50 text-gray-900 py-2.5 rounded-xl font-bold hover:bg-gray-100 transition-all text-sm">
            Voir l'offre originale
          </a>
        </div>
      </div>
    </div>
  `
})
export class FavoritesPageComponent {
    private store = inject(Store);
    private authService = inject(AuthService);

    favorites$ = this.store.select(selectAllFavorites);
    loading$ = this.store.select(selectFavoritesLoading);

    ngOnInit() {
        const user = this.authService.currentUser();
        if (user) {
            this.store.dispatch(FavoritesActions.loadFavorites({ userId: user.id! }));
        }
    }

    removeFavorite(id: number) {
        if (confirm('Voulez-vous supprimer ce favori ?')) {
            this.store.dispatch(FavoritesActions.removeFavorite({ id }));
        }
    }
}
