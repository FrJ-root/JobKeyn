import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/jobs/components/search-page.component').then(c => c.SearchPageComponent)
    },
    {
        path: 'entreprises',
        loadComponent: () => import('./features/pages/entreprises-page.component').then(c => c.EntreprisesPageComponent)
    },
    {
        path: 'conseils',
        loadComponent: () => import('./features/pages/conseils-page.component').then(c => c.ConseilsPageComponent)
    },
    {
        path: 'auth',
        children: [
            {
                path: 'login',
                loadComponent: () => import('./features/auth/login.component').then(c => c.LoginComponent)
            },
            {
                path: 'register',
                loadComponent: () => import('./features/auth/register.component').then(c => c.RegisterComponent)
            }
        ]
    },
    {
        path: 'profile',
        canActivate: [authGuard],
        loadComponent: () => import('./features/auth/profile.component').then(c => c.ProfileComponent)
    },
    {
        path: 'favorites',
        canActivate: [authGuard],
        loadComponent: () => import('./features/user/components/favorites-page.component').then(c => c.FavoritesPageComponent)
    },
    {
        path: 'applications',
        canActivate: [authGuard],
        loadComponent: () => import('./features/user/components/applications-page.component').then(c => c.ApplicationsPageComponent)
    },
    { path: '**', redirectTo: '' }
];
