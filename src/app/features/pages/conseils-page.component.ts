import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-conseils-page',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="mb-12 text-center">
        <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl">
          Conseils Carrière
        </h1>
        <p class="mt-5 text-xl text-gray-500">
          Maximisez vos chances de décrocher le poste idéal
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div *ngFor="let tip of tips"
             class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-lg transition-all group">
          <div class="w-14 h-14 rounded-xl flex items-center justify-center mb-5 text-2xl"
               [style.background-color]="tip.bgColor">
            {{ tip.icon }}
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
            {{ tip.title }}
          </h3>
          <p class="text-gray-500 leading-relaxed text-sm">{{ tip.content }}</p>
        </div>
      </div>

      <!-- Stats section -->
      <div class="mt-16 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-10 text-center text-white">
        <h2 class="text-3xl font-bold mb-8">JobFinder en chiffres</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div *ngFor="let stat of stats">
            <div class="text-4xl font-extrabold">{{ stat.value }}</div>
            <div class="text-indigo-200 text-sm mt-1">{{ stat.label }}</div>
          </div>
        </div>
      </div>

      <div class="text-center mt-10">
        <a routerLink="/" 
           class="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
          Commencer ma recherche
        </a>
      </div>
    </div>
  `
})
export class ConseilsPageComponent {
    tips = [
        {
            icon: '📝', bgColor: '#eff6ff',
            title: 'Optimisez votre CV',
            content: 'Adaptez votre CV à chaque offre. Utilisez les mots-clés du poste et quantifiez vos réalisations avec des chiffres concrets.'
        },
        {
            icon: '🔍', bgColor: '#f0fdf4',
            title: 'Utilisez les bons mots-clés',
            content: 'Recherchez par titre de poste précis. Les recruteurs utilisent des termes spécifiques comme "Developer", "Engineer" ou "Manager".'
        },
        {
            icon: '🌍', bgColor: '#fef3c7',
            title: 'Élargissez votre zone géographique',
            content: 'Le télétravail ouvre de nouvelles opportunités. Essayez "Remote" comme localisation pour accéder à des offres internationales.'
        },
        {
            icon: '⭐', bgColor: '#fdf2f8',
            title: 'Sauvegardez vos favoris',
            content: 'Créez un compte pour sauvegarder les offres qui vous intéressent et suivre l\'avancement de vos candidatures.'
        },
        {
            icon: '📊', bgColor: '#f5f3ff',
            title: 'Suivez vos candidatures',
            content: 'Utilisez le suivi de candidature pour organiser vos démarches : en attente, accepté ou refusé. Ajoutez des notes pour chaque candidature.'
        },
        {
            icon: '🚀', bgColor: '#ecfdf5',
            title: 'Soyez réactif',
            content: 'Les meilleures offres partent vite. Consultez régulièrement les nouvelles offres et postulez dès que possible.'
        }
    ];

    stats = [
        { value: '4', label: 'APIs connectées' },
        { value: '500+', label: 'Offres quotidiennes' },
        { value: '16+', label: 'Pays couverts' },
        { value: '100%', label: 'Gratuit' }
    ];
}
