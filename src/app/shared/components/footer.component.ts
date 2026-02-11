import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="bg-white border-t border-gray-100 py-8 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="flex items-center gap-2.5">
            <div class="bg-gradient-to-br from-indigo-600 to-violet-600 p-1.5 rounded-xl shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <span class="text-lg font-extrabold">
              <span class="text-gray-900">Job</span><span class="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Keyn</span>
            </span>
          </div>
          
          <p class="text-sm text-gray-500">
            © {{ currentYear }} JobKeyn. Tous droits réservés. - Projet Soutenance Croisée
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
