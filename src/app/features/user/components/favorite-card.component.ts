import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoriteOffer } from '../../../core/models/interactions.model';

@Component({
    selector: 'app-favorite-card',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex items-center gap-4">
      <div class="flex-1 min-w-0">
        <h3 class="text-lg font-bold text-gray-900 truncate">{{ favorite.title }}</h3>
        <p class="text-sm font-semibold text-indigo-600 mt-1">{{ favorite.company }}</p>
        <div class="flex items-center gap-1 text-sm text-gray-500 mt-2">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          {{ favorite.location }}
        </div>
      </div>
      <button (click)="remove.emit(favorite.id!)"
              class="shrink-0 p-3 rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50 transition-all"
              title="Retirer des favoris">
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>
      </button>
    </div>
  `
})
export class FavoriteCardComponent {
    @Input({ required: true }) favorite!: FavoriteOffer;
    @Output() remove = new EventEmitter<number>();
}
