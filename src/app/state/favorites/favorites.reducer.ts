import { createReducer, on } from '@ngrx/store';
import { FavoriteOffer } from '../../core/models/interactions.model';
import * as FavoritesActions from './favorites.actions';

export interface FavoritesState {
    favorites: FavoriteOffer[];
    loading: boolean;
    error: any;
}

export const initialState: FavoritesState = {
    favorites: [],
    loading: false,
    error: null
};

export const favoritesReducer = createReducer(
    initialState,
    on(FavoritesActions.loadFavorites, (state) => ({ ...state, loading: true })),
    on(FavoritesActions.loadFavoritesSuccess, (state, { favorites }) => ({ ...state, favorites, loading: false })),
    on(FavoritesActions.loadFavoritesFailure, (state, { error }) => ({ ...state, error, loading: false })),
    on(FavoritesActions.addFavoriteSuccess, (state, { favorite }) => ({ ...state, favorites: [...state.favorites, favorite] })),
    on(FavoritesActions.removeFavoriteSuccess, (state, { id }) => ({ ...state, favorites: state.favorites.filter(f => f.id !== id) }))
);
