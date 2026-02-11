import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-md bg-white/80">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <div class="flex items-center gap-8">
            <a routerLink="/" class="flex items-center gap-2 group">
              <div class="bg-indigo-600 p-2 rounded-lg group-hover:bg-indigo-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span class="text-xl font-bold text-gray-900 tracking-tight">JobFinder</span>
            </a>
            
            <!-- Desktop menu -->
            <div class="hidden md:flex items-center gap-1">
              <a routerLink="/" routerLinkActive="text-indigo-600 bg-indigo-50" [routerLinkActiveOptions]="{exact: true}"
                 class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 transition-all">
                Offres
              </a>
              <a routerLink="/entreprises" routerLinkActive="text-indigo-600 bg-indigo-50"
                 class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 transition-all">
                Entreprises
              </a>
              <a routerLink="/conseils" routerLinkActive="text-indigo-600 bg-indigo-50"
                 class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 transition-all">
                Conseils
              </a>
              <ng-container *ngIf="authService.isAuthenticated">
                <a routerLink="/favorites" routerLinkActive="text-indigo-600 bg-indigo-50"
                   class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 transition-all">
                  Favoris
                </a>
                <a routerLink="/applications" routerLinkActive="text-indigo-600 bg-indigo-50"
                   class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 transition-all">
                  Suivi
                </a>
              </ng-container>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <!-- Mobile menu button -->
            <button (click)="toggleMobileMenu()" class="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all">
              <svg *ngIf="!mobileMenuOpen()" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
              <svg *ngIf="mobileMenuOpen()" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>

            <!-- Desktop auth buttons -->
            <ng-container *ngIf="!authService.isAuthenticated; else userMenu">
              <a routerLink="/auth/login" class="hidden md:block text-sm font-medium text-gray-600 hover:text-gray-900 px-4">Connexion</a>
              <a routerLink="/auth/register" 
                 class="hidden md:block bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-indigo-700 transition-shadow hover:shadow-lg">
                S'inscrire
              </a>
            </ng-container>
            <ng-template #userMenu>
              <div class="hidden md:flex items-center gap-4">
                <a routerLink="/profile" class="flex items-center gap-2 group">
                  <div class="w-9 h-9 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-semibold border-2 border-white shadow-sm group-hover:border-indigo-200 transition-all">
                    {{ authService.currentUser()?.prenom?.charAt(0) }}
                  </div>
                  <span class="hidden sm:block text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">
                    {{ authService.currentUser()?.prenom }}
                  </span>
                </a>
                <button (click)="authService.logout()" 
                        class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Déconnexion">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </ng-template>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <div *ngIf="mobileMenuOpen()" class="md:hidden border-t border-gray-100 bg-white">
        <div class="px-4 py-4 space-y-2">
          <a routerLink="/" (click)="closeMobileMenu()" routerLinkActive="text-indigo-600 bg-indigo-50" [routerLinkActiveOptions]="{exact: true}"
             class="block px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 transition-all">
            Offres
          </a>
          <a routerLink="/entreprises" (click)="closeMobileMenu()" routerLinkActive="text-indigo-600 bg-indigo-50"
             class="block px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 transition-all">
            Entreprises
          </a>
          <a routerLink="/conseils" (click)="closeMobileMenu()" routerLinkActive="text-indigo-600 bg-indigo-50"
             class="block px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 transition-all">
            Conseils
          </a>
          <ng-container *ngIf="authService.isAuthenticated">
            <a routerLink="/favorites" (click)="closeMobileMenu()" routerLinkActive="text-indigo-600 bg-indigo-50"
               class="block px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 transition-all">
              Favoris
            </a>
            <a routerLink="/applications" (click)="closeMobileMenu()" routerLinkActive="text-indigo-600 bg-indigo-50"
               class="block px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 transition-all">
              Suivi
            </a>
            <a routerLink="/profile" (click)="closeMobileMenu()" routerLinkActive="text-indigo-600 bg-indigo-50"
               class="block px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 transition-all">
              Mon Profil
            </a>
            <button (click)="authService.logout(); closeMobileMenu()" 
                    class="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all">
              Déconnexion
            </button>
          </ng-container>
          <ng-container *ngIf="!authService.isAuthenticated">
            <a routerLink="/auth/login" (click)="closeMobileMenu()"
               class="block px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 transition-all">
              Connexion
            </a>
            <a routerLink="/auth/register" (click)="closeMobileMenu()"
               class="block px-4 py-3 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-all text-center">
              S'inscrire
            </a>
          </ng-container>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  authService = inject(AuthService);
  mobileMenuOpen = signal(false);

  toggleMobileMenu() {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }
}
