import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AuthService } from '../../../core/services/auth.service';
import { FavoriteCardComponent } from './favorite-card.component';
import * as FavoritesActions from '../../../state/favorites/favorites.actions';
import { selectAllFavorites, selectFavoritesLoading } from '../../../state/favorites/favorites.selectors';

@Component({
    selector: 'app-favorites-page',
    standalone: true,
    imports: [CommonModule, FavoriteCardComponent],
    template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="mb-8">
        <h1 class="text-3xl font-extrabold text-gray-900">Mes Favoris</h1>
        <p class="mt-2 text-gray-500">Les offres que vous avez sauvegardées pour plus tard.</p>
      </div>

      <!-- Loading -->
      <div *ngIf="loading$ | async" class="text-center py-16">
        <div class="inline-flex items-center gap-3 text-indigo-600">
          <svg class="animate-spin h-7 w-7" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <span class="font-medium">Chargement...</span>
        </div>
      </div>

      <!-- Empty state -->
      <div *ngIf="!(loading$ | async) && (favorites$ | async)?.length === 0"
           class="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
        <div class="bg-amber-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-4xl">☆</span>
        </div>
        <p class="text-gray-500 font-medium text-lg">Aucun favori pour le moment.</p>
        <p class="text-gray-400 text-sm mt-2">Ajoutez des offres en cliquant sur le bouton "Favoris" depuis la recherche.</p>
      </div>

      <!-- Favorites list -->
      <div class="space-y-4">
        <app-favorite-card
          *ngFor="let fav of favorites$ | async"
          [favorite]="fav"
          (remove)="onRemove($event)"
        />
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
        if (user?.id) {
            this.store.dispatch(FavoritesActions.loadFavorites({ userId: user.id }));
        }
    }

    onRemove(id: number) {
        this.store.dispatch(FavoritesActions.removeFavorite({ id }));
    }
}
