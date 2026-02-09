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
              <input formControlName="prenom" type="text" placeholder="Votre prénom"
                     class="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all sm:text-sm bg-gray-50/50"
                     [class.border-red-300]="registerForm.get('prenom')?.touched && registerForm.get('prenom')?.invalid">
              <div *ngIf="registerForm.get('prenom')?.touched && registerForm.get('prenom')?.invalid" 
                   class="text-red-500 text-xs mt-1 font-medium">
                Le prénom est requis
              </div>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Nom</label>
              <input formControlName="nom" type="text" placeholder="Votre nom"
                     class="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all sm:text-sm bg-gray-50/50"
                     [class.border-red-300]="registerForm.get('nom')?.touched && registerForm.get('nom')?.invalid">
              <div *ngIf="registerForm.get('nom')?.touched && registerForm.get('nom')?.invalid" 
                   class="text-red-500 text-xs mt-1 font-medium">
                Le nom est requis
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input formControlName="email" type="email"
                   class="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all sm:text-sm bg-gray-50/50"
                   placeholder="votre@email.com"
                   [class.border-red-300]="registerForm.get('email')?.touched && registerForm.get('email')?.invalid">
            <div *ngIf="registerForm.get('email')?.touched && registerForm.get('email')?.hasError('required')" 
                 class="text-red-500 text-xs mt-1 font-medium">
              L'email est requis
            </div>
            <div *ngIf="registerForm.get('email')?.touched && registerForm.get('email')?.hasError('email')" 
                 class="text-red-500 text-xs mt-1 font-medium">
              Format d'email invalide
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Mot de passe</label>
            <input formControlName="password" type="password"
                   class="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all sm:text-sm bg-gray-50/50"
                   placeholder="••••••••"
                   [class.border-red-300]="registerForm.get('password')?.touched && registerForm.get('password')?.invalid">
            <div *ngIf="registerForm.get('password')?.touched && registerForm.get('password')?.hasError('required')" 
                 class="text-red-500 text-xs mt-1 font-medium">
              Le mot de passe est requis
            </div>
            <div *ngIf="registerForm.get('password')?.touched && registerForm.get('password')?.hasError('minlength')" 
                 class="text-red-500 text-xs mt-1 font-medium">
              Minimum 6 caractères requis
            </div>
          </div>

          <div *ngIf="error" class="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
            {{ error }}
          </div>

          <div class="pt-4">
            <button type="submit" [disabled]="registerForm.invalid || loading"
                    class="w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50">
              <span *ngIf="loading" class="flex items-center gap-2">
                <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Création en cours...
              </span>
              <span *ngIf="!loading">Créer mon compte</span>
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
