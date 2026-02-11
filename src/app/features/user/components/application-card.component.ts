import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobApplication } from '../../../core/models/interactions.model';

@Component({
    selector: 'app-application-card',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
      <!-- Header -->
      <div class="flex items-start justify-between gap-4 mb-4">
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-bold text-gray-900 truncate">{{ application.title }}</h3>
          <p class="text-sm font-semibold text-indigo-600 mt-1">{{ application.company }}</p>
          <div class="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-2">
            <span class="flex items-center gap-1">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              {{ application.location }}
            </span>
            <span class="flex items-center gap-1">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Ajouté le {{ application.dateAdded | date:'dd/MM/yyyy' }}
            </span>
          </div>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <a [href]="application.url" target="_blank" rel="noopener"
             class="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all" title="Voir l'offre">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
          </a>
          <button (click)="onDelete.emit(application.id!)"
                  class="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all" title="Supprimer">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Status + Source -->
      <div class="flex items-center gap-3 mb-4">
        <select [ngModel]="application.status" (ngModelChange)="onStatusChange.emit({id: application.id!, status: $event})"
                class="px-3 py-2 rounded-xl border border-gray-200 text-sm font-semibold bg-gray-50 focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all cursor-pointer"
                [ngClass]="{
                  'text-amber-700': application.status === 'en_attente',
                  'text-emerald-700': application.status === 'accepte',
                  'text-red-600': application.status === 'refuse'
                }">
          <option value="en_attente">⏳ En attente</option>
          <option value="accepte">✅ Accepté</option>
          <option value="refuse">❌ Refusé</option>
        </select>
        <span class="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-md uppercase">
          {{ application.apiSource }}
        </span>
      </div>

      <!-- Notes -->
      <div class="mt-3">
        <div class="flex items-center justify-between mb-2">
          <label class="text-sm font-semibold text-gray-700">Notes personnelles</label>
          <button *ngIf="editingNotes()" (click)="saveNotes()"
                  class="text-xs font-bold text-indigo-600 hover:text-indigo-700 px-3 py-1 rounded-lg hover:bg-indigo-50 transition-all">
            Enregistrer
          </button>
        </div>
        <textarea
          [ngModel]="application.notes"
          (ngModelChange)="currentNotes = $event"
          (focus)="editingNotes.set(true)"
          placeholder="Ajoutez vos notes ici (ex: date de relance, contact RH...)"
          rows="2"
          class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-600 transition-all resize-none placeholder-gray-400">
        </textarea>
      </div>
    </div>
  `
})
export class ApplicationCardComponent {
    @Input({ required: true }) application!: JobApplication;
    @Output() onStatusChange = new EventEmitter<{ id: number, status: string }>();
    @Output() onNotesChange = new EventEmitter<{ id: number, notes: string }>();
    @Output() onDelete = new EventEmitter<number>();

    editingNotes = signal(false);
    currentNotes = '';

    ngOnInit() {
        this.currentNotes = this.application.notes || '';
    }

    saveNotes() {
        this.onNotesChange.emit({ id: this.application.id!, notes: this.currentNotes });
        this.editingNotes.set(false);
    }
}
