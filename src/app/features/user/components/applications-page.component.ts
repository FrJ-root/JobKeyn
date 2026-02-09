import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { JobApplication } from '../../../core/models/interactions.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-applications-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Suivi des Candidatures</h1>
          <p class="text-gray-500">Gérez l'état de vos recherches d'emploi en un seul endroit.</p>
        </div>
        
        <div class="flex gap-2">
          <div class="bg-white border border-gray-100 rounded-xl px-4 py-2 flex items-center gap-2 shadow-sm">
            <span class="w-3 h-3 rounded-full bg-yellow-400"></span>
            <span class="text-sm font-medium text-gray-600">{{ getCount('en_attente') }} En attente</span>
          </div>
          <div class="bg-white border border-gray-100 rounded-xl px-4 py-2 flex items-center gap-2 shadow-sm">
            <span class="w-3 h-3 rounded-full bg-green-500"></span>
            <span class="text-sm font-medium text-gray-600">{{ getCount('accepte') }} Acceptées</span>
          </div>
          <div class="bg-white border border-gray-100 rounded-xl px-4 py-2 flex items-center gap-2 shadow-sm">
            <span class="w-3 h-3 rounded-full bg-red-400"></span>
            <span class="text-sm font-medium text-gray-600">{{ getCount('refuse') }} Refusées</span>
          </div>
        </div>
      </div>

      <div *ngIf="loading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>

      <div *ngIf="applications.length === 0 && !loading" 
           class="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
        <div class="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <p class="text-gray-500 font-medium">Vous ne suivez aucune candidature pour le moment.</p>
      </div>

      <div class="space-y-4">
        <div *ngFor="let app of applications" 
             class="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col lg:flex-row gap-6 hover:shadow-md transition-all">
          
          <div class="flex-1">
            <div class="flex justify-between items-start mb-2">
              <div>
                <h3 class="text-xl font-bold text-gray-900">{{ app.title }}</h3>
                <p class="text-indigo-600 font-semibold">{{ app.company }}</p>
              </div>
              <button (click)="deleteApplication(app.id!)" class="text-gray-300 hover:text-red-500 transition-colors">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2"/></svg>
              </button>
            </div>
            
            <div class="flex flex-wrap gap-4 mt-4">
              <div class="flex items-center text-sm text-gray-500 gap-1.5">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke-width="2"/></svg>
                {{ app.location }}
              </div>
              <div class="flex items-center text-sm text-gray-500 gap-1.5">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-width="2"/></svg>
                Ajouté le {{ app.dateAdded | date:'mediumDate' }}
              </div>
            </div>

            <div class="mt-6">
              <label class="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Notes personnelles</label>
              <textarea [(ngModel)]="app.notes" (blur)="updateApplication(app)" 
                        placeholder="Ajouter une note (ex: Relancer dans 2 semaines...)"
                        class="w-full bg-gray-50 border-none rounded-xl p-3 text-sm text-gray-600 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"></textarea>
            </div>
          </div>

          <div class="lg:w-48 flex flex-col gap-3">
             <label class="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Statut</label>
             <select [(ngModel)]="app.status" (change)="updateApplication(app)"
                     [class]="getStatusClass(app.status)"
                     class="w-full p-3 rounded-xl border-none font-bold text-sm focus:ring-4 transition-all appearance-none cursor-pointer">
               <option value="en_attente">En attente</option>
               <option value="accepte">Accepté</option>
               <option value="refuse">Refusé</option>
             </select>
             
             <a [href]="app.url" target="_blank" 
                class="mt-auto flex items-center justify-center gap-2 p-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all">
               Voir l'annonce
               <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" stroke-width="2"/></svg>
             </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ApplicationsPageComponent {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  applications: JobApplication[] = [];
  loading = false;

  ngOnInit() {
    this.loadApplications();
  }

  loadApplications() {
    const user = this.authService.currentUser();
    if (!user) return;

    this.loading = true;
    this.http.get<JobApplication[]>(`/api/applications?userId=${user.id}`).subscribe({
      next: (data) => {
        this.applications = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  updateApplication(app: JobApplication) {
    this.http.patch(`/api/applications/${app.id}`, app).subscribe();
  }

  deleteApplication(id: number) {
    if (confirm('Supprimer ce suivi ?')) {
      this.http.delete(`/api/applications/${id}`).subscribe(() => {
        this.applications = this.applications.filter(a => a.id !== id);
      });
    }
  }

  getCount(status: string) {
    return this.applications.filter(a => a.status === status).length;
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'accepte': return 'bg-green-100 text-green-700 focus:ring-green-50';
      case 'refuse': return 'bg-red-100 text-red-700 focus:ring-red-50';
      default: return 'bg-yellow-100 text-yellow-700 focus:ring-yellow-50';
    }
  }
}
