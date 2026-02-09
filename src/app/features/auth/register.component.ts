import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    template: `
    <div class="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
        <div class="text-center">
          <div class="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg class="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight">Rejoignez-nous</h2>
          <p class="mt-2 text-sm text-gray-400 font-medium">Commencez à booster votre carrière aujourd'hui</p>
        </div>

        <form class="mt-8 space-y-4" [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Prénom</label>
              <input formControlName="prenom" type="text"
                     class="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all sm:text-sm bg-gray-50/50">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Nom</label>
              <input formControlName="nom" type="text"
                     class="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all sm:text-sm bg-gray-50/50">
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input formControlName="email" type="email"
                   class="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all sm:text-sm bg-gray-50/50"
                   placeholder="votre@email.com">
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Mot de passe</label>
            <input formControlName="password" type="password"
                   class="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all sm:text-sm bg-gray-50/50"
                   placeholder="••••••••">
          </div>

          <div *ngIf="error" class="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
            {{ error }}
          </div>

          <div class="pt-4">
            <button type="submit" [disabled]="registerForm.invalid || loading"
                    class="w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50">
              Créer mon compte
            </button>
          </div>
        </form>

        <div class="text-center">
          <p class="text-sm text-gray-500 font-medium">
            Déjà inscrit ? 
            <a routerLink="/auth/login" class="font-bold text-indigo-600 hover:text-indigo-500 transition-colors">Se connecter</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    registerForm = this.fb.group({
        prenom: ['', [Validators.required]],
        nom: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
    });

    loading = false;
    error = '';

    onSubmit() {
        if (this.registerForm.valid) {
            this.loading = true;
            this.error = '';
            this.authService.register(this.registerForm.value as any).subscribe({
                next: () => {
                    this.router.navigate(['/auth/login']);
                    this.loading = false;
                },
                error: (err) => {
                    this.error = err.message || 'Échec de l\'inscription';
                    this.loading = false;
                }
            });
        }
    }
}
