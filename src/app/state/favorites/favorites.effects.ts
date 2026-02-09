import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { catchError, map, mergeMap, of } from 'rxjs';
import * as FavoritesActions from './favorites.actions';
import { FavoriteOffer } from '../../core/models/interactions.model';

@Injectable()
export class FavoritesEffects {
    private actions$ = inject(Actions);
    private http = inject(HttpClient);
    private apiUrl = '/api/favoritesOffers';

    loadFavorites$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FavoritesActions.loadFavorites),
            mergeMap((action) =>
                this.http.get<FavoriteOffer[]>(`${this.apiUrl}?userId=${action.userId}`).pipe(
                    map((favorites) => FavoritesActions.loadFavoritesSuccess({ favorites })),
                    catchError((error) => of(FavoritesActions.loadFavoritesFailure({ error })))
                )
            )
        )
    );

    addFavorite$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FavoritesActions.addFavorite),
            mergeMap((action) =>
                this.http.post<FavoriteOffer>(this.apiUrl, action.favorite).pipe(
                    map((newFavorite) => FavoritesActions.addFavoriteSuccess({ favorite: newFavorite })),
                    catchError((error) => of(FavoritesActions.addFavoriteFailure({ error })))
                )
            )
        )
    );

    removeFavorite$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FavoritesActions.removeFavorite),
            mergeMap((action) =>
                this.http.delete<void>(`${this.apiUrl}/${action.id}`).pipe(
                    map(() => FavoritesActions.removeFavoriteSuccess({ id: action.id })),
                    catchError((error) => of(FavoritesActions.removeFavoriteFailure({ error })))
                )
            )
        )
    );
}
