# JobFinder - Application de Recherche d'Emplois

[![Angular](https://img.shields.io/badge/Angular-21-red?logo=angular)](https://angular.dev/)
[![NgRx](https://img.shields.io/badge/NgRx-State%20Management-purple)](https://ngrx.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Styling-blue?logo=tailwindcss)](https://tailwindcss.com/)

## 📋 Description

JobFinder est une Single Page Application (SPA) de recherche d'emplois développée avec Angular 21. L'application permet aux chercheurs d'emploi de consulter des offres internationales via l'API Adzuna, sauvegarder leurs favoris et suivre leurs candidatures.

## ✨ Fonctionnalités

### 🔐 Authentification
- Inscription avec validation (nom, prénom, email, mot de passe)
- Connexion avec persistance via localStorage
- Gestion du profil (modification, suppression du compte)
- Protection des routes avec authGuard

### 🔍 Recherche d'Emplois
- Recherche par mots-clés (titre du poste)
- Filtrage par localisation
- Pagination (10 résultats par page)
- Tri par date de publication (plus récent en premier)

### ❤️ Gestion des Favoris (NgRx)
- Ajout/suppression de favoris avec gestion d'état NgRx
- Indicateur visuel pour les offres favorites
- Page dédiée aux favoris

### 📊 Suivi des Candidatures
- Ajout d'offres au suivi
- Gestion des statuts (en_attente, accepté, refusé)
- Notes personnelles pour chaque candidature
- Page dédiée au suivi

## 🛠️ Technologies

| Catégorie | Technologies |
|-----------|-------------|
| Frontend | Angular 21 (Standalone Components) |
| State Management | NgRx (Store, Effects, Selectors) |
| Styling | TailwindCSS (CDN) |
| Forms | Reactive Forms |
| Backend (Simulé) | JSON Server |
| Containerisation | Docker & Docker Compose |

## 📁 Structure du Projet

```
src/app/
├── core/
│   ├── guards/
│   │   └── auth.guard.ts
│   ├── interceptors/
│   │   └── error.interceptor.ts
│   ├── models/
│   │   ├── interactions.model.ts
│   │   ├── job-offer.model.ts
│   │   └── user.model.ts
│   └── services/
│       ├── auth.service.ts
│       └── job.service.ts
├── features/
│   ├── auth/
│   │   ├── login.component.ts
│   │   ├── profile.component.ts
│   │   └── register.component.ts
│   ├── jobs/
│   │   └── components/
│   │       ├── job-card.component.ts
│   │       └── search-page.component.ts
│   └── user/
│       └── components/
│           ├── applications-page.component.ts
│           └── favorites-page.component.ts
├── shared/
│   └── components/
│       ├── footer.component.ts
│       └── navbar.component.ts
├── state/
│   └── favorites/
│       ├── favorites.actions.ts
│       ├── favorites.effects.ts
│       ├── favorites.reducer.ts
│       └── favorites.selectors.ts
├── app.config.ts
├── app.routes.ts
└── app.ts
```

## 🚀 Installation et Lancement

### Avec Docker (Recommandé)

```bash
# Cloner le projet
git clone <url-du-repo>
cd JobKeyn

# Lancer avec Docker Compose
docker compose up -d

# Accéder à l'application
# Frontend: http://localhost:3000
# Backend API: http://localhost:3001
```

### Sans Docker

```bash
# Installer les dépendances
npm install

# Lancer le backend JSON Server
npm run backend

# Dans un autre terminal, lancer le frontend
npm run start

# Accéder à l'application
# Frontend: http://localhost:4200
# Backend API: http://localhost:3000
```

## 📊 API Utilisée

L'application consomme l'API Adzuna via le proxy fourni :
- **Documentation** : https://job-finder-api-nine.vercel.app/

## 🔧 Configuration

### db.json (JSON Server)
```json
{
  "users": [],
  "favoritesOffers": [],
  "applications": []
}
```

### Variables d'environnement
Aucune configuration supplémentaire n'est nécessaire.

## 📝 Choix Techniques

### Pourquoi localStorage plutôt que sessionStorage ?
Le **localStorage** a été choisi pour la persistance de l'authentification car il permet à l'utilisateur de rester connecté même après la fermeture du navigateur, améliorant ainsi l'expérience utilisateur.

### Pourquoi NgRx pour les favoris ?
Le cahier de charge exige l'utilisation de NgRx. La gestion des favoris est un cas d'usage idéal car :
- État partagé entre plusieurs composants (job-card, favorites-page)
- Actions asynchrones avec effets (API calls)
- Besoin de garder l'état synchronisé

### Pourquoi TailwindCSS via CDN ?
Pour garantir une intégration rapide et fiable avec Angular 21, évitant les problèmes de configuration PostCSS.

## 🧪 Tests

Pour tester l'application :
1. **Inscription** : Créer un compte avec email/mot de passe
2. **Connexion** : Se connecter avec les identifiants créés
3. **Recherche** : Chercher des offres (ex: "developer" à "London")
4. **Favoris** : Cliquer sur le cœur pour ajouter aux favoris
5. **Suivi** : Cliquer sur "Suivre" pour ajouter au suivi
6. **Gestion** : Modifier le statut ou ajouter des notes

## 👤 Auteur

Projet réalisé dans le cadre de la Soutenance Croisée 2025/2026.

## 📄 Licence

Ce projet est à usage éducatif uniquement.
