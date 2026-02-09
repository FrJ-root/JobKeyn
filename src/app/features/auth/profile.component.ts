import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div class="bg-indigo-600 h-32"></div>
        <div class="px-8 pb-8">
          <div class="relative flex justify-between items-end -mt-12 mb-8">
            <div class="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg ring-4 ring-white">
              <div class="w-full h-full rounded-xl bg-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-700">
                {{ authService.currentUser()?.prenom?.charAt(0) }}{{ authService.currentUser()?.nom?.charAt(0) }}
              </div>
            </div>
            <button (click)="onDeleteAccount()" 
                    class="text-sm font-bold text-red-500 hover:text-red-600 px-4 py-2 rounded-xl hover:bg-red-50 transition-all">
              Supprimer le compte
            </button>
          </div>

          <h1 class="text-2xl font-bold text-gray-900">Paramètres du profil</h1>
          <p class="text-gray-500 mb-8">Gérez vos informations personnelles et votre sécurité.</p>

          <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div class="grid grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Prénom</label>
                <input formControlName="prenom" type="text"
                       class="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-600 transition-all">
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Nom</label>
                <input formControlName="nom" type="text"
                       class="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-600 transition-all">
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input formControlName="email" type="email"
                     class="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-600 transition-all">
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Mot de passe</label>
              <input formControlName="password" type="password" placeholder="••••••••"
                     class="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-600 transition-all">
              <p class="mt-1 text-xs text-gray-400">Laissez vide pour conserver le mot de passe actuel.</p>
            </div>

            <div *ngIf="message" [class]="messageType === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'" 
                 class="p-4 rounded-xl border text-sm font-medium">
              {{ message }}
            </div>

            <div class="pt-4">
              <button type="submit" [disabled]="profileForm.invalid || loading"
                      class="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50">
                Enregistrer les modifications
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent {
    private fb = inject(FormBuilder);
    authService = inject(AuthService);
    private router = inject(Router);

    profileForm = this.fb.group({
        prenom: [this.authService.currentUser()?.prenom, [Validators.required]],
        nom: [this.authService.currentUser()?.nom, [Validators.required]],
        email: [this.authService.currentUser()?.email, [Validators.required, Validators.email]],
        password: ['']
    });

    loading = false;
    message = '';
    messageType: 'success' | 'error' = 'success';

    onSubmit() {
        if (this.profileForm.valid) {
            this.loading = true;
            this.message = '';

            const user = this.authService.currentUser();
            const updateData: any = { ...this.profileForm.value, id: user?.id };
            if (!updateData.password) delete updateData.password;

            this.authService.updateProfile(updateData).subscribe({
                next: () => {
                    this.message = 'Profil mis à jour avec succès !';
                    this.messageType = 'success';
                    this.loading = false;
                },
                error: () => {
                    this.message = 'Erreur lors de la mise à jour.';
                    this.messageType = 'error';
                    this.loading = false;
                }
            });
        }
    }

    onDeleteAccount() {
        if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
            const user = this.authService.currentUser();
            if (user?.id) {
                this.authService.deleteAccount(user.id).subscribe(() => {
                    this.router.navigate(['/']);
                });
            }
        }
    }
}
