import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ApplicationService } from '../../../core/services/application.service';
import { JobApplication } from '../../../core/models/interactions.model';
import { ApplicationCardComponent } from './application-card.component';

@Component({
    selector: 'app-applications-page',
    standalone: true,
    imports: [CommonModule, ApplicationCardComponent],
    template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-900">Suivi des Candidatures</h1>
          <p class="mt-2 text-gray-500">Suivez l'état de vos candidatures et ajoutez des notes.</p>
        </div>
        <!-- Stats -->
        <div *ngIf="applications().length > 0" class="hidden md:flex items-center gap-3">
          <span class="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 text-xs font-bold">
            ⏳ {{ countByStatus('en_attente') }}
          </span>
          <span class="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold">
            ✅ {{ countByStatus('accepte') }}
          </span>
          <span class="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-bold">
            ❌ {{ countByStatus('refuse') }}
          </span>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="loading()" class="text-center py-16">
        <div class="inline-flex items-center gap-3 text-indigo-600">
          <svg class="animate-spin h-7 w-7" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <span class="font-medium">Chargement...</span>
        </div>
      </div>

      <!-- Empty state -->
      <div *ngIf="!loading() && applications().length === 0"
           class="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
        <div class="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="h-10 w-10 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
        </div>
        <p class="text-gray-500 font-medium text-lg">Aucune candidature suivie.</p>
        <p class="text-gray-400 text-sm mt-2">Commencez à suivre vos candidatures depuis la page de recherche.</p>
      </div>

      <!-- Applications list -->
      <div class="space-y-4">
        <app-application-card
          *ngFor="let app of applications()"
          [application]="app"
          (onStatusChange)="changeStatus($event)"
          (onNotesChange)="changeNotes($event)"
          (onDelete)="deleteApp($event)"
        />
      </div>
    </div>
  `
})
export class ApplicationsPageComponent {
    private authService = inject(AuthService);
    private appService = inject(ApplicationService);

    applications = signal<JobApplication[]>([]);
    loading = signal(false);

    ngOnInit() {
        this.loadApplications();
    }

    loadApplications() {
        const user = this.authService.currentUser();
        if (!user?.id) return;

        this.loading.set(true);
        this.appService.getByUser(user.id).subscribe({
            next: (apps) => {
                this.applications.set(apps);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    changeStatus(event: { id: number, status: string }) {
        this.appService.updateStatus(event.id, event.status).subscribe({
            next: (updated) => {
                this.applications.update(apps =>
                    apps.map(a => a.id === event.id ? { ...a, status: updated.status } : a)
                );
            }
        });
    }

    changeNotes(event: { id: number, notes: string }) {
        this.appService.updateNotes(event.id, event.notes).subscribe({
            next: () => {
                this.applications.update(apps =>
                    apps.map(a => a.id === event.id ? { ...a, notes: event.notes } : a)
                );
            }
        });
    }

    deleteApp(id: number) {
        this.appService.delete(id).subscribe({
            next: () => {
                this.applications.update(apps => apps.filter(a => a.id !== id));
            }
        });
    }

    countByStatus(status: string): number {
        return this.applications().filter(a => a.status === status).length;
    }
}
