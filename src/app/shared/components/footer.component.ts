import { Component } from '@angular/core';

@Component({
    selector: 'app-footer',
    standalone: true,
    template: `
    <footer class="bg-white border-t border-gray-100 py-8 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="flex items-center gap-2">
            <div class="bg-indigo-600 p-1.5 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span class="text-lg font-bold text-gray-900">JobFinder</span>
          </div>
          
          <p class="text-sm text-gray-500">
            © {{ currentYear }} JobFinder. Tous droits réservés. - Projet Soutenance Croisée
          </p>
          
          <div class="flex items-center gap-4">
            <a href="https://job-finder-api-nine.vercel.app/" target="_blank" 
               class="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
              Documentation API
            </a>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
    currentYear = new Date().getFullYear();
}
