import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FavoritesState } from './favorites.reducer';

export const selectFavoritesState = createFeatureSelector<FavoritesState>('favorites');

export const selectAllFavorites = createSelector(
    selectFavoritesState,
    (state) => state.favorites
);

export const selectFavoritesLoading = createSelector(
    selectFavoritesState,
    (state) => state.loading
);

export const selectFavoriteByOfferId = (offerId: string | number) => createSelector(
    selectAllFavorites,
    (favorites) => favorites.some(f => f.offerId === offerId)
);
