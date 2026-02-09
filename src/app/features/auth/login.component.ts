import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    template: `
    <div class="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
        <div class="text-center">
          <div class="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg class="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight">Bon retour !</h2>
          <p class="mt-2 text-sm text-gray-400 font-medium">Connectez-vous pour gérer vos favoris et candidatures</p>
        </div>

        <form class="mt-8 space-y-6" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="space-y-4">
            <div>
              <label for="email" class="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input formControlName="email" type="email" required
                     class="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all sm:text-sm bg-gray-50/50"
                     placeholder="votre@email.com">
              <div *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.invalid" class="text-red-500 text-xs mt-1 font-medium">
                Email invalide requis
              </div>
            </div>
            <div>
              <label for="password" class="block text-sm font-semibold text-gray-700 mb-1">Mot de passe</label>
              <input formControlName="password" type="password" required
                     class="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all sm:text-sm bg-gray-50/50"
                     placeholder="••••••••">
              <div *ngIf="loginForm.get('password')?.touched && loginForm.get('password')?.invalid" class="text-red-500 text-xs mt-1 font-medium">
                Mot de passe requis
              </div>
            </div>
          </div>

          <div *ngIf="error" class="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 animate-pulse">
            {{ error }}
          </div>

          <div>
            <button type="submit" [disabled]="loginForm.invalid || loading"
                    class="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50">
              <span *ngIf="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg class="animate-spin h-5 w-5 text-indigo-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              Se connecter
            </button>
          </div>
        </form>

        <div class="text-center">
          <p class="text-sm text-gray-500 font-medium">
            Pas encore de compte ? 
            <a routerLink="/auth/register" class="font-bold text-indigo-600 hover:text-indigo-500 transition-colors">Créer un compte</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]]
    });

    loading = false;
    error = '';

    onSubmit() {
        if (this.loginForm.valid) {
            this.loading = true;
            this.error = '';
            const { email, password } = this.loginForm.value;

            this.authService.login(email!, password!).subscribe({
                next: () => {
                    this.router.navigate(['/']);
                    this.loading = false;
                },
                error: (err) => {
                    this.error = err.message || 'Échec de la connexion';
                    this.loading = false;
                }
            });
        }
    }
}
