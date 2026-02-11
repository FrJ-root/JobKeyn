import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-entreprises-page',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="mb-12 text-center">
        <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl">
          Entreprises qui recrutent
        </h1>
        <p class="mt-5 text-xl text-gray-500">
          Découvrez les entreprises partenaires de notre plateforme
        </p>
      </div>

      <!-- Sources API -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <div *ngFor="let source of sources" 
             class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all group">
          <div class="w-14 h-14 rounded-xl flex items-center justify-center mb-4 text-2xl"
               [style.background-color]="source.bgColor">
            {{ source.icon }}
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">{{ source.name }}</h3>
          <p class="text-sm text-gray-500 mb-4 leading-relaxed">{{ source.description }}</p>
          <div class="flex items-center gap-2">
            <span class="inline-block px-3 py-1 rounded-full text-xs font-medium"
                  [style.background-color]="source.bgColor" [style.color]="source.textColor">
              {{ source.type }}
            </span>
          </div>
        </div>
      </div>

      <!-- Popular companies -->
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Secteurs d'activité</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
        <div *ngFor="let sector of sectors"
             class="bg-white border border-gray-100 rounded-xl p-5 hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer group">
          <div class="text-3xl mb-3">{{ sector.icon }}</div>
          <h3 class="text-sm font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">{{ sector.name }}</h3>
          <p class="text-xs text-gray-400 mt-1">{{ sector.count }} offres</p>
        </div>
      </div>

      <div class="text-center mt-10">
        <a routerLink="/" 
           class="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Rechercher des offres
        </a>
      </div>
    </div>
  `
})
export class EntreprisesPageComponent {
    sources = [
        {
            name: 'Arbeitnow',
            description: 'Offres d\'emploi européennes et télétravail. Plus de 100 entreprises tech.',
            icon: '🇪🇺',
            bgColor: '#ecfdf5', textColor: '#059669',
            type: 'Europe & Remote'
        },
        {
            name: 'The Muse',
            description: 'Entreprises américaines premium avec profils détaillés et avis.',
            icon: '🇺🇸',
            bgColor: '#f5f3ff', textColor: '#7c3aed',
            type: 'USA & International'
        },
        {
            name: 'Adzuna',
            description: 'Agrégateur international couvrant plus de 16 pays dans le monde.',
            icon: '🌍',
            bgColor: '#eff6ff', textColor: '#2563eb',
            type: 'International'
        },
        {
            name: 'USAJobs',
            description: 'Portail officiel des emplois du gouvernement fédéral américain.',
            icon: '🏛️',
            bgColor: '#fef3c7', textColor: '#d97706',
            type: 'Gouvernement US'
        }
    ];

    sectors = [
        { name: 'Technologie', icon: '💻', count: '500+' },
        { name: 'Finance', icon: '💰', count: '200+' },
        { name: 'Santé', icon: '🏥', count: '150+' },
        { name: 'Marketing', icon: '📢', count: '180+' },
        { name: 'Éducation', icon: '🎓', count: '100+' },
        { name: 'Design', icon: '🎨', count: '120+' },
        { name: 'Ingénierie', icon: '⚙️', count: '250+' },
        { name: 'Ressources Humaines', icon: '👥', count: '90+' }
    ];
}
